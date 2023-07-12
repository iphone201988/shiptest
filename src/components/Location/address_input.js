import {PureComponent} from "react";
import HereGeocoder from "helpers/here/rest/geocoder"
import Place from "helpers/here/rest/place"
import React from "react";
import AutoComplete from "antd/es/auto-complete"
import {Location, PlaceSuggestion} from "model/location/location";
import {PropTypes} from "prop-types";
import {TimeZoneToUTCOffset} from "helpers/data/format";
import {injectIntl} from "react-intl";

const Option = AutoComplete.Option

class AddressInput extends PureComponent {

  constructor(props) {
    super(props);

    const INITIAL_STATE = {
      mode: "online",
      defaultValue: undefined,
      value: null,
      ValueId: "",
      searchResults: {},
      country: 'CAN,USA',
      selectedLocation: null,
      propsChange: true
    }

    this.state = {...INITIAL_STATE};
  }

  static validateSelectedAddressValue = (rule, value, callback) =>{
    try{
      const address = JSON.parse(value)
      if (!(address.locationId && address.Address)){
        throw new Error("Error")
      }
      callback();
    }catch(error){
      // callback(this.context.intl.formatMessage("general.validation.enter_valid_address"))
      callback("Select a valid Location")
    }

  }

  componentDidMount() {
    const {searchResults} = this.state

    if (this.props.value instanceof Location){
      // const new_data_source = {}
      const value = this.props.value
      const id = value.locationId
      searchResults[id] = value
      this.setState({defaultValue: value.label, searchResults: searchResults},() => this.onSelect(value, {key:id}))
      // this.setState({ValueId: id, value: value.label || "", searchResults: searchResults},() => this.onSelect(value, {key:id}))
    }else{
      this.setState({defaultValue: ""})
    }

    if (this.props.mode){
      this.setState({mode:this.props.mode})
    }

    if (this.props.searchResults){
      this.setState({searchResults: this.props.searchResults})
    }
  }

  componentDidUpdate(prevProps){
    const {searchResults} = this.state

    if (prevProps.searchResults !== this.props.searchResults){
      this.setState({searchResults: this.props.searchResults})
    }

    if (( prevProps.value !== this.props.value)) {
      // let new_data_source = {}
      if (this.props.value && this.props.value.locationId){
        searchResults[this.props.value.locationId] = this.props.value
      }

      this.setState(
          {
            // value: this.props.value,
            onSelect: this.props.onSelect,
            searchResults: searchResults,
            propsChange: true
          })
    }

  }

  completePlace = (id) => {
    return Place.place(id).then(data => {  return new Place(data)})
  }

  selectPlaceLocation = (placeSuggestion) => {
    const pos = placeSuggestion.position
    const params = {searchtext:placeSuggestion.label, prox: `${pos.latitude},${pos.longitude},50`, maxresults: 1}
    return HereGeocoder.geocode(params, "houseNumber").then(result =>{

      const loc = result.Location
      const locationData = {locationId: loc.LocationId, displayPosition: {geopoint: loc.DisplayPosition},
        navigationPositions: loc.NavigationPosition.map((pos) => {return {geopoint: pos}}), address: loc.Address}

      const location  = new Location(locationData)

      return location
    })
  }

  SelectLocation = (location) => {

    let params = {}
    params = {locationid: location.locationId}

    return HereGeocoder.geocode(params).then(result => {

        const locationDetails = result.Location
        let displayPosition = undefined
        let navigationPosition =  undefined

        try{
          displayPosition = Location.position(locationDetails.DisplayPosition.Latitude,
            locationDetails.DisplayPosition.Longitude)
        }catch(e){
          console.error(e.toString())
        }

        try{
          navigationPosition = Location.position(locationDetails.NavigationPosition[0].Latitude,
            locationDetails.NavigationPosition[0].Longitude)
        }catch(e){
          navigationPosition = displayPosition
        }

        let utc_offset = 0
        try{
          utc_offset = TimeZoneToUTCOffset(locationDetails.AdminInfo.TimeZoneOffset)
        }catch (e) {
          utc_offset = 0
        }

        const location_data = {
          locationId: locationDetails.LocationId || "",
          placeId: locationDetails.placeId || "",
          displayPosition: displayPosition,
          navigationPosition: navigationPosition,
          address: locationDetails.Address,
          utc_offset: utc_offset
        }
        const location  = new Location(location_data)

        return location
        }
      )

  }

