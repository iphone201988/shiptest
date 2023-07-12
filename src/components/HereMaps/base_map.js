import React, { Component } from 'react';
import {injectIntl, intlShape}  from "react-intl";
import {hereConfig} from 'constants/configs'
import MapWrapper from './map.style'
import {MarkerTemplate, roundIcon} from "./map_components";
import {secondToHHMM} from "helpers/data/datetime";

var convert = require('convert-units')
var equal = require('deep-equal');

class RouteMap extends Component {
  constructor(props) {
    super(props);
    this.platform = undefined;
    this.map = undefined;
    this.layers = undefined;
    this.mapElement = undefined;
    this.mapEvents = undefined;
    this.mapBehavior = undefined;
    this.mapUi = undefined;
    this.trackerGroup = undefined;
    this.resizeListener = undefined;
    this.mapViewChangeListener = undefined;

    // let routingParameters = this.getRouteParams(props.routeLocations)
    const app_id = hereConfig.appId;
    const appCode =  hereConfig.appCode;

    this.state = {
      app_id: app_id,
      app_code: appCode,
      company_location: undefined,
      initialized: false,
      width: props.width || "100%",
      height: props.height || "400px;",
      routingParameters: undefined ,//routingParameters,
      useCIT: true,
      useHTTPS: true,
      theme: 'normal.day', //props.theme,
      map_id: "here-map",
      style: '',
      visible: this.props.visible || false,
      remove_map: props.remove_map,
      reload_map: false,
      updateRoutes: false,
      updateCompanyLocations: false,
      updateShipments: false,
      updateShipment: false,
      trip_distance: undefined,
      travel_time: undefined,
      routeLocations: [],
      shipment: undefined,
      shipments: [],
      showTrackingBool: false,
      zoom_to: undefined,
      zoom_to_bool: false
    }
  }

  componentDidMount() {
    let zoom = false
    this.loadMap()
    
    if (this.props.width){
      this.setState({width: this.props.width})
    }
    if (this.props.height){
      this.setState({height: this.props.height})
    }
    if (this.props.routeLocations && this.props.routeLocations.length > 0){
      this.setState({routeLocations: this.props.routeLocations || [],
        reload_map: true, updateRoutes: true}, this.updateRoute)
    }

    if (this.props.company_location){
      this.setState({company_location: this.props.company_location || [], updateCompanyLocations: true},
        () => {this.updateCompanyLocation()})
    }

    if (this.props.tracking_data){
      this.setState({tracking_data: this.props.tracking_data || []},
        () => {this.updateTrackingData()})
    }

    if (this.props.company_locations && this.props.company_locations.length > 0){
      this.setState({company_locations: this.props.company_locations || [],
        reload_map: true, updateCompanyLocations: true}, this.updateCompanyLocations)
    }

    if (this.props.shipments){
      this.setState({shipments: this.props.shipments || [],
        reload_map: true, updateShipments: true}, this.updateMap)
    }
    if (this.props.zoom_to){
      // zoom = true
      this.setState({zoom_to: true})
    }

    if (this.props.map_id){
      this.setState({map_id: this.props.map_id})
    }

    if (this.props.shipment){
      this.setState({shipment: this.props.shipment, reload_map: true, updateShipment: true}, this.updateShipment)
    }

    if (zoom){
      this.zoomTo(this.props.zoom_to)
    }
  }

  componentDidUpdate(prevProps)  {

    let zoom = false

    if (!this.state.initialized){
      this.loadMap()
    }

    if (prevProps.company_location !== this.props.company_location){
      this.setState({company_location: this.props.company_location || [], updateCompanyLocations: true},
        () => {this.updateCompanyLocation()})
    }

    if (prevProps.tracking_data !== this.props.tracking_data){
      this.setState({tracking_data: this.props.tracking_data || []},
        () => {this.updateTrackingData()})
    }

    if (!equal(prevProps.routeLocations, this.props.routeLocations)){
      this.setState({routeLocations: this.props.routeLocations || [], updateRoutes: true},
          () => {this.updateRoute()})
    }
    if (!equal(prevProps.company_locations, this.props.company_locations)){
      this.setState({company_locations: this.props.company_locations || [], updateCompanyLocations: true},
          () => {this.updateCompanyLocations()})
    }

    if (!equal(prevProps.shipments,this.props.shipments)){
      this.setState({shipments: this.props.shipments || [], updateShipments: true},
          () => {this.updateShipments()})
    }
    if (!equal(prevProps.shipment,this.props.shipment)){
      this.setState({shipment: this.props.shipment, updateShipment: true},
          () => {this.updateShipment()})
    }

    if (this.props.remove_map && prevProps.remove_map !== this.props.remove_map){
      // this.removeMap()
    }
    if (prevProps.zoom_to !== this.props.zoom_to){
      zoom = true
    }
    if (prevProps.width !== this.props.width){
      this.setState({width: this.props.width})
    }
    if (prevProps.height !== this.props.height){
      this.setState({height: this.props.height})
    }
    if (prevProps.map_id !== this.props.map_id){
      this.setState({map_id: this.props.map_id})
    }

    if (zoom){
      this.zoomTo(this.props.zoom_to)
    }

  }
  componentWillUnmount() {
    this.removeMap()
  }


