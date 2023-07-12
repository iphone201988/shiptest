import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { injectIntl, intlShape } from "react-intl";
import { PropTypes } from "prop-types";
import LayoutWrapper from "components/utility/layoutWrapper";
import Tag from "antd/es/tag";
import IntlMessages from "components/utility/intlMessages";
import { RELATIONSHIP_TYPE } from "constants/options/location"

import { notifyError, notifySuccess } from "components/notification";

import {
  LocationFilterFormItemlabelCol,
  LocationFilterFormItemWrapperCol,
  LocationFilterWrapperCol,
  LocationRadiusFilterFormItemLabelCol,
  LocationRadiusFilterFormItemWrapperCol,
  LocationRadiusFilterWrapperCol,
} from "helpers/containers/properties/shipment";

import { H3_RADIUS_SIZES } from "constants/options/shipping";
import { objectToKeyValList } from 'helpers/data/mapper'

import { Location } from "model/location/location";
import { firebaseConnect } from "react-redux-firebase";
import { deleteCompanyLocation } from "helpers/firebase/firebase_functions/company_location";
import DataView from "../base/data_view";
import FilterBox from "components/base/filter_box";
import { getSpan } from "constants/layout/grids";
import { setLocationFilter } from 'helpers/containers/states/filters/location_filter'
import { FireQuery } from "helpers/firebase/firestore/firestore_collection";
import { getLocationFilterConditions } from "helpers/containers/states/location";


const H3RadiusOptionsKeyVal = objectToKeyValList(H3_RADIUS_SIZES)

class CompanyLocation extends Component {

  static propTypes = {
    firebase: PropTypes.object,
    toggleState: PropTypes.bool,
    companyId: PropTypes.string,
  }

