import 'antd/dist/antd.css';
import React from "react";
import Loader from "components/utility/loader";
import { connect } from "react-redux";
import {notifyError, notifySuccess} from "components/notification";
import {compose} from "redux";
import {firebaseConnect} from "react-redux-firebase";
import {PropTypes} from "prop-types";
import { assignUserResources } from "helpers/firebase/firebase_functions/users";
import {injectIntl, intlShape} from "react-intl";
import FormBox from "containers/base/form_box";
import {getSpan} from "constants/layout/grids";
import {BoxWrapper} from "components/utility/box.style";
import {objectToKeyValList} from 'helpers/data/mapper'
import {trailerMapToSelectOptions, vehiclesMapToSelectOptions} from "helpers/containers/states/assets";


class UserResourcesView extends React.Component {

  static propTypes = {
    firebase: PropTypes.object,
    companyId: PropTypes.string,
    activeVehicles: PropTypes.object,
    activeTrailers: PropTypes.object
  }

  constructor(props){
    const INITIAL_STATE = {
      is_shipper: false,
      user: props.user || null,
      remove_map: props.remove_map || false,
    }

    super(props);
    this.state = { 
      ...INITIAL_STATE, 
      formInputs: undefined,
      vehicleOptions: [],
      trailerOptions: [],
      vehiclesReady: false,
      trailersReady: false,
      legOptions: [],
    };
  }

  componentDidMount() {
    if (this.props.activeVehicles != undefined){
      this.setVehiclesOptions()
    }
    if (this.props.activeTrailers != undefined){
      this.setTrailersOptions()
    }
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.state.formInputs !== prevState.formInputs){
      this.setState({formInputs: this.getFormInputs()});
    }
    if (prevProps.companyId !== this.props.companyId){
      this.setFilterConditions()
    }
    if (this.props.activeVehicles != prevProps.activeVehicles){
      this.setVehiclesOptions()
    }

