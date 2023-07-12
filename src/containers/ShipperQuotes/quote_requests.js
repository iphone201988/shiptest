import React, {PureComponent} from "react";
import {PropTypes} from "prop-types";
import {connect} from "react-redux";
import {compose} from "redux";
import {firestoreConnect} from "react-redux-firebase";
import {injectIntl, intlShape}  from "react-intl";
import DataView from "../base/data_view";
import QuoteRequest from "model/shipment/quote_request";
import {
    QUOTE_OFFER_STATUS_HISTORY,
    quote_request_status,
    TRAILER_TYPES,
    H3_RADIUS_SIZES,
    GEOHASH_RADIUS_SIZES,
    DISTANCE_OPTIONS
} from "constants/options/shipping";
import {
    LocationFilterFormItemlabelCol, 
    LocationFilterFormItemWrapperCol, 
    LocationFilterWrapperCol, 
    LocationRadiusFilterFormItemLabelCol, 
    LocationRadiusFilterFormItemWrapperCol, 
    LocationRadiusFilterWrapperCol,
    StatusFilterFormItemLabelCol, 
    StatusFilterFormItemWrapperCol,
    StatusFilterWrapperCol,
    TrailerTypeFilterFormItemLabelCol,
    TrailerTypeFilterFormItemWrapperCol,
    TrailerTypeFilterWrapperCol,
    DistanceFilterFormItemLabelCol,
    DistanceFilterFormItemWrapperCol,
    DistanceFilterWrapperCol,
    PickupDateFilterFormItemLabelCol,
    PickupDateFilterFormItemWrapperCol,
    PickupDateFilterWrapperCol
} from "helpers/containers/properties/shipment";

import {DeliveryCellInfo, PickupCellInfo} from "components/Shipment/ShipmentComponents";
import {Capitalize} from "helpers/data/string";
import {secondsToTimeString} from "helpers/data/datetime";
import FilterBox from "components/base/filter_box";
import {QuoteOffersDrawer} from "./quote_offers_drawer";
import {DisplayTag} from "components/UI/buttons";
import {getTrailerType} from "constants/options/vehicles";
import {getSpan} from "constants/layout/grids";
import {objectToKeyValList} from 'helpers/data/mapper'
import {setShipmentFilter} from 'helpers/containers/states/filters/shipment_filter'
import {locationFiltersQuotes} from "constants/options/filters"

const TrailerTypesKeyVal = objectToKeyValList(TRAILER_TYPES)
const QuoteOfferStatusKeyVal = objectToKeyValList(QUOTE_OFFER_STATUS_HISTORY)
const H3RadiusOptionsKeyVal = objectToKeyValList(H3_RADIUS_SIZES)
const GeohashRadiusOptionsKeyVal = objectToKeyValList(GEOHASH_RADIUS_SIZES)
const DistanceOptionsKeyVal = objectToKeyValList(DISTANCE_OPTIONS)


class QuoteRequests extends PureComponent {

    INITIAL_STATE = {
        queryFilterConditions: [],
        clientFilterConditions: [],
        collectionModel: QuoteRequest,
        itemType: "shipper_quote_request",
        quote: undefined,
        view: undefined,
        columns: [],
        itemActions: [],
        viewType: "table", // ["table", "map", table_map]
        quoteDetailsVisible: false,
        quoteOffersVisible: false,
        quoteOfferVisible: false,
        quoteOfferId: undefined,
        newQuoteOfferVisible: false,
        distanceValues: [0, 10000],
        distanceMaxValue: 10000,
        QuoteOfferStatusOptions: [],
        filterStatus: undefined,
        TrailerTypesOptions: [],
        H3RadiusOptions: [],
        GeohashRadiusOptions: [],
        DistanceOptions: [],
        showTooltip : false,
    }

    static propTypes = {
        companyId: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = { ...this.INITIAL_STATE };
        this.state.columns =this.getColumns()
        this.state.itemActions = this.getItemActions()
    }

    componentDidMount() {

        if (this.props.view){
            this.setState({view: this.props.view}, this.setFilterConditions)
        }
        this.setOptions()
    }