  getRouteParams(){

    const {routeLocations} = this.state

    let routingParameters = {
      // The routing mode:
      'mode': 'fastest;truck',
      'trailersCount' : 1,
      'representation': 'display',
      'routeattributes' : 'waypoints,summary,shape,legs',
      // 'excludeCountries': 'USA',
    }

    if (routeLocations) {
      routeLocations.forEach((shipment_location, index) => {
        try{
          const location = shipment_location.location
          const coordinates = location.navigationPosition ? location.navigationPosition.getCoordinates() :
            location.displayPosition.getCoordinates()
          let longitude = coordinates.longitude
          let latitude = coordinates.latitude
          if (longitude && latitude) {
            routingParameters[`waypoint${index}`] = `geo!${latitude},${longitude}`
          }
        }catch(e){}
      })
    }
    return routingParameters
  }

  getPlatform() {
    return new window.H.service.Platform(this.state);
  }

  getMap(container, layers, settings) {
    return new window.H.Map(container, layers, settings);
  }

  getEvents(map) {
    return new window.H.mapevents.MapEvents(map);
  }

  getBehavior(events) {
    return new window.H.mapevents.Behavior(events);
  }

  getUI(map, layers) {
    return new window.H.ui.UI.createDefault(map, layers);
  }

  removeMap() {
    try{
      document.getElementById(this.state.map_id).innerHTML = ""
      // this.mapElement.innerHTML = ""
    }catch(e){}

    try{
      this.map.dispose()
    }catch(e){}

    try{
      this.platform.dispose()
    }catch(e){}

    try{
      this.mapUi.dispose()
    }catch(e){}

    try{
      this.layers.dispose()
    }catch(e){}

    try{
      this.mapEvents.dispose()
    }catch(e){}

    try{
      this.mapBehavior.dispose()
    }catch(e){}

    this.setState({initialized: false})

  }

  changeTheme(theme, style) {
    var tiles = this.platform.getMapTileService({'type': 'base'});
    var layer = tiles.createTileLayer(
      'trucktile',
      theme,
      256,
      'png8',
      {'style': 'fleet'}
    );
    this.map.setBaseLayer(layer);
  }

  setMinMapZoom = () => {
    const min_zoom = 10 ;
    if (this.map.getZoom() < min_zoom){
      this.map.setZoom(min_zoom)
    }
  }

  zoomTo = (location) => {
    let group = new window.H.map.Group();
    const coordinates = location.profile.address.displayPosition.getCoordinates()
    const marker = new window.H.map.Marker({lat: coordinates.latitude, lng: coordinates.longitude})

    group.addObject(marker);
    this.map.setViewBounds(group.getBounds(), true);
    this.map.setZoom(70);
  }

  loadMap = () => {
    if (this.platform === undefined){
      this.platform = this.getPlatform();
    }
    if (this.layers === undefined){
      this.layers = this.platform.createDefaultLayers();
    }

    if (this.mapElement === undefined){
      this.mapElement = document.getElementById(this.state.map_id);
    }

    if (this.map === undefined){
        this.map = this.getMap(this.mapElement , this.layers.normal.map);
      }

    if (this.mapEvents === undefined){
      this.mapEvents = this.getEvents(this.map);
    }

    if (this.mapBehavior === undefined){
      this.mapBehavior = this.getBehavior(this.mapEvents);
    }

    if (this.mapUi === undefined){
      this.mapUi = this.getUI(this.map, this.layers);
    }

    this.changeTheme("normal.day", "");
    this.setMinMapZoom()

    this.resizeListener = this.map.addEventListener('resize', () => this.map.getViewPort().resize());

    this.mapViewChangeListener = this.map.addEventListener('mapviewchangeend', () => {
      const {reload} = this.state

      if (reload){
        const max_zoom = 30
        if (this.map.getZoom() > max_zoom){
          this.map.setZoom(max_zoom)
        }
      }
    } )

    this.setState({initialized: true})

  }

