import React, { lazy, PureComponent } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { injectIntl, intlShape } from "react-intl";
import DataView from "../base/data_view";
import CardView from "../base/cardView";
import { Location } from "model/location/location";
import {
    QUOTE_OFFER_STATUS_HISTORY,
    quote_request_status,
    QUOTE_REQUEST_STATUS_OPENED,
    quote_offer_status,
    TRAILER_TYPES,
    H3_RADIUS_SIZES,
    GEOHASH_RADIUS_SIZES,
    DISTANCE_OPTIONS
} from "constants/options/shipping";
import { QuoteDetailsDrawer } from "components/Shipment/QuoteDetailsDrawer";
import { DeliveryCellInfo, PickupCellInfo } from "components/Shipment/ShipmentComponents";
import { Capitalize } from "helpers/data/string";
import { secondsToTimeString } from "helpers/data/datetime";
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
import FilterBox from "components/base/filter_box";
import { trackShipment } from "helpers/firebase/firebase_functions/shipments";
import { DisplayTag } from "components/UI/buttons";
import { getTrailerType } from "constants/options/vehicles";
import { getSpan } from "constants/layout/grids";
import { objectToKeyValList } from 'helpers/data/mapper'
import { setShipmentFilter } from 'helpers/containers/states/filters/shipment_filter'
import { locationFiltersQuotes } from "constants/options/filters"
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card, Skeleton, Switch } from 'antd';
const { Meta } = Card;
const NewQuoteOfferDrawer = lazy(() => import("./new_carrier_quote_offer"));
const QuoteOfferDrawer = lazy(() => import("./quote_offer"));

const CAN_MAKE_OFFER_QUOTE_REQUEST_STATUS = [QUOTE_REQUEST_STATUS_OPENED]

const TrailerTypesKeyVal = objectToKeyValList(TRAILER_TYPES)
const QuoteOfferStatusKeyVal = objectToKeyValList(QUOTE_OFFER_STATUS_HISTORY)
const H3RadiusOptionsKeyVal = objectToKeyValList(H3_RADIUS_SIZES)
const GeohashRadiusOptionsKeyVal = objectToKeyValList(GEOHASH_RADIUS_SIZES)
const DistanceOptionsKeyVal = objectToKeyValList(DISTANCE_OPTIONS)



class QuoteRequests extends PureComponent {

    defaultItemType = "carrier_quote_request"

    INITIAL_STATE = {
        queryFilterConditions: [],
        clientFilterConditions: [],
        itemType: this.defaultItemType,
        collectionModel: undefined,
        quote: undefined,
        view: undefined,
        columns: [],
        actions: [],
        itemActions: [],
        filterInputs: [],
        viewType: "table", // ["table", "map", table_map]
        quoteDetailsVisible: false,
        quoteOfferId: undefined,
        newQuoteOfferVisible: false,
        viewQuoteOfferVisible: false,
        distanceValues: [0, 10000],
        distanceMaxValue: 10000,
        QuoteOfferStatusOptions: [],
        filterStatus: undefined,
        TrailerTypesOptions: [],
        DistanceOptions: [],
        H3RadiusOptions: [],
        GeohashRadiusOptions: [],
        showTooltip: false,
    }

    static propTypes = {
        firebase: PropTypes.object,
        companyId: PropTypes.string,
        toggleState: PropTypes.bool,
    }

    constructor(props) {
        super(props);
        this.state = { ...this.INITIAL_STATE };
        this.state.itemActions = this.getItemActions()
    }

    componentDidMount() {

        this.setOptions()
        if (this.props.view) {
            // this.simulateTracking()
            this.setState({ view: this.props.view }, this.initialize,)
        }

    }

    componentDidUpdate(prevProps) {
        if (this.props.view !== prevProps.view) {
            this.setState({ view: this.props.view }, this.initialize)
        }
    }

    initialize = () => {
        this.setColumns()
        this.setFilterConditions()
    }

    setColumns = () => {
        this.setState({ columns: this.getColumns() })
    }

