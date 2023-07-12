import React, { PureComponent, lazy } from "react";
import { connect } from "react-redux";
import {compose} from "redux";
import {injectIntl, intlShape} from "react-intl";
import {firebaseConnect} from "react-redux-firebase";
import ToogleButton from 'containers/Topbar/toggleButton'

import { RadioGroup, RadioButton } from "components/uielements/radio";
import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
import {DeliveryCellInfo, PickupCellInfo} from "components/Shipment/ShipmentComponents";

import {locationFiltersQuotes} from "constants/options/filters"
import {COMPANY_LOCATION_TYPES} from "constants/options/location";
import {SHIPMENT_STATUS, shipment_status, FREIGHT_TYPES, PACKAGING_TYPES, QUOTE_REQUEST_STATUS_REQUEST_CANCELLED, SHIPPING_SERVICES, TRAILER_LENGTH, TRAILER_TYPES} from "constants/options/shipping";

import DataView from "../base/data_view";


import {Capitalize} from "helpers/data/string";
import {objectToKeyValList} from 'helpers/data/mapper'


import QuoteRequest from "model/shipment/quote_request";
import {PropTypes} from "prop-types";

const DEFAULT_FREIGHT_TYPES = ["FTL"]
const DEFAULT_FREIGHT_TYPE = "FTL"
const ShipperNewQuote =  lazy(() => import("./new_quote"));
const QuoteRequests =  lazy(() => import("./quote_requests"));
const SelectNewQuote = lazy(() => import("./select_new_quote"))
const  defaultView = "active"
const FreightTypesKeyVal = objectToKeyValList(FREIGHT_TYPES)
const TrailerTypesKeyVal = objectToKeyValList(TRAILER_TYPES)
const TrailerLengthKeyVal = objectToKeyValList(TRAILER_LENGTH)
const PackageTypesKeyVal = objectToKeyValList(PACKAGING_TYPES)
const LocationTypesKeyVal = objectToKeyValList(COMPANY_LOCATION_TYPES)
const ShipmentServicesKeyVal = objectToKeyValList(SHIPPING_SERVICES)


class QuoteRequestsPage extends PureComponent {

  INITIAL_STATE = {
    QuoteView: defaultView
  }

  static propTypes = {
    companyId: PropTypes.string,
  }
  
  constructor(props) {
    super(props);
    this.INITIAL_SHIPMENT_TEMPLATE = {
      formInputs: undefined,
        formUpdated: false,
        quoteRequestData: {},
        quoteRequest: new QuoteRequest({}),
        LocationForms:{},
        ItinerarySequence: null,
        FreightType: DEFAULT_FREIGHT_TYPE,
        FreightTypes: DEFAULT_FREIGHT_TYPES,
        TrailerLength: null,
        TrailerTypes: [],
        TrailerLengths: TrailerLengthKeyVal,
        FreightClasses: [],
        PackageTypes: PackageTypesKeyVal,
        LocationTypes:LocationTypesKeyVal,
        originLocationInfo: "testing",
        handlingUnits: [],  // the handling units info includes {packaging_type (pallets), dimensions, weight, product type, quantity)
        FreightTypesOptions: this.KeyValListToOptions(FreightTypesKeyVal),
        TrailerTypesOptions: this.KeyValListToOptions(TrailerTypesKeyVal),
        TrailerLengthOptions: this.KeyValListToOptions(TrailerLengthKeyVal),
        PackageTypesOptions: this.KeyValListToOptions(PackageTypesKeyVal),
        LocationTypesOptions: this.KeyValListToOptions(LocationTypesKeyVal),
        Weight:0,
        ShipmentServices: [], //
        ShipmentServicesOptions: this.KeyValListToOptions(ShipmentServicesKeyVal),
        loading: false,
        QuoteRequestReady: false,
        originLocation: undefined,
    }  
    this.state = { ...this.INITIAL_STATE };
    this.state.actionState = ""
    this.state.quoteRequest = false
    this.state.quote = { ...this.INITIAL_SHIPMENT_TEMPLATE}
  }

  onSelectQuoteClose = (action = "", template = {}, selected = false) => {
    this.setState({actionState : action })
    this.setState({quote : template})
    if(selected){
      this.setState({quoteRequest : true})
    }
  }

  onNewQuoteClose = () => {
    this.setState({quoteRequest: false})
    this.setState({QuoteView : "new"})
  }

  onNewQuoteDone = () => {
    this.setState({quoteRequest: false})
    this.setState({QuoteView : defaultView})
  }

  KeyValListToOptions = (KeyValList) => {
    return KeyValList.map(kv => {return {label: this.props.intl.formatMessage({id: kv.value.name}),value: kv.key}})
  }