  completeLocation = (location) => {
    return HereGeocoder.geocode({locationid: location.locationId}).then(Result => {

      const locationDetail = Result.Location
      let displayPosition = Location.position(0.0,0.0)
      let navigationPosition =  Location.position(0.0,0.0)

      try{
        displayPosition = Location.position(locationDetail.DisplayPosition.Latitude,
          locationDetail.DisplayPosition.Longitude)
      }catch(e){
        console.error(e.toString())
      }

      try{
        navigationPosition = Location.position(locationDetail.NavigationPosition[0].Latitude,
          locationDetail.NavigationPosition[0].Longitude)
      }catch(e){
        navigationPosition = displayPosition
      }

        location.displayPosition = displayPosition
        location.navigationPosition = navigationPosition
        try{
          location.utc_offset = TimeZoneToUTCOffset(locationDetail.AdminInfo.TimeZoneOffset)
        } catch (e) {
          location.utc_offset = ""
        }

      return location
    })

  }

  handlePlaceSearch = value => {

    const {country, mode} = this.state
    if (mode === "online"){
      this.setState({propsChange: false})
      const country_filter = country ? `countryCode=${country}` : ""

      const address_filter =  country_filter

      if (value && value.length >= 3){
        let params = {q: value, addressFilter: address_filter, "result_types": "address"}

        Place.autosuggest(params).then(suggestions => {

              let placeSuggestions = {}
              suggestions.forEach( suggestion => {

                    const placeSuggestion = new PlaceSuggestion(suggestion)
                    placeSuggestions[suggestion.id] = placeSuggestion
                  }
              )

              return placeSuggestions
            }
        ).then((result) => this.setState({searchResults: result}))
            .catch(error=>{console.error('Error:', error)})
      }
    }
  }

  handleSearch = value => {

    const {country, mode} = this.state
    this.setState({propsChange: false})

    if (value.length >= 1){
      let params = {query: value, maxresults: 5, resultType:'address'}
      if (country != null){
        params.country = country
      }
      if (mode === 'online'){
        HereGeocoder.suggest(params) // {matchLevel: 'houseNumber'}
            .then(suggestions =>
                {
                  let locations = {}
                  suggestions.forEach(suggestion => {
                        locations[suggestion.locationId] = new Location(suggestion)
                      }
                  )
                  return locations
                }
            ).then((result) => this.setState({searchResults: result}))
            .catch(error=>{console.error('Error:', error)})
      }

    }
  }

  onSelect = (value, option) => {

    const {searchResults} = this.state
    const place = searchResults[option.key]
    if (place instanceof PlaceSuggestion){
      this.selectPlaceLocation(place).then(location => {
        if (typeof this.props.onSelect === 'function'){
          this.props.onSelect(location)
        }
        this.setState({selectedLocation: true})
      })
    }else if (place instanceof Location){
      if (typeof this.props.onSelect === 'function'){
        this.props.onSelect(place)
      }

      this.setState({selectedLocation: place})
    }
  }

  onChange = (value) => {

    if (this.state.selectedLocation){
      if (value === undefined || value === ""){
        this.props.onSelect(undefined)
        this.setState({selectedLocation: false})
        this.setState({ValueId: ""})
      }else{
        this.setState({ValueId: this.state.ValueId})
      }
    }
    else{
      this.setState({ValueId: value})
    }
    //
  }

  renderOption = location  => {
     return (<Option key={location.id} value={location.label || ""}>{location.label || ""}</Option>);
  }

  toOptions = SearchResults => {
    return Object.values(SearchResults).map(location  => ({label: location.label, value: location.label, key: location.id}))
  }

  render(){
    const { searchResults, defaultValue } = this.state;

    return(
        defaultValue !== undefined ?
              <AutoComplete
                  defaultValue={defaultValue}
                  addonAfter={this.props.addonAfter}
                  options={this.toOptions(searchResults)}
                  onSelect={this.onSelect}
                  onSearch={this.handlePlaceSearch}
                  onChange={this.onChange}
                  style={this.props.style}
                  allowClear
                  placeholder={this.props.placeholder ||  this.props.intl.formatMessage({id: "general.address"})}
              >
              </AutoComplete>
    : ""
    )
  }
}

AddressInput.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(AddressInput)