    KeyValListToOptions = (KeyValList) => {
        return KeyValList.map(kv => { return { label: this.props.intl.formatMessage({ id: kv.value.name }), value: kv.key } })
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

    getFilterInputs = () => {
        const { QuoteOfferStatusOptions, TrailerTypesOptions, H3RadiusOptions, GeohashRadiusOptions, DistanceOptions, view } = this.state

        let statusFilterDisabled
        let statusPlaceHolder
        if (view === "loads") {
            statusFilterDisabled = true
            statusPlaceHolder = this.props.intl.formatMessage({ id: "quote.status.request_open.name" })
        } else if (view === "offers") {
            statusFilterDisabled = true
            statusPlaceHolder = this.props.intl.formatMessage({ id: "quote.status.offer_pending.name" })
        } else if (view === "history") {
            statusFilterDisabled = false
            statusPlaceHolder = this.props.intl.formatMessage({ id: "quote.status.offer_accepted.name" })
        }

        const filterInputs = {
            form_type: "regular",
            submit_label: this.props.intl.formatMessage({ id: "general.search" }),
            formProps: {
                layout: "horizontal",
            },

            sections: [
                {
                    key: "find_quotes",
                    title: this.props.intl.formatMessage({ id: "general.find_quote" }),
                    groups: [
                        {
                            name: "find_quotes",
                            wrapperCol: { ...getSpan(24) },
                            groupWrapper: {
                                type: "box",
                            },
                            items: [
                                {
                                    name: "originLocation",
                                    type: "addressField",
                                    formItemProps: {
                                        label: this.props.intl.formatMessage({ id: "general.origin_location" }),
                                        labelCol: LocationFilterFormItemlabelCol,
                                        wrapperCol: LocationFilterFormItemWrapperCol,
                                    },
                                    fieldProps: {
                                        placeholder: this.props.intl.formatMessage({ id: "general.origin_location" }),
                                    },
                                    wrapperCol: LocationFilterWrapperCol
                                },
                                {
                                    name: "originLocationRadius",
                                    type: "selectField",
                                    formItemProps: {
                                        label: this.props.intl.formatMessage({ id: "general.radius" }),
                                        labelCol: LocationRadiusFilterFormItemLabelCol,
                                        wrapperCol: LocationRadiusFilterFormItemWrapperCol,
                                    },
                                    fieldProps: {
                                        placeholder: this.props.intl.formatMessage({ id: "general.radius" }),
                                        options: H3RadiusOptions,
                                    },
                                    wrapperCol: LocationRadiusFilterWrapperCol
                                },
                                {
                                    name: "destinationLocation",
                                    type: "addressField",
                                    formItemProps: {
                                        label: this.props.intl.formatMessage({ id: "general.destination_location" }),
                                        labelCol: LocationFilterFormItemlabelCol,
                                        wrapperCol: LocationFilterFormItemWrapperCol,
                                    },
                                    fieldProps: {
                                        placeholder: this.props.intl.formatMessage({ id: "general.destination_location" }),
                                    },
                                    wrapperCol: LocationFilterWrapperCol
                                },
                                {
                                    name: "destinationLocationRadius",
                                    type: "selectField",
                                    formItemProps: {
                                        label: this.props.intl.formatMessage({ id: "general.radius" }),
                                        labelCol: LocationRadiusFilterFormItemLabelCol,
                                        wrapperCol: LocationRadiusFilterFormItemWrapperCol,
                                    },
                                    fieldProps: {
                                        placeholder: this.props.intl.formatMessage({ id: "general.radius" }),
                                        options: GeohashRadiusOptions,
                                    },
                                    wrapperCol: LocationRadiusFilterWrapperCol
                                },
                                {
                                    name: "filter_status",
                                    type: "selectField",
                                    formItemProps: {
                                        label: this.props.intl.formatMessage({ id: "general.status" }),
                                        labelCol: StatusFilterFormItemLabelCol,
                                        wrapperCol: StatusFilterFormItemWrapperCol
                                    },
                                    fieldProps: {
                                        placeholder: statusPlaceHolder,
                                        options: QuoteOfferStatusOptions,
                                        disabled: statusFilterDisabled,
                                    },
                                    wrapperCol: StatusFilterWrapperCol
                                },
                                {
                                    name: "trailer_types",
                                    type: "selectField",
                                    formItemProps: {
                                        label: this.props.intl.formatMessage({ id: "trailer.type" }),
                                        labelCol: TrailerTypeFilterFormItemLabelCol,
                                        wrapperCol: TrailerTypeFilterFormItemWrapperCol
                                    },
                                    fieldProps: {
                                        placeholder: this.props.intl.formatMessage({ id: "trailer.type.select" }),
                                        options: TrailerTypesOptions,
                                    },
                                    wrapperCol: TrailerTypeFilterWrapperCol
                                },
                                {
                                    name: "distance",
                                    type: "selectField",
                                    formItemProps: {
                                        // initialValue: distanceValues,
                                        label: this.props.intl.formatMessage({ id: "general.trip_distance" }),
                                        labelCol: DistanceFilterFormItemLabelCol,
                                        wrapperCol: DistanceFilterFormItemWrapperCol
                                    },
                                    fieldProps: {
                                        // placeholder: this.props.intl.formatMessage({id:"trailer.type.select"}),
                                        options: DistanceOptions,
                                    },
                                    wrapperCol: DistanceFilterWrapperCol
                                },
                                {
                                    name: "pickup_date",
                                    type: "DatePickerField",
                                    formItemProps: {
                                        label: this.props.intl.formatMessage({ id: "shipment.pickup_info.date.title" }),
                                        labelCol: PickupDateFilterFormItemLabelCol,
                                        wrapperCol: PickupDateFilterFormItemWrapperCol
                                    },
                                    fieldProps: {
                                        placeholder: this.props.intl.formatMessage({ id: "general.address.placeholder.additional_info" }),
                                    },
                                    wrapperCol: PickupDateFilterWrapperCol
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
        const { view } = this.state
        this.setState(setShipmentFilter(formValues, view, this.props.companyId, "quote_request", "carrier"))
    }

    getColumns = () => {
        const { view } = this.state

        let columns = []

        if (view === "loads") {
            columns.push({
                title: this.props.intl.formatMessage({ id: "general.offer" }),
                dataIndex: '',
                rowKey: 'status',
                width: '10%',
                render: (text, quote) =>
                    <span>
                        {this.canMakOffer(quote) ?
                            //eslint-disable-next-line  
                            <a onClick={() => { this.showSubmitQuoteOffer(quote) }}>
                                {this.props.intl.formatMessage({ id: "action.make_offer" })}
                            </a> :
                            //eslint-disable-next-line 
                            <a onClick={() => { this.showViewQuoteOffer(quote) }}>
                                {this.props.intl.formatMessage({ id: "action.view_quote_offer" })}
                            </a>
                        }

                    </span>,
            },)
        }

        const statusColumn = {
            title: this.props.intl.formatMessage({ id: "general.status" }),
            dataIndex: '',
            rowKey: 'status',
            width: '10%',
        }

        if (view === "loads") {
            statusColumn.render = (text, quote) => <div>{DisplayTag(quote_request_status(quote.status))}</div>
        } else if (view === "offers") {
            statusColumn.render = (text, quote) => <div>{DisplayTag(quote_offer_status(quote.status))}</div>
        }

        columns = columns.concat([
            {
                title: this.props.intl.formatMessage({ id: "shipment.pickup.title" }),
                dataIndex: '',
                rowKey: 'origin',
                width: '20%',
                render: (text, quote) => <div>{PickupCellInfo(quote)}</div>
            },
            {
                title: Capitalize(this.props.intl.formatMessage({ id: "shipment.delivery.title" })),
                dataIndex: '',
                rowKey: 'destination',
                width: '20%',
                render: (text, quote) => <div>{DeliveryCellInfo(quote)}</div>
            },
            statusColumn,
            {
                title: this.props.intl.formatMessage({ id: "trailer.title" }),
                dataIndex: '',
                rowKey: 'trailer',
                width: '15%',
                render: (text, quote, index) => <div> {DisplayTag(getTrailerType(quote.trailer_types))} </div>
            },
            {
                title: Capitalize(this.props.intl.formatMessage({ id: "general.trip" })),
                dataIndex: '',
                rowKey: 'trip',
                width: '20%',
                render: (text, quote) => <div><div>{quote.itinerary_sequence.distance / 1000} Km </div>
                    <div>{secondsToTimeString(quote.itinerary_sequence.time, this.props.intl.formatMessage)}</div></div>
            },
            // {
            //     title: Capitalize(this.props.intl.formatMessage({id: "general.stops"})),
            //     dataIndex: '',
            //     rowKey: 'stops',
            //     width: '10%',
            //     render: (text, quote) => <div>{Array.isArray(quote.destinations) && quote.destinations.length > 2 ? quote.destinations.length-2 : 0}</div>
            // },
        ])
        return columns
    }

    getItemActions = () => {
        return [
            { label: "general.details", type: "viewItem" },
            { label: "quote.carrier.make_quote_offer.title", type: "link", callback: this.showSubmitQuoteOffer, displayCondition: this.canMakOffer },
            { label: "quote.carrier.view_quote_offer.title", type: "link", callback: this.showViewQuoteOffer, displayCondition: !this.canMakOffer }
        ]
    }

    showQuoteDetails = (quote) => {
        this.setState({ quoteDetailsVisible: true, quote: quote })
    }

    onQuoteDetailsClose = () => {
        this.setState({ quoteDetailsVisible: false })
    }

    showSubmitQuoteOffer = (quote) => {
        this.setState({ newQuoteOfferVisible: true, quote: quote })
    }

    showViewQuoteOffer = (quote) => {
        this.setState({ viewQuoteOfferVisible: true, quote: quote })
    }

    onQuoteOfferSubmitClose = () => {
        this.setState({ newQuoteOfferVisible: false })
    }

    showViewQuoteOffer = (quote) => {

        const carrier_quote_offers = quote.quote_offers.filter(quote_offer => quote_offer.carrier === this.props.companyId)
        const carrier_quote_offer = carrier_quote_offers.length > 0 ? carrier_quote_offers[0] : undefined
        if (carrier_quote_offer && carrier_quote_offer.quote_offer) {
            this.setState({ viewQuoteOfferVisible: true, quoteOfferId: carrier_quote_offer.quote_offer })
        }
    }

    onQuoteOfferClose = () => {
        this.setState({ viewQuoteOfferVisible: false })
    }

    canMakOffer = (quote) => {
        const carrier_quote_offers = (quote.quote_offers || []).filter(quote_offer => quote_offer.carrier === this.props.companyId)
        return carrier_quote_offers.length === 0 && CAN_MAKE_OFFER_QUOTE_REQUEST_STATUS.includes(quote.status)
    }

    simulateTracking = () => {
        const latitude = (Math.random() * (46 - 47) + 47).toFixed(4)
        const longitude = (Math.random() * (-73 - -74) + -74).toFixed(4)
        trackShipment({
            shipmentId: "tuAv9SgfspLbvCnVAfWZ",
            trackingData: { position: Location.position(latitude, longitude) }
        }).then(r => { }).catch(e => { console.error(e) })
    }

    render() {

        let {queryFilterConditions, resultsFilterConditions, columns, itemActions, viewType, quote,
            quoteDetailsVisible, newQuoteOfferVisible, viewQuoteOfferVisible, quoteOfferId, itemType
        } = this.state
        const { toggleState } = this.props;
        if(toggleState){
            viewType = "card";
        }else{
            viewType = "table"
        }
        const filterInputs = this.getFilterInputs()

        if ((columns || []).length > 0) {
            return (
                <div>
                    <FilterBox
                        title={"Find Quotes"}
                        formInputs={filterInputs}
                        onSubmit={this.setFilterConditions}
                    />
                    <DataView itemType={itemType}
                              queryFilterConditions={queryFilterConditions}
                              resultsFilterConditions={resultsFilterConditions}
                              columns={columns}
                              itemActions={itemActions}
                              viewType={viewType}
                              hasLocationFilters={locationFiltersQuotes}
                              layouts={[{key: viewType, sections:[{type: viewType, span: 24}]}]}
                    />
                    <QuoteDetailsDrawer
                        visible={quoteDetailsVisible}
                        quote={quote}
                        onClose={this.onQuoteDetailsClose}
                    />
                    {newQuoteOfferVisible ? <NewQuoteOfferDrawer
                        visible={newQuoteOfferVisible}
                        quote={quote}
                        onClose={this.onQuoteOfferSubmitClose}
                    /> : ""}

                    {viewQuoteOfferVisible ? <QuoteOfferDrawer
                        quote_id={quoteOfferId}
                        visible={viewQuoteOfferVisible}
                        onClose={this.onQuoteOfferClose}
                    /> : ""}
                </div>
            )
        } else {
            return ""
        }

    }
}

QuoteRequests.propTypes = {
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
    connect(mapStateToProps, {}),
    firestoreConnect()
)(injectIntl(QuoteRequests))