    componentDidUpdate(prevProps) {
        if (this.props.view !== prevProps.view){
            this.setState({view: this.props.view}, this.setFilterConditions)
        }
    }

    KeyValListToOptions = (KeyValList) => {
        return KeyValList.map(kv => {return {label: this.props.intl.formatMessage({id: kv.value.name}),value: kv.key}})
      }

    
    setOptions = () => {

        this.setState({
            TrailerTypesOptions: this.KeyValListToOptions(TrailerTypesKeyVal),
            QuoteOfferStatusOptions: this.KeyValListToOptions(QuoteOfferStatusKeyVal),
            H3RadiusOptions: this.KeyValListToOptions(H3RadiusOptionsKeyVal),
            GeohashRadiusOptions: this.KeyValListToOptions(GeohashRadiusOptionsKeyVal),
            DistanceOptions: this.KeyValListToOptions(DistanceOptionsKeyVal),
        })
    }

    getFilterInputs = () =>{
        const { QuoteOfferStatusOptions, TrailerTypesOptions, H3RadiusOptions, GeohashRadiusOptions, DistanceOptions, view } =  this.state

        let statusFilterDisabled
        let statusPlaceHolder
        if (view === "active") {
            statusFilterDisabled = true
            statusPlaceHolder = this.props.intl.formatMessage({id:"quote.status.request_open.name"})
        } else if (view === "history") {
            statusFilterDisabled = false
            statusPlaceHolder = this.props.intl.formatMessage({id:"quote.status.offer_accepted.name"})
        }

        const filterInputs = {
            form_type: "regular",
            submit_label: this.props.intl.formatMessage({id:"general.search"}),
            formProps:{
                layout: "horizontal",
            },

            sections: [
                {
                key: "find_quotes",
                title: this.props.intl.formatMessage({id:"general.find_quote"}),
                groups: [
                    {
                    name: "find_quotes",
                    wrapperCol: {...getSpan(24)},
                    groupWrapper:{
                        type: "box",
                    },
                    items: [
                                {
                                    name: "originLocation",
                                    type: "addressField",
                                    formItemProps:{
                                        label : this.props.intl.formatMessage({id:"general.origin_location"}),
                                        labelCol: LocationFilterFormItemlabelCol,
                                        wrapperCol: LocationFilterFormItemWrapperCol,
                                    },
                                    fieldProps:{
                                        placeholder: this.props.intl.formatMessage({id:"general.origin_location"}),
                                    },
                                    wrapperCol: LocationFilterWrapperCol
                                },
                                {
                                    name: "originLocationRadius",
                                    type: "selectField",
                                    formItemProps:{
                                        label : this.props.intl.formatMessage({id:"general.radius"}),
                                        labelCol: LocationRadiusFilterFormItemLabelCol,
                                        wrapperCol: LocationRadiusFilterFormItemWrapperCol,
                                    },
                                    fieldProps:{
                                        placeholder: this.props.intl.formatMessage({id:"general.radius"}),
                                        options: H3RadiusOptions,
                                    },
                                    wrapperCol: LocationRadiusFilterWrapperCol
                                },
                                {
                                    name: "destinationLocation",
                                    type: "addressField",
                                    formItemProps:{
                                        label : this.props.intl.formatMessage({id:"general.destination_location"}),
                                        labelCol: LocationFilterFormItemlabelCol,
                                        wrapperCol: LocationFilterFormItemWrapperCol,
                                    },
                                    fieldProps:{
                                        placeholder: this.props.intl.formatMessage({id:"general.destination_location"}),
                                    },
                                    wrapperCol: LocationFilterWrapperCol
                                },
                                {
                                    name: "destinationLocationRadius",
                                    type: "selectField",
                                    formItemProps:{
                                        label : this.props.intl.formatMessage({id:"general.radius"}),
                                        labelCol: LocationRadiusFilterFormItemLabelCol,
                                        wrapperCol: LocationRadiusFilterFormItemWrapperCol,
                                    },
                                    fieldProps:{
                                        placeholder: this.props.intl.formatMessage({id:"general.radius"}),
                                        options: GeohashRadiusOptions,
                                    },
                                    wrapperCol: LocationRadiusFilterWrapperCol
                                },
                                {
                                    name: "filter_status",
                                    type: "selectField",
                                    formItemProps:{
                                        label : this.props.intl.formatMessage({id:"general.status"}),
                                        labelCol: StatusFilterFormItemLabelCol,
                                        wrapperCol: StatusFilterFormItemWrapperCol
                                    },
                                    fieldProps:{
                                        placeholder: statusPlaceHolder,
                                        options: QuoteOfferStatusOptions,
                                        disabled: statusFilterDisabled,
                                    },
                                    wrapperCol: StatusFilterWrapperCol
                                },
                                {
                                    name: "trailer_types",
                                    type: "selectField",
                                    formItemProps:{
                                        label : this.props.intl.formatMessage({id:"trailer.type"}),
                                        labelCol: TrailerTypeFilterFormItemLabelCol,
                                        wrapperCol: TrailerTypeFilterFormItemWrapperCol
                                    },
                                    fieldProps:{
                                        placeholder: this.props.intl.formatMessage({id:"trailer.type.select"}),
                                        options: TrailerTypesOptions,
                                    },
                                    wrapperCol: TrailerTypeFilterWrapperCol
                                },
                                {
                                    name: "distance",
                                    type: "selectField",
                                    formItemProps:{
                                        // initialValue: distanceValues,
                                        label : this.props.intl.formatMessage({id:"general.trip_distance"}),
                                        labelCol: DistanceFilterFormItemLabelCol,
                                        wrapperCol: DistanceFilterFormItemWrapperCol 
                                    },
                                    fieldProps:{
                                        // placeholder: this.props.intl.formatMessage({id:"trailer.type.select"}),
                                        options: DistanceOptions,
                                    },
                                    wrapperCol: DistanceFilterWrapperCol
                                },
                                {
                                    name: "pickup_date",
                                    type: "DatePickerField",
                                    formItemProps:{
                                      label : this.props.intl.formatMessage({id: "shipment.pickup_info.date.title"}),
                                      labelCol: PickupDateFilterFormItemLabelCol,
                                      wrapperCol: PickupDateFilterFormItemWrapperCol
                                    },
                                    fieldProps:{
                                      placeholder: this.props.intl.formatMessage({id:"general.address.placeholder.additional_info"}),
                                    },
                                    wrapperCol: PickupDateFilterWrapperCol
                                },
                                // {
                                //     name: "offers",
                                //     type: "numberField",
                                //     formItemProps:{
                                //       label : this.props.intl.formatMessage({id: "general.offers"}),
                                //       labelCol: StatusFilterFormItemLabelCol,
                                //     wrapperCol: StatusFilterFormItemWrapperCol
                                //     },
                                //     fieldProps:{
                                //       placeholder: this.props.intl.formatMessage({id:"general.offers"}),
                                //     },
                                //     wrapperCol: StatusFilterWrapperCol
                                // },
                            ]
                        }
                    ]
                }
            ]
        }
        return filterInputs
    }