  updateMap(){

  }

  updateRoute = () => {
    let routingParameters =  this.getRouteParams()

    var router = this.platform.getRoutingService();
    router.calculateRoute(routingParameters, this.onRouteResult,
      function(error) {
        alert(error.message);
      });
    this.setState({updateRoutes: false})
  }

  updateTrackingData = () => {
      const trackingData = this.state.tracking_data || []
      var group = new window.H.map.Group();
      const markers = []
      let index = 0 ;
      try {

        trackingData.map(trackData => {
          const coordinates = trackData.position?.geopoint
          if (coordinates){
            const icon = new window.H.map.Icon(MarkerTemplate({'fillColor': "blue", 'text': index+1}))
            const marker = new window.H.map.Marker({lat: coordinates.latitude, lng: coordinates.longitude},{icon: icon})
            markers.push(marker) ;
            index += 1
          }
        })
      }catch (e) {
      }
      if (markers.length > 0){
        group.addObjects(markers);
        this.map.addObject(group);
        this.map.setViewBounds(group.getBounds(), true);
        this.map.setZoom(14)
      }
  }

  updateCompanyLocation = () =>{
    const company_location = this.state.company_location || []
    var group = new window.H.map.Group();
    const markers = []
    let index = 0
    try {
      const coordinates = company_location.profile.address.displayPosition.getCoordinates()
      const icon = new window.H.map.Icon(MarkerTemplate({'fillColor': "red", 'text': index+1}))
      const marker = new window.H.map.Marker({lat: coordinates.latitude, lng: coordinates.longitude},{icon: icon})
      markers.push(marker)
      index += 1
    }catch (e) {

    }
    this.setState({updateCompanyLocations: false})

		if (markers.length > 0){
			group.addObjects(markers);
			this.map.addObject(group);
			this.map.setViewBounds(group.getBounds(), true);
      this.map.setZoom(14)
		}
    // this.map.addObjects(markers);
  }

  updateCompanyLocations = () =>{
    const company_locations = this.state.company_locations || []
    var group = new window.H.map.Group();
    const markers = []
    let index = 0
    company_locations.forEach(company_location => {
      try {
        const coordinates = company_location.profile.address.displayPosition.getCoordinates()
        const icon = new window.H.map.Icon(MarkerTemplate({'fillColor': "red", 'text': index+1}))
        const marker = new window.H.map.Marker({lat: coordinates.latitude, lng: coordinates.longitude},{icon: icon})
        markers.push(marker)
        index += 1
      }catch (e) {

      }
      this.setState({updateCompanyLocations: false})

    })

		if (markers.length > 0){
			group.addObjects(markers);
			this.map.addObject(group);
			this.map.setViewBounds(group.getBounds(), true);
		}
    // this.map.addObjects(markers);
  }

  updateShipments = () => {

    const shipments = this.state.shipments || []
    let group = new window.H.map.Group("");
    const markers = []

    shipments.forEach(shipment => {
      try {
        const coordinates = ((shipment.tracking || {}).position || {}).geopoint || {}
        if (coordinates.latitude !== undefined && coordinates.longitude !== undefined){
          const icon = new window.H.map.Icon(roundIcon({'fillColor': "red"}))
          const marker = new window.H.map.Marker({lat: coordinates.latitude, lng: coordinates.longitude},{icon: icon})
          markers.push(marker)
        }

      }catch (e) {
        console.error(e.message)
      }

    })
    if (markers.length > 0){
      group.addObjects(markers);
      if (this.trackerGroup !== undefined){
        this.map.removeObject(this.trackerGroup)
      }
      this.trackerGroup = this.map.addObject(group);
      // this.map.setViewBounds(this.trackerGroup.getBounds(), true);
    }

    this.setState({updateShipments: false})
  }

