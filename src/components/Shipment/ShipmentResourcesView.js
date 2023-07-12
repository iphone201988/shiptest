import React from "react";
import Loader from "components/utility/loader";
import { connect } from "react-redux";
import {notifyError, notifySuccess} from "components/notification";
import {compose} from "redux";
import {firebaseConnect} from "react-redux-firebase";
import {PropTypes} from "prop-types";
import { assignShipmentTransportResources } from "helpers/firebase/firebase_functions/shipments";
import {injectIntl, intlShape} from "react-intl";
import 'antd/dist/antd.css';
import FormBox from "containers/base/form_box";
import {getSpan} from "constants/layout/grids";
import {BoxWrapper} from "components/utility/box.style";
import {objectToKeyValList, objectToLabelValue} from 'helpers/data/mapper'
import {vehiclesMapToSelectOptions, trailerMapToSelectOptions} from "helpers/containers/states/assets";
import {usersMapToSelectOptions} from "helpers/containers/states/users";
// "helpers/firebase/firebase_functions/notifications"
import { createNotification, updateNotification } from "helpers/firebase/firebase_functions/notification";

class ShipmentResourcesView extends React.Component {

  static propTypes = {
    firebase: PropTypes.object,
    companyId: PropTypes.string,
    activeDrivers: PropTypes.object,
    activeVehicles: PropTypes.object,
    activeTrailers: PropTypes.object,
    userId: PropTypes.string,
  }

  constructor(props){
    const INITIAL_STATE = {
      is_shipper: false,
      shipment: props.shipment || null,
      remove_map: props.remove_map || false,
    }

    super(props);
    this.state = { 
      ...INITIAL_STATE, 
      formInputs: undefined,
      driverOptions: undefined,
      vehicleOptions: undefined,
      trailerOptions: undefined,
      trailersReady: false,
      legOptions: [],
    };
  }