    setFilterConditions = (formValues = {}) => {
        const {view} = this.state
        this.setState(setShipmentFilter(formValues, view, this.props.companyId, "quote_request", "shipping"))
    }

    getColumns = () => {
        return  [
            {
                title: this.props.intl.formatMessage({id: "general.id"}),
                dataIndex: '',
                rowKey: 'origin',
                width: '10%',
                render: (text, record) => <div>{record.id}</div>
            },
            {
                title: this.props.intl.formatMessage({id: "general.status"}),
                dataIndex: '',
                rowKey: 'status',
                width: '10%',
                render:(text, quote) => <div>{DisplayTag(quote_request_status(quote.status))}</div>,
            },
            {
                title: this.props.intl.formatMessage({id: "general.offer"}),
                dataIndex: '',
                rowKey: 'status',
                width: '10%',
                render: (text, quote) =>
                    <span>
                        {/* eslint-disable-next-line */}
                        <a onClick={()=> {this.showQuoteOffers(quote)}}>
                            {`${this.countOffers(quote)}  ${this.props.intl.formatMessage({id: "general.offer"})}`}
                        </a>
                    </span>,
            },
            {
                title: this.props.intl.formatMessage({id: "shipment.pickup.title"}),
                dataIndex: '',
                rowKey: 'origin',
                width: '15%',
                render: (text, record) => <div>{PickupCellInfo(record)}</div>
            },
            {
                title: Capitalize(this.props.intl.formatMessage({id: "shipment.delivery.title"})),
                dataIndex: '',
                rowKey: 'delivery',
                width: '15%',
                render: (text, record) => <div>{DeliveryCellInfo(record)}</div>
            },
            {
                title: this.props.intl.formatMessage({id: "trailer.title"}),
                dataIndex: '',
                rowKey: 'trailer',
                width: '15%',
                render: (text, quote, index) => {(quote.trailer_types || {}).map(trailer_type => {
                    return  DisplayTag(getTrailerType(trailer_type))})}
            },
            {
                title: Capitalize(this.props.intl.formatMessage({id: "general.trip"})),
                dataIndex: '',
                rowKey: 'origin',
                width: '20%',
                render: (text, record) => <div><div>{record.itinerary_sequence.distance/1000} Km </div>
                    <div>{secondsToTimeString(record.itinerary_sequence.time, this.props.intl.formatMessage)}</div></div>
            },
            // {
            //     title: Capitalize(this.props.intl.formatMessage({id: "general.stops"})),
            //     dataIndex: '',
            //     rowKey: 'origin',
            //     width: '10%',
            //     render: (text, record) => <div>{Array.isArray(record.destinations) && record.destinations.length > 2 ? record.destinations.length-2 : 0}</div>
            // },
        ]
    }

