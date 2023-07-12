import React, { PureComponent } from "react";
import { injectIntl, intlShape } from "react-intl";
import { compose } from "redux";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { firebaseConnect } from "react-redux-firebase";
import { getSpan } from "constants/layout/grids";
import FilterBox from "components/base/filter_box";

import { FireQuery } from "helpers/firebase/firestore/firestore_collection";
import Trailer from "model/asset/trailer"
import Vehicle from "model/asset/vehicle"
import User from "model/user/carrier_user"
import { H3_RADIUS_SIZES } from "constants/options/shipping";
import {objectToKeyValList, optionObjectToOptionsLabelValue} from 'helpers/data/mapper'
import { VISIBILITY_OPTIONS } from "constants/options/location";
import {statusOption, typeFieldOptions} from "constants/options/calendar";

// const typeOption = objectToKeyValList(typeFieldOptions);
const statusoptionkeyvallist = objectToKeyValList(statusOption);
const visibiltyoptionkeyvallist = objectToKeyValList(VISIBILITY_OPTIONS);
const H3RadiusOptionsKeyVal = objectToKeyValList(H3_RADIUS_SIZES)

class CalendarFilter extends PureComponent {
  defaultViewType = "table"
  INITIAL_STATE = {
    queryFilterConditions: [],
    clientFilterConditions: [],
    ShipmentStatusOptions: [],
    userOptions: [],
    viewType: this.defaultViewType,
    vehicleOptions: [],
    trailerOptions: [],
    existingEventData: {},
    itemActions: [],
    type: "" ,
    users: [],
    EventTypeOptions: [],
    filterInputs: {}
  }

  static propTypes = {
    companyId: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
  }

  componentDidMount() {

    this.setOptions()
    this.setState({ existingEventData: this.props.existingEventData || {} }, this.fetchResources);
}

componentDidUpdate(prevProps)  {
  if (prevProps.companyId !== this.props.companyId)
    {
      this.setFilterConditions();
    }
}

setOptions = (options) => {
  this.setState({
    EventTypeOptions: optionObjectToOptionsLabelValue(typeFieldOptions, this.props.intl )
  }, this.setFilterInputs)
}

  setFilterConditions = (formValues={}) => {
    if (this.props.setFilterConditions){
      this.props.setFilterConditions(formValues)
    }

}

  KeyValListToOptions = (KeyValList) => {
    return KeyValList.map(kv => { return { label: this.props.intl.formatMessage({ id: kv.value.name }), value: kv.key } })
  }

  getType = (value) => {
    this.setState({type: value})
  }

  KeyValListToOptions = (KeyValList) => {
    return KeyValList.map(kv => { return { label: this.props.intl.formatMessage({ id: kv.value.name }), value: kv.key } })
  }

  KeyValListToOptionsVehicleTrailer = (KeyValList) => {
    return KeyValList.map(kv => { return { label: this.props.intl.formatMessage({ id: `${kv.value.profile.make}, ${kv.value.profile.model}, ${kv.value.profile.year}` }), value: kv.key } })
  }
  KeyValListToOptionsDriver = (KeyValList) => {
    return KeyValList.map(kv => { return { label: this.props.intl.formatMessage({ id: `${kv.value.profile.first_name} ${kv.value.profile.last_name}` }), value: kv.key } })
  }

  fetchResources = async () => {
    const companyId = this.props.companyId
    if (companyId) {
      const conditions = [new FireQuery("company_account.id", "==", companyId)]
      await Trailer.collection.query(conditions, this.onTrailerChange, false)
      await Vehicle.collection.query(conditions, this.onVehicleChange, false)
      await User.collection.query(conditions, this.onUserChange, false)
    }
  }
  onTrailerChange = (trailer) => {
    const trailerData = objectToKeyValList(trailer)
    const formattedData = this.KeyValListToOptionsVehicleTrailer(trailerData)
    this.setState({ trailerOptions: formattedData })
  }
  onVehicleChange = (vehicle) => {
    const vehicleData = objectToKeyValList(vehicle)
    const formattedData = this.KeyValListToOptionsVehicleTrailer(vehicleData)
    this.setState({ vehicleOptions: formattedData })
  }
  onUserChange = (drivers) => {
    const driverData = objectToKeyValList(drivers)
    const formattedData = this.KeyValListToOptionsDriver(driverData)
    this.setState({ userOptions: formattedData })
    // return formattedData
  }

  setFilterInputs = () => {

    const ItemLabelCol = {
      xs: { span: 4 },
      sm: { span: 4 },
      md: { span: 4 },
      lg: { span: 4 },
    }

    const ItemWrapperCol = {
      xs: { span: 20 },
      sm: { span: 20 },
      md: { span: 20 },
      lg: { span: 20 },
    }

    const filterInputs = {
      form_type: "general",
      submit_label: this.props.intl.formatMessage({id:"general.search"}),
      formProps: {
        layout: "horizontal",
      },
      sections: [
        {
          key: "shipment_schedule",
          title: this.props.intl.formatMessage({ id: "general.actions.find_events" }),
          groups: [
            {
              name: "shipment_schedule",
              wrapperCol: { ...getSpan(24) },
              groupWrapper: {
                type: "box",
              },
              items: [
                {
                  name: "status",
                  type: "selectField",
                  formItemProps: {
                    label : this.props.intl.formatMessage({id:"general.status"}),
                    labelCol: ItemLabelCol,
                    wrapperCol: ItemWrapperCol
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({ id: "general.status" }),
                    options: this.KeyValListToOptions(statusoptionkeyvallist),
                  },
                  wrapperCol: ItemWrapperCol
                },
                {
                  name: "visibility",
                  type: "selectField",
                  formItemProps: {
                    label : this.props.intl.formatMessage({id:"general.visibility"}),
                    labelCol: ItemLabelCol,
                    wrapperCol: ItemWrapperCol
                  },
                  fieldProps: {
                   
                    options: this.KeyValListToOptions(visibiltyoptionkeyvallist),
                    placeholder: this.props.intl.formatMessage({ id: "general.visibility" }),
                  },
                  wrapperCol: ItemWrapperCol
                },
                {
                  name: "location",
                  type: "addressField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({ id: "general.location" }),
                    labelCol: ItemLabelCol,
                    wrapperCol: ItemWrapperCol
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({ id: "general.location" }),
                  },
                  wrapperCol: ItemWrapperCol
                },
                {
                  name: "locationRadius",
                  type: "selectField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({ id: "general.radius" }),
                    labelCol: ItemLabelCol,
                    wrapperCol: ItemWrapperCol,
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({ id: "general.radius" }),
                    options: this.KeyValListToOptions(H3RadiusOptionsKeyVal),
                  },
                  wrapperCol: getSpan(24) //LocationRadiusFilterWrapperCol
                },
              ]
            }
          ]
        },
      ]
    }
    this.setState({filterInputs: filterInputs})
  }

  render() {

    const {viewType, queryFilterConditions, clientFilterConditions, itemActions, filterInputs} = this.state

    return (
        <FilterBox
          title={this.props.intl.formatMessage({ id: 'general.actions.find_events' })}
          formInputs={filterInputs}
          onSubmit={this.setFilterConditions}
        />
    )
  }
}

CalendarFilter.propTypes = {
  intl: intlShape.isRequired
}


const mapStateToProps = state => {
  return {
    companyId: state.FB.company.companyId,
  }
}

export default compose(
  connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(CalendarFilter))