  componentDidMount() {
    if (this.props.activeDrivers != undefined){
      this.setDriverOptions()
    }
    if (this.props.activeVehicles != undefined){
      this.setVehiclesOptions()
    }
    if (this.props.activeTrailers != undefined){
      this.setTrailersOptions()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {driverOptions, vehicleOptions, trailerOptions} = this.state


    if (this.props.activeDrivers != prevProps.activeDrivers){
      this.setDriverOptions()
    }

    if (this.props.activeVehicles != prevProps.activeVehicles){
      this.setVehiclesOptions()
    }

    if (this.props.activeTrailers != prevProps.activeTrailers){
      this.setTrailersOptions()
    }

    if (this.isReady() &&
      (   driverOptions !== prevState.driverOptions ||
        trailerOptions !== prevState.trailerOptions ||
        vehicleOptions !== prevState.vehicleOptions
      )){
      this.setOptions()
    }
  }

  setOptions = () => {
    this.setFormInputs()
  }

  fetchLegsOptions = (shipment) => {
    if (shipment) {
      // console.log(shipment);
      const interconnections = shipment.itinerary_sequence.interconnections
      // console.log('*****', interconnections);
      const legData = objectToKeyValList(interconnections)
      // console.log('*****', legData);
      const LegsOptions = this.KeyValListToOptionsLeg(legData);
      // console.log('*****', LegsOptions);
      return LegsOptions
    }
  }

  fetchSelectedLegs = (shipment, type, assignment, legsOptionsMap={}) => {
    const transport_resources = shipment.transport_resources
    if (transport_resources){
      const assignments = transport_resources[assignment]
      const legsOptionsIds =  Object.keys(legsOptionsMap)

      const selectedLegs = new Set()
      assignments.forEach(assignment =>{
        const interconnection_id = Array.isArray(assignment.interconnection_id) ? assignment.interconnection_id : [assignment.interconnection_id]
        const interconnections = (interconnection_id || []).filter(id => legsOptionsIds.includes(id))
        //TODO  map the interconnection to {label: 'leg_x', value: 'interconnection_id'  using the LegMap  {interconnection: label}
        // const selectLegsKeyVal = interconnections.map(interconnection =>{return {interconnection: legsOptionsMap[interconnection]}})
        const selectedLegsVals = interconnections.length > 0 ? interconnections : legsOptionsIds
        selectedLegsVals.forEach(value => {selectedLegs.add(value)})
      })
      return Array.from(selectedLegs).sort()
    }
  }

  fetchTransportResourcesAssignments = (shipment, type, assignment, legsOptionsMap={}) => {
    const transport_resources = shipment.transport_resources
    const transportResourcesAssignments = []
    const legsOptionsIds =  Object.keys(legsOptionsMap)

    if (transport_resources){
      const assignments = transport_resources[assignment]
      assignments.forEach(assignment => {
        const interconnection_ids = assignment.interconnection_id.length > 0 ? assignment.interconnection_id : legsOptionsIds
        transportResourcesAssignments.push({
          interconnection_id: interconnection_ids,
          resource_id: (assignment.resource || {}).id
        })
      })
    }
    if (transportResourcesAssignments.length === 0){
      // The default value
      transportResourcesAssignments.push({
        interconnection_id: legsOptionsIds,
        resource_id: undefined
      })
    }
    return transportResourcesAssignments
  }

  setDriverOptions = () => {
    this.setState({ driverOptions: usersMapToSelectOptions(this.props.activeDrivers)})
  }

  setVehiclesOptions = () => {
    this.setState({vehicleOptions: vehiclesMapToSelectOptions(this.props.activeVehicles)})
  }

  setTrailersOptions = () => {
    this.setState({trailerOptions: trailerMapToSelectOptions(this.props.activeTrailers)})
  }

  KeyValListToOptionsLeg = (KeyValList) => {
    return KeyValList.map(kv => {return {label: `Leg ${Number(kv.key) + 1}`,value: kv.value.id}})
  }

  KeyValListToOptionsVehicleTrailer = (KeyValList) => {
    return KeyValList.map(kv => {return {label: `${kv.value.profile.make}, ${kv.value.profile.model}, ${kv.value.profile.year}`,value: kv.key}})
  }

  KeyValListToOptionsDriver = (KeyValList) => {
    return KeyValList.map(kv => {return {label: `${kv.value.profile.first_name} ${kv.value.profile.last_name}`,value: kv.key}})
  }

  handleReset = () => {
    this.setState(this.INITIAL_STATE)
  }
  
  setFormInputs = () =>{
    const { trailerOptions, vehicleOptions, driverOptions, shipment } = this.state

    const legsOptions = this.fetchLegsOptions(shipment)
    const legsOptionsMap = {}
    legsOptions.forEach((legOption) =>{legsOptionsMap[legOption.value] = legOption.label})

    // const selectedDriverLegs = this.fetchSelectedLegs(shipment, "driver", "drivers_assignments", legsOptionsMap)
    // const selectedVehicleLegs = this.fetchSelectedLegs(shipment, "vehicle", "vehicles_assignments", legsOptionsMap)
    // const selectedTrailerLegs = this.fetchSelectedLegs(shipment, "trailer", "trailers_assignments", legsOptionsMap)

    const driverAssignments = this.fetchTransportResourcesAssignments(shipment, "driver", "drivers_assignments", legsOptionsMap)
    const vehicleAssignments = this.fetchTransportResourcesAssignments(shipment, "vehicle", "vehicles_assignments", legsOptionsMap)
    const trailerAssignments = this.fetchTransportResourcesAssignments(shipment, "trailer", "trailers_assignments", legsOptionsMap)

    // const defaultDriverOptions = this.defaultResources(shipment, driverOptions, "drivers")

    const formInputs = {
      form_type: "multi_steps_tabs",
      submit_label: this.props.intl.formatMessage({id:"general.submit"}),
      formProps:{
        layout: "horizontal",
        initialValues: {hu_quantity: 1}
      },
      sections: [
        {
          key: "resources_assignments",
          title: this.props.intl.formatMessage({id:"general.assignments"}),
          groups: [
            {
              name: "driver",
              mode: "multiple",
              wrapperCol: {...getSpan(24)},
              groupWrapper:{
                type: "card",
                props: {size: "small",title: this.props.intl.formatMessage({id:"role.driver"})}
              },
              formItemsProps: driverAssignments.map(assignment => {
                return {'selectDriver': {initialValue: assignment.resource_id}, 'leg_driver':  {initialValue: assignment.interconnection_id}}
              }),
              items:[
                {
                  name: "selectDriver",
                  type: "selectField",
                  formItemProps:{
                    rules:[{
                      required: false
                    }],
                    hasFeedback: true,
                    label : this.props.intl.formatMessage({id:"role.driver"}),
                    labelCol: {
                      span: 6
                    },
                    wrapperCol: {
                      span: 12
                    },
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id:"general.driver.placeholder.search_select"}),
                    options: driverOptions
                  },
                  wrapperCol: getSpan(24)
                },
                {
                  name: "leg_driver",
                  type: "selectField",
                  formItemProps:{
                    hasFeedback: false,
                    label : this.props.intl.formatMessage({id:"general.legs"}),
                    labelCol: {
                      span: 6
                    },
                    wrapperCol: {
                      span: 12
                    },
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id:"general.address.placeholder.legs"}),
                    options: legsOptions,
                    mode: "multiple",
                  },
                  wrapperCol: getSpan(24)
                },
              ],
            },
            {
              name: "vehicle",
              mode: "multiple",
              wrapperCol: {...getSpan(24)},
              groupWrapper:{
                type: "card",
                props: {size: "small",title: this.props.intl.formatMessage({id:"general.vehicle"})}
              },
              formItemsProps: vehicleAssignments.map(assignment => {
                return {'selectVehicle': {initialValue: assignment.resource_id}, 'leg_vehicle':  {initialValue: assignment.interconnection_id}}
              }),
              items:[
                {
                  name: "selectVehicle",
                  type: "selectField",
                  formItemProps:{
                    rules:[{
                      required: false
                    }],
                    hasFeedback: true,
                    label : this.props.intl.formatMessage({id:"general.vehicle"}),
                    labelCol: {
                      span: 6
                    },
                    wrapperCol: {
                      span: 12
                    },
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id:"general.vehicle.placeholder.search_select"}),
                    options: vehicleOptions,
                  },
                  wrapperCol: getSpan(24)
                },
                {
                  name: "leg_vehicle",
                  type: "selectField",
                  formItemProps:{
                    hasFeedback: false,
                    label : this.props.intl.formatMessage({id:"general.legs"}),
                    labelCol: {
                      span: 6
                    },
                    wrapperCol: {
                      span: 12
                    },
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id:"general.address.placeholder.legs"}),
                    options: legsOptions,
                    mode: "multiple",
                  },
                  wrapperCol: getSpan(24)
                },
              ],
            },
            {
              name: "trailer",
              mode: "multiple",
              wrapperCol: {...getSpan(24)},
              groupWrapper:{
                type: "card",
                props: {size: "small",title: this.props.intl.formatMessage({id:"trailer.title"})}
              },
              formItemsProps: trailerAssignments.map(assignment => {
                return {'selectTrailer': {initialValue: assignment.resource_id}, 'leg_trailer':  {initialValue: assignment.interconnection_id}}
              }),
              items:[
                {
                  name: "selectTrailer",
                  type: "selectField",
                  formItemProps:{
                    rules:[{
                      required: false
                    }],
                    hasFeedback: true,
                    label : this.props.intl.formatMessage({id:"trailer.title"}),
                    labelCol: {
                      span: 6
                    },
                    wrapperCol: {
                      span: 12
                    },
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id:"general.vehicle.placeholder.search_select"}),
                    options: trailerOptions
                  },
                  wrapperCol: getSpan(24)
                },
                {
                  name: "leg_trailer",
                  type: "selectField",
                  formItemProps:{
                    hasFeedback: false,
                    label : this.props.intl.formatMessage({id:"general.legs"}),
                    labelCol: {
                      span: 6
                    },
                    wrapperCol: {
                      span: 12
                    },
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id:"general.address.placeholder.legs"}),
                    options: legsOptions,
                    mode: "multiple",
                  },
                  wrapperCol: getSpan(24)
                },
              ],
            },
          ]
        },
   
      ]
    }

    this.setState({formInputs: formInputs})
  }

  loading = (loading) => {
    this.setState({loading: loading})
  }

  onDone = () => {

    if (this.props.onDone){
        this.props.onDone()
    }
    this.handleReset()
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

  onSubmit = (values) => {

    const getResourceAssignments = (resource, formValues, type, idField) => {
      return {
        interconnection_id: formValues[resource["leg_".concat(type)]],
        resource: {
          id: formValues[resource[idField]],
          type: type
        }
      }
    }

    const setResourceAssignment = (groupResources, assignmentList=[], formValues, type, idField) => {
     
      (groupResources || []).forEach((resource=>{
        if (resource){
          try{
            if (formValues[resource[idField]]){
              assignmentList.push(getResourceAssignments(resource, formValues, type, idField))
            }

          }catch (e){
            console.error(e)
          }
        }
      }))
    }

    const { shipment } = this.state
		const { itemSetsFields } = values

    const drivers_assignments = []
    const vehicles_assignments = []
    const trailers_assignments = []

    setResourceAssignment(Object.values(itemSetsFields.groups.driver || {}), drivers_assignments, values, "driver", "selectDriver")
    setResourceAssignment(Object.values(itemSetsFields.groups.vehicle || {}), vehicles_assignments, values, "vehicle", "selectVehicle")
    setResourceAssignment(Object.values(itemSetsFields.groups.trailer || {}), trailers_assignments, values, "trailer", "selectTrailer")

    const transportResources = {}
    const user_account = {}
    const company_account = {}

    const resourceData = {
      shipment_id:  shipment.id,
      transport_resources: transportResources,
      company_account: company_account,
      user_account: user_account,
    }

    if (drivers_assignments.length >0){
      transportResources.drivers_assignments = drivers_assignments
    }

    if (vehicles_assignments.length >0){
      transportResources.vehicles_assignments = vehicles_assignments
    }

    if (trailers_assignments.length >0){
      transportResources.trailers_assignments = trailers_assignments
    }
    if(this.props.companyId){
      company_account["id"] = this.props.companyId
    }   
    if(this.props.userId){
      user_account["id"] = this.props.userId
    }
    
    this.loading(true)
     return assignShipmentTransportResources(resourceData).then(res => {
      notifySuccess("notification.success.resources_assigned", this.props.intl)
      this.onDone()
      this.loading(false)
    }).catch(e => {
      console.log("SUBMISSION ERROR-------------->", e)
      notifyError("notification.fail.resources_assigned", this.props.intl)
      this.loading(false)
    })
    
  }

  onCloseDetail = () => {
    this.props.onCloseDetail()
  }

  isReady = () => {
    const {trailerOptions, vehicleOptions, driverOptions } = this.state
    return trailerOptions?.length != undefined && vehicleOptions?.length != undefined && driverOptions?.length != undefined
  }

  render() {
    const {formInputs } = this.state

    if (!this.isReady()) {
      return (
        <Loader></Loader>                
      )
    } else {
      return (
      <div>
        <BoxWrapper>
          {formInputs ?
            <FormBox
                title={this.props.intl.formatMessage({id: 'general.actions.add_quote_request'})}
                formInputs={formInputs}
                onSubmit={this.onSubmit}
                onCloseDetail={this.onCloseDetail}
            />: ""}
        </BoxWrapper>	    
      </div>)
    }
  }

}

ShipmentResourcesView.propTypes = {
  intl: intlShape.isRequired
}

const mapStateToProps = state => {
  return {
    firebase: state.FB.firebase,
		companyId: state.FB.company.companyId,
    userId: state.FB.companyUser.userId,
    activeDrivers: state.FB.carrierUsers.activeDrivers,
    activeVehicles: state.FB.assets.activeVehicles,
    activeTrailers: state.FB.assets.activeTrailers,
    state
  }
}

export default compose(
  connect(mapStateToProps, {}),
  firebaseConnect()
)(injectIntl(ShipmentResourcesView))