    getItemActions = () => {
        return [
            {label: "general.details", type: "viewItem"},
        ]
    }

    showQuoteDetails = (quote) => {
        this.setState({quoteDetailsVisible: true, quote: quote})
    }

    showQuoteOffers = (quote) => {
        this.setState({quoteOffersVisible: true, quote: quote})
    }

    onQuoteDetailsClose = () =>{
        this.setState({quoteDetailsVisible: false})
    }

    showSubmitQuoteOffer = (quote) => {
        this.setState({newQuoteOfferVisible: true, quote: quote})
    }

    onQuoteOfferSubmitClose = () => {
        this.setState({newQuoteOfferVisible: false})
    }

    onQuoteOffersClose = () => {
        this.setState({quoteOffersVisible: false})
    }

    countOffers = (quote) => {
        return quote.quote_offers.length
    }

    render(){

        let {queryFilterConditions, resultsFilterConditions, columns, itemActions, viewType, quote, quoteOffersVisible, view
        } = this.state
        // currently unused: collectionModel, quoteDetailsVisible, newQuoteOfferVisible, quoteOfferId

        const filterInputs = this.getFilterInputs()
        const { toggleState } = this.props;
        if(toggleState){
            viewType= "card"
        }else{
            viewType= "table"
        }
        if ((columns || []).length > 0){
            return (
                <div>
                    <FilterBox
                        title={"Find Quotes"}
                        formInputs={filterInputs}
                        onSubmit={this.setFilterConditions}
                    />
                    <DataView itemType={"shipper_quote_request"}
                              queryFilterConditions={queryFilterConditions}
                              resultsFilterConditions={resultsFilterConditions}
                              columns={columns}
                              itemActions={itemActions}
                              viewType={viewType}
                              hasLocationFilters={locationFiltersQuotes}
                              layouts={[{key: viewType, sections:[{type: viewType, span: 24}]}]}
                    />
                    {quote instanceof QuoteRequest?
                        <QuoteOffersDrawer
                            view={view}
                            visible={quoteOffersVisible}
                            quote={quote}
                            onClose={this.onQuoteOffersClose}
                        />
                        : ""
                    }
                </div>
            )
        }else{
            return ""
        }

    }
}

QuoteRequests.propTypes = {
    intl: intlShape.isRequired
}

const mapStateToProps = state => {
    return {
        companyId: state.FB.company.companyId,
        toggleState: state.App.toggleState
    }
}

export default compose(
    connect(mapStateToProps, {}),
    firestoreConnect()
)(injectIntl(QuoteRequests))