  getItemActions = () => {
    return [
      {label: "general.details", type:"viewItem", itemTabKey: "details"},
      {confirm_text: "general.ask.use_template", label: "general.use_template", type:"confirm", callback: this.useTemplate},
    ]
  }

  useTemplate = (item) => {
    this.setState({QuoteView : "new"})
    this.onSelectQuoteClose("use_template", item, true)
    return
  }

  getColumns = () => {
    return  [
      {
        title: this.props.intl.formatMessage({id: "shipment.pickup.title"}),
        dataIndex: '',
        rowKey: 'origin',
        width: '25%',
        sorter: this.shipmentSort,
        defaultSortOrder: 'descend',
        sortDirections: ['ascend', 'descend'],
        render: (text, record) => <div>{PickupCellInfo(record)}</div>
      },
      {
        title: Capitalize(this.props.intl.formatMessage({id: "shipment.delivery.title"})),
        dataIndex: '',
        rowKey: 'origin',
        width: '25%',
        render: (text, record) => <div>{DeliveryCellInfo(record)}</div>
      },
      {
        title: Capitalize(this.props.intl.formatMessage({id: "freight.types.title"})),
        dataIndex: '',
        rowKey: 'origin',
        width: '15%',
        render: (text, record) => <div>{record.freight_type}</div>
      },
      {
        title: Capitalize(this.props.intl.formatMessage({id: "trailer.type"})),
        dataIndex: '',
        rowKey: 'origin',
        width: '15%',
        render: (text, record) => <div>{record.trailer_types}</div>
      },
      {
        title: Capitalize(this.props.intl.formatMessage({id: "general.trip"})),
        dataIndex: '',
        rowKey: 'origin',
        width: '15%',
        // defaultSortOrder: 'descend',
        sorter: (a, b) => a.itinerary_sequence.distance - b.itinerary_sequence.distance,
        sortDirections: ['ascend', 'descend'],
        render: (text, record) => <div>
          <div>{record.itinerary_sequence.distance/1000} Km </div>
          {/*<div>{secondsToTimeString(record.itinerary_sequence.time, this.props.intl.formatMessage)}</div>*/}
        </div>
      },
    ]
  }

  renderTabContent = () => {
    const {QuoteView} = this.state
    let tabView = ""
    if (QuoteView === "new") {
      this.state.quoteRequest === true ? 
      tabView = <ShipperNewQuote  visible={true} onDone={this.onNewQuoteDone} onClose={this.onNewQuoteClose} quote={this.state.quote} actionState={this.state.actionState}></ShipperNewQuote>
      :
      tabView = <SelectNewQuote visible={true} onDone={this.onSelectQuoteClose} showTemplates={this.showTemplates}></SelectNewQuote>
    } else if (QuoteView === "template") {
      tabView = <DataView 
        hasRowSelection = {false}
        itemType = {"shipment_template"}
        queryFilterConditions = {[{ "field": "shipper", "op": "==", "val": this.props.companyId }, { "field": "active", "op": "==", "val": true }]}
        resultsFilterConditions = {[]}
        columns = {this.getColumns()}
        itemActions = {this.getItemActions()}
        viewType = {"table"}
        hasLocationFilters = {locationFiltersQuotes}
        layouts = {[{ key: 'table', sections: [{ type: 'table', span: 24 }] }]}
      /> 
    }
    else{
      tabView = <QuoteRequests view={QuoteView}/>
    }

    return tabView
  }

  showTemplates = () => {
    this.setState({
      QuoteView: "template"
    })
  }

  onTabChange = (e) => {
    this.setState({
      QuoteView: e.target.value
    })
  }

  render() {

    const {QuoteView} = this.state

    return (

        <LayoutWrapper>
          <Box>
            <div className="filterBox">
            <RadioGroup
              buttonStyle="solid"
              id="QuoteView"
              name="QuoteView"
              value={QuoteView}
              onChange={this.onTabChange}
            >
              <RadioButton value="new"><IntlMessages id="general.actions.add_quote_request"/></RadioButton>
              <RadioButton value="active"><IntlMessages id="quotes.active.name"/></RadioButton>
              <RadioButton value="template"><IntlMessages id="general.templates"/></RadioButton>
              <RadioButton value="history"><IntlMessages id="quotes.history.name"/></RadioButton>
            </RadioGroup>
            <div className={"toggleOuter"}>
                    <ToogleButton {...this.props} />
                    </div>
                    </div>
            {this.renderTabContent()}
          </Box>
        </LayoutWrapper>

    );
  }
}


QuoteRequestsPage.propTypes = {
  intl: intlShape.isRequired,
};


const mapStateToProps = state => {
  return {
    companyId: state.FB.company.companyId,
  }
}
export default compose(
  connect(mapStateToProps, {}),
  firebaseConnect()
)(injectIntl(QuoteRequestsPage))