  INITIAL_STATE = {
    loading: false,
    selected: [],
    locationsUnsubscribe: undefined,
    columns: [],
    CompanyLocationDetails: {},
    CompanyLocationDetailsVisible: false,
    DispatchDrawerVisible: false,
    NewCompanyLocationVisible: false,
    View: "table",
    LocationStatus: "saved",
    zoom_to: undefined,
    FilterLocation: undefined,
    locationRadius: 100,
    submitFilter: false,
    viewType: "table",
    filterInputs: [],
    queryFilterConditions: [],
    clientFilterConditions: [],
    location: undefined,
    showTooltip: false,
    H3RadiusOptions: [],
  }

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
    this.state.View = props.toggleState ? 'card': 'table'
    this.state.viewType = props.toggleState ? 'card': 'table'
    this.state.itemActions = this.getItemActions()
    this.state.columns = this.getColumns()
  }

  componentDidMount() {
    if (this.props.companyId) {
      this.setFilterConditions()
    }
    this.setOptions()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.companyId !== this.props.companyId) {
      this.setFilterConditions()
    }
  }

  KeyValListToOptions = (KeyValList) => {
    return KeyValList.map(kv => { return { label: this.props.intl.formatMessage({ id: kv.value.name }), value: kv.key } })
  }

  onLocationChange = (location) => {
    this.setState({ location: location })
  }

  onLocationRadiusChange = (radius) => {
    this.setState({ locationRadius: radius })
  }

  Loading = (loading) => {
    this.setState({ loading: loading })
  }

  deleteCompanyLocation = location => {
    // console.log('location:', location);
    this.Loading(true)
    deleteCompanyLocation({ locationId: location.id }).then(res => {
      notifySuccess("notification.success.location_delete", { intl: this.props.intl })
      this.Loading(false)
    }).catch(e => {
      notifyError("notification.fail.location_delete", { intl: this.props.intl })
      this.Loading(false)
    })
  }

  setOptions = () => {

    this.setState({
      H3RadiusOptions: this.KeyValListToOptions(H3RadiusOptionsKeyVal),
    })
  }

  zoomTo = (location) => {
    this.setState({ zoom_to: location })
  }

  getColumns = () => {

    return [
      {
        title: this.props.intl.formatMessage({ id: "general.address" }),
        dataIndex: '',
        key: 'address',
        rowKey: 'status',
        width: '25%',
        render: (text, location, index) => <div>
          <div><b>{`${index + 1}) ${location.profile.name} `}</b></div>
          <div> {location.profile.address.label}</div>
          <div>
            <Tag color={RELATIONSHIP_TYPE[location.relationship_type].color} key={""}>
              <IntlMessages id={location.relationship_type} />
            </Tag>
          </div>
        </div>,
      }
    ]
  }

  getItemActions = () => {
    return [
      { label: "general.zoom_to", type: "link", callback: this.zoomTo },
      { label: "general.details", type: "viewItem", itemTabKey: "details" },
      { label: "general.shipment_transport_resources", type: "viewItem", itemTabKey: "resources" },
      { label: "general.delete", confirm_text: "location.delete_confirm", type: "confirm", callback: this.deleteCompanyLocation },
    ]
  }

  getFilterInputs = () => {

    const { H3RadiusOptions } = this.state

    const filterInputs = {
      form_type: "regular",
      submit_label: this.props.intl.formatMessage({ id: "general.search" }),
      formProps: {
        layout: "horizontal",
      },
      sections: [
        {
          key: "find_location",
          title: this.props.intl.formatMessage({ id: "device.find_location" }),
          groups: [
            {
              name: "find_location",
              wrapperCol: { ...getSpan(24) },
              groupWrapper: {
                type: "box",
              },
              items: [
                {
                  name: "location",
                  type: "addressField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({ id: "general.location" }),
                    labelCol: LocationFilterFormItemlabelCol,
                    wrapperCol: LocationFilterFormItemWrapperCol,
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({ id: "general.location" }),
                  },
                  wrapperCol: LocationFilterWrapperCol
                },
                {
                  name: "locationRadius",
                  type: "selectField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({ id: "general.radius" }),
                    labelCol: LocationRadiusFilterFormItemLabelCol,
                    wrapperCol: LocationRadiusFilterFormItemWrapperCol,
                    initialValue: "3"
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({ id: "general.radius" }),
                    options: H3RadiusOptions,
                  },
                  wrapperCol: LocationRadiusFilterWrapperCol
                },
              ]
            }
          ]
        }
      ]
    }
    return filterInputs
  }

  setFilterConditions = (formValues = {}) => {
    const queryFilterConditions = []
    const resultsFilterConditions = []
    queryFilterConditions.push(new FireQuery('account.id', '==', this.props.companyId))
    if (formValues.location && formValues.locationRadius) {
      queryFilterConditions.push(getLocationFilterConditions(formValues.location, formValues.locationRadius || "3", "profile.address",))
    }
    this.setState({ queryFilterConditions: queryFilterConditions, resultsFilterConditions: resultsFilterConditions })
  }

  onCompanyLocationDetailsClose = () => {
    this.setState({ CompanyLocationDetailsVisible: false })
  }

  onDispatchDrawerClose = () => {
    this.setState({ DispatchDrawerVisible: false, CompanyLocationDetails: null })
  }

  onLocationSelect = (value) => {
    this.setState({ FilterLocation: value })
  }

  onLocationFilterSubmit = (e) => {

    const { FilterLocation } = this.state
    e.preventDefault();
    if (FilterLocation instanceof Location) {
      this.fetchLocations()
    }
    this.setState({ submitFilter: false })
  }

  onNewLocationClose = () => {
    this.setState({ NewCompanyLocationVisible: false })
  }

  onNewLocationDone = () => {
    this.setState({ NewCompanyLocationVisible: false, })
  }

  showNewCompanyLocation = () => {
    this.setState({ NewCompanyLocationVisible: true })
  }


  selectRadius = (value) => {
    this.setState({ radius: value })
  }

  render() { 
    
    let { queryFilterConditions, resultsFilterConditions, itemActions, viewType, zoom_to, columns } = this.state
    console.log(this.state)
    const filterInputs = this.getFilterInputs();
    if(this.props.toggleState){
      viewType='card'
    }else{
      viewType='table'
    }
    let content =
      <div>
        <FilterBox
          title={this.props.intl.formatMessage({ id: 'general.actions.find_company_locations' })}
          formInputs={filterInputs}
          onSubmit={this.setFilterConditions}
        />
        {queryFilterConditions.length > 0 ?
       <><>
       <DataView itemType={"carrier_company_location"}
            queryFilterConditions={queryFilterConditions}
            resultsFilterConditions={resultsFilterConditions}
            columns={columns}
            itemActions={itemActions}
            viewType={viewType}
            layouts={[{
              key: 'hybrid', sections: [
                { type:viewType, span: viewType? 24: 12 },
                { type: 'map', map_type: 'company_locations', span: viewType? 24: 12, zoom_to: zoom_to, width: "100%", height: "100vh" }
              ]
            }]
            }
          /></>
          </>: ""}
      </div>

    return content

  }

}

CompanyLocation.propTypes = {
  intl: intlShape.isRequired
}

const mapStateToProps = state => {
  return {
    firebase: state.FB.firebase,
    companyId: state.FB.company.companyId,
    toggleState: state.App.toggleState
  }
}

export default compose(
  connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(CompanyLocation))