  updateShipment = () => {
  //TODO: change route to itinerary
    const shipment = this.state.shipment
    let group = new window.H.map.Group("");
    const markers = []

    const routeLocations = shipment?.getRouteLocations() // shipment.destinations()

    let setRouteCondition = true
    try{
      setRouteCondition = (!Array.isArray(this.state.routeLocations) || this.state.routeLocations.length === 0  || !routeLocations.every((routeLocation, index1) =>
          routeLocation.location.id === this.state.routeLocations[index1].location.id))
    }catch (e){
      setRouteCondition = true
    }

    if (setRouteCondition){
      this.setState({routeLocations: routeLocations || []}, this.updateRoute)
    }

    // TODO:  change tracking function  which should be done through Devicetracking
    // try{
    //   const coordinates = ((shipment.tracking || {}).position || {}).geopoint || {}
    //   if (coordinates.latitude !== undefined && coordinates.longitude !== undefined){
    //     const icon = new window.H.map.Icon(roundIcon({'fillColor': "red"}))
    //     const marker = new window.H.map.Marker({lat: coordinates.latitude, lng: coordinates.longitude},{icon: icon})
    //     markers.push(marker)
    //   }
    // }catch (e) {
    //   console.error(e.message)
    // }

    if (markers.length > 0){
      group.addObjects(markers);
      if (this.trackerGroup !== undefined){
        this.map.removeObject(this.trackerGroup)
      }
      this.trackerGroup = this.map.addObject(group);
      // this.map.setViewBounds(this.trackerGroup.getBounds(), true);
    }

    this.setState({updateShipment: false})
  }

  onRouteResult = (result) => {
    var route,
      routeShape,
      linestring;
    if(result.response && result.response.route) {
      // Pick the first route from the response:
      route = result.response.route[0];
      // Pick the route's shape:
      routeShape = route.shape;

      // Create a linestring to use as a point source for the route line
      linestring = new window.H.geo.LineString();

      // Push all the points in the shape into the linestring:
      routeShape.forEach(function(point) {
        var parts = point.split(',');
        linestring.pushLatLngAlt(parts[0], parts[1]);
      });

      const markers = route.waypoint.map((waypoint, index) => {
        const point = waypoint.mappedPosition
        const icon = new window.H.map.Icon(MarkerTemplate({'fillColor': "red", 'text': index+1}))
        return new window.H.map.Marker({
          lat: point.latitude,
          lng: point.longitude
        },{icon: icon})
      })


      const routeLine = new window.H.map.Polyline(linestring, {
        style: { strokeColor: 'blue', lineWidth: 10 },
        arrows: { fillColor: 'white', frequency: 2, width: 0.8, length: 0.7 }
      });

      var group = new window.H.map.Group();

      group.addObjects([routeLine].concat(markers));
      this.map.addObject(group);

      // Add the route polyline and the two markers to the map:
      // this.map.addObjects([routeLine].concat(markers));

      // Set the map's viewport to make the whole route visible:
      this.map.setViewBounds(group.getBounds(), true);

      let summary = route.summary
      // this.setState({trip_distance: `${summary.trip_distance/1000} km`})
      //  TODO: Unit class  every unit should a object of Unit and contains value and unit type and can be converted
      this.setState({
        trip_distance: convert(summary.distance).from('m').to('km').toFixed(1),
        travel_time: secondToHHMM(summary.travelTime)
      })
    }
  }

  tripSummary = () => {
    const {trip_distance, travel_time} = this.state
    // trip_distance = trip_distance.replace(/(<([^>]+)>)/ig,"");
    const trip_summary_prefix = this.props.intl.formatMessage({id: "map.trip_summary_prefix"})
    const km = this.props.intl.formatMessage({id: "unit.km"})
    const trip_time_prefix = this.props.intl.formatMessage({id: "map.trip_time_prefix"})
    const trip_time_postfix = this.props.intl.formatMessage({id: "map.trip_time_postfix"})
    return (trip_distance && travel_time) ?
      `${trip_summary_prefix} ${trip_distance} ${km} ${trip_time_prefix} ${travel_time} ${trip_time_postfix}` : ""
  }

  render() {

    const {width, height, map_id} = this.state

    return (
      <MapWrapper>
        <div id={map_id} style={{width: width, height: height}}/>
      </MapWrapper>
    );
  }
}

RouteMap.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(RouteMap)