    if (this.props.activeTrailers != prevProps.activeTrailers){
      this.setTrailersOptions()
    }
  }

  setVehiclesOptions = () => {
    this.setState({vehicleOptions: vehiclesMapToSelectOptions(this.props.activeVehicles)})
  }

  setTrailersOptions = () => {
    this.setState({trailerOptions: trailerMapToSelectOptions(this.props.activeTrailers)})
  }

  fetchLegsOptions = (shipment) => {
    if (shipment) {
      const interconnections = shipment.itinerary_sequence.interconnections
      const legData = objectToKeyValList(interconnections)
      const LegsOptions = this.KeyValListToOptionsLeg(legData)
      return LegsOptions
    }
  }
  
  KeyValListToOptionsLeg = (KeyValList) => {
    return KeyValList.map(kv => {return {label: this.props.intl.formatMessage({id: `Leg ${Number(kv.key) + 1}` }),value: kv.value.id}})
  }

  KeyValListToOptionsVehicleTrailer = (KeyValList) => {
    return KeyValList.map(kv => {return {label: this.props.intl.formatMessage({id: `${kv.value.profile.make}, ${kv.value.profile.model}, ${kv.value.profile.year}`}),value: kv.key}})
  }

  getFormInputs = () =>{
    const { trailerOptions, vehicleOptions, user } = this.state
    const trailers = user.resources.trailers
    const vehicles = user.resources.vehicles

    const ItemlabelCol = {
			xs: {span: 10},
			sm: {span: 8},
			md: {span: 6},
			lg: {span: 2},
		}

		const ItemWrapperCol = {
			xs: {span: 4},
			sm: {span: 6},
			md: {span: 8},
			lg: {span: 10},
		}

		const WrapperCol = {
			xs: {span: 18},
			sm: {span: 16},
			md: {span: 14},
			lg: {span: 24},
		}

    const formInputs = {
      form_type: "regular",
      submit_label: this.props.intl.formatMessage({id:"general.submit"}),
      formProps:{
        layout: "horizontal",
      },
      sections: [
        {
          key: "resources_assignments",
          size: "full",
          title: this.props.intl.formatMessage({id:"general.vehicle"}),
          groups: [
            {
            name: "vehicles",
            wrapperCol: {...getSpan(24)},
            groupWrapper:{
              type: "box",
              props: {size: "small"},
            },
            items:[
                {
                  name: "selectVehicle",
                  type: "selectField",
                  formItemProps:{
                    initialValue: vehicles ? vehicles.map(id => {
                      return id
                    }) : undefined,
                    rules:[{
                      required: false
                    }],
                    label : this.props.intl.formatMessage({id:"general.vehicle"}),
                    labelCol: ItemlabelCol,
                    wrapperCol: ItemWrapperCol
                  },
                  fieldProps:{
                    mode: "multiple",
                    options: vehicleOptions,
                  },
                  wrapperCol: WrapperCol
                },
              ]
            },
            {
              name: "trailers",
              wrapperCol: {...getSpan(24)},
              groupWrapper:{
              type: "box",
              props: {size: "small"},
            },
              items:[
                {
                  name: "selectTrailer",
                  type: "selectField",
                  formItemProps:{
                    initialValue: trailers ? trailers.map(id => {
                      return id
                    }) : undefined,
                    rules:[{
                      required: false
                    }],
                    label : this.props.intl.formatMessage({id:"trailer.title"}),
                    labelCol: ItemlabelCol,
                    wrapperCol: ItemWrapperCol
                  },
                  fieldProps:{
                    mode: "multiple",
                    options: trailerOptions
                  },
                  wrapperCol: WrapperCol
                },
              ]
            }
          ]
        }
      ]
    }

    return formInputs
  }

  loading = (loading) => {
    this.setState({loading: loading})
  }

  onDone = () => {

    if (this.props.onDone){
        this.props.onDone()
    }
    this.props.onCloseDetail()
  }

  defaultResources = (shipment, options, field) => {
    let defaultOption = ""
    const resources = shipment.transport_resources[field]
    if (resources?.length) {
      for (let resource of options) {
        if (resources.includes(resource.value)) {
          defaultOption = resource.value
          return defaultOption
        }
      }
    } else {
      return null
    }
  }

  formatResourcesValues(data, type) {
    const asset_array = []
    data.forEach(id => {
      const info = { id: id, type: type }
      asset_array.push(info)
    })
    return asset_array
  }
 
  onSubmit = (values) => {

    this.loading(true)
    const resources = {}

    if (values.selectVehicle !== undefined){
      resources.vehicles_assignments = this.formatResourcesValues(values.selectVehicle, "vehicle")
    }
    
    if (values.selectTrailer !== undefined){
      resources.trailers_assignments = this.formatResourcesValues(values.selectTrailer, "trailer")
    }

    const resourceData = {
      user_id:  this.props.user.id,
      resources: resources
    }

    return assignUserResources(resourceData).then(res => {
      notifySuccess("notification.success.resources_assigned", this.props.intl)
      this.onDone()
      this.loading(false)
    }).catch(e => {
      notifyError("notification.fail.resources_assigned", this.props.intl)
      this.loading(false)
    })
  }

  onCloseDetail = () => {
    this.props.onCloseDetail()
  }

  isReady = () => {
    const {trailerOptions, vehicleOptions } = this.state
    return trailerOptions?.length != undefined && vehicleOptions?.length != undefined
  }

  render() {
    const { formInputs } = this.state

    if (!this.isReady()) {
      return (
        <Loader></Loader>                
      )
    } else {
      const initialInputs = this.getFormInputs();
      return (
        <BoxWrapper>
            {initialInputs ?
              <FormBox
                  title={this.props.intl.formatMessage({id: 'general.actions.add_quote_request'})}
                  formInputs={formInputs ? formInputs : initialInputs}
                  onSubmit={this.onSubmit}
                  onCloseDetail={this.onCloseDetail}
              />: ""}
        </BoxWrapper>)
    }
  }
}

UserResourcesView.propTypes = {
  intl: intlShape.isRequired
}

const mapStateToProps = state => {
  return {
    firebase: state.FB.firebase,
		companyId: state.FB.company.companyId,
    activeVehicles: state.FB.assets.activeVehicles,
    activeTrailers: state.FB.assets.activeTrailers,
  }
}

export default compose(
  connect(mapStateToProps, {}),
  firebaseConnect()
)(injectIntl(UserResourcesView))