import React, {PureComponent} from "react";
import {PropTypes} from "prop-types";
import {connect} from "react-redux";
import {compose} from "redux";
import {firestoreConnect} from "react-redux-firebase";
import {injectIntl, intlShape}  from "react-intl";
import DataView from "../base/data_view";
import {shipment_status, SHIPMENT_STATUS, H3_RADIUS_SIZES, GEOHASH_RADIUS_SIZES, DISTANCE_OPTIONS} from "constants/options/shipping";
import {Capitalize} from "helpers/data/string";
import {DeliveryCellInfo, PickupCellInfo} from "components/Shipment/ShipmentComponents";
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
    DistanceFilterFormItemLabelCol,
    DistanceFilterFormItemWrapperCol,
    DistanceFilterWrapperCol,
    PickupDateFilterFormItemLabelCol,
    PickupDateFilterFormItemWrapperCol,
    PickupDateFilterWrapperCol
} from "helpers/containers/properties/shipment";
import FilterBox from "components/base/filter_box";
import {cancelShipment, updateShipmentStatus} from "helpers/firebase/firebase_functions/shipments";
import {DisplayTag} from "components/UI/buttons";
import {getSpan} from "constants/layout/grids";
import {objectToKeyValList} from 'helpers/data/mapper'
import {setShipmentFilter} from 'helpers/containers/states/filters/shipment_filter'
import {locationFiltersQuotes} from "constants/options/filters"
// import ShipmentResourcesView from "components/Shipment/ShipmentResourcesView"

const ShipmentStatusKeyVal = objectToKeyValList(SHIPMENT_STATUS)
const H3RadiusOptionsKeyVal = objectToKeyValList(H3_RADIUS_SIZES)
const GeohashRadiusOptionsKeyVal = objectToKeyValList(GEOHASH_RADIUS_SIZES)
const DistanceOptionsKeyVal = objectToKeyValList(DISTANCE_OPTIONS)


class Shipments extends PureComponent {

    INITIAL_STATE = {
        queryFilterConditions: [],
        clientFilterConditions: [],
        ShipmentStatusOptions: [],
        DistanceOptions: [],
        shipment: undefined,
        view: undefined,
        columns: [],
        actions: [],
        itemActions: [],
        filterInputs: [],
        viewType: "table", // ["table", "map", table_map]
        shipmentDetailsVisible: false,
        quoteOfferVisible: false,
        quoteOfferId: undefined,
        newQuoteOfferVisible: false,
        distanceValues: [0, 10000],
        distanceMaxValue: 10000,
        H3RadiusOptions: [],
        GeohashRadiusOptions: [],
        filterStatus: undefined,
    }

    static propTypes = {
        firebase: PropTypes.object,
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

    componentDidUpdate(prevProps){
        if (prevProps.view !== this.props.view){
            this.setState({view: this.props.view}, this.setFilterConditions)
        }
    }

    setOptions = () => {
        this.setState({
           ShipmentStatusOptions: this.KeyValListToOptions(ShipmentStatusKeyVal),
           H3RadiusOptions: this.KeyValListToOptions(H3RadiusOptionsKeyVal),
           GeohashRadiusOptions: this.KeyValListToOptions(GeohashRadiusOptionsKeyVal),
           DistanceOptions: this.KeyValListToOptions(DistanceOptionsKeyVal),
        })
    }

    KeyValListToOptions = (KeyValList) => {
        return KeyValList.map(kv => {return {label: this.props.intl.formatMessage({id: kv.value.name}),value: kv.key}})
      }

 
    getFilterInputs = () =>{
        const { ShipmentStatusOptions, H3RadiusOptions, GeohashRadiusOptions, DistanceOptions } =  this.state

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
                                        placeholder: this.props.intl.formatMessage({id:"general.status"}),
                                        options: ShipmentStatusOptions,
                                    },
                                    wrapperCol: StatusFilterWrapperCol
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
        this.setState(setShipmentFilter(formValues, view, this.props.companyId, "shipment", "carrier"))
    }

    getColumns = () => {
        return  [
            {
                title: this.props.intl.formatMessage({id: "general.id"}),
                dataIndex: '',
                rowKey: 'id',
                width: '10%',
                render: (text, record) => <div>{record.id}</div>
            },
            {
                title: this.props.intl.formatMessage({id: "shipment.pickup.title"}),
                dataIndex: '',
                rowKey: 'pickup',
                width: '25%',
                sorter: this.shipmentSort,
                defaultSortOrder: 'descend',
                sortDirections: ['ascend', 'descend'],
                render: (text, record) => <div>{PickupCellInfo(record)}</div>
            },
            {
                title: Capitalize(this.props.intl.formatMessage({id: "shipment.delivery.title"})),
                dataIndex: '',
                rowKey: 'delivery',
                width: '25%',
                render: (text, record) => <div>{DeliveryCellInfo(record)}</div>
            },
            {
                title: this.props.intl.formatMessage({id: "general.status"}),
                dataIndex: '',
                rowKey: 'status',
                width: '15%',
                filters: [
                    {
                        value: 'pending',
                        text: this.props.intl.formatMessage({id: shipment_status("pending").name})
                    },
                    {
                        text: this.props.intl.formatMessage({id: shipment_status("started").name}),
                        value: 'started'
                    },
                ],
                filterMultiple: false,
                onFilter: (value, shipment) => shipment.status.indexOf(value) === 0,
                render: (text, shipment) => <div>{DisplayTag(shipment_status(shipment.status))}</div>,
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
            {label: "general.details", type:"viewItem", itemTabKey: "details"},
            {label: "general.shipment_transport_resources", type:"viewItem", itemTabKey: "resources"},
            {label: "general.tracking", type:"viewItem", itemTabKey: "tracking"},
            {label: "general.documents", type:"viewItem", itemTabKey: "documents"},
            {label: "general.cancel", confirm_text:"shipment.cancel_confirm", type:"confirm", callback:this.cancelShipment},
        ]
    }

    cancelShipment = (shipment) => {
        cancelShipment({"shipmentId": shipment.id}).then(r => {}).catch(e => {console.error(e)})
    }

    updateShipmentStatus = (shipment) => {
        updateShipmentStatus({"shipmentId": shipment.id, 'status': 'at_customer_site'}).then(r => {}).catch(e => {console.error(e)})
    }

    showShipmentDetails = (shipment) => {
        this.setState({shipmentDetailsVisible: true, shipment: shipment})
    }

    onShipmentDetailsClose = () =>{
        this.setState({shipmentDetailsVisible: false})
    }

  render(){

    let {queryFilterConditions, resultsFilterConditions, columns, itemActions, viewType, itemType} = this.state

    const filterInputs = this.getFilterInputs()
    const { toggleState } = this.props;
    if(toggleState){
        viewType = "card";
    }else{
        viewType = "table"
    }
    if ((columns || []).length > 0){
        return (
            <div>
                <FilterBox
                    title={this.props.intl.formatMessage({id: 'general.actions.find_shipments'})}
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
            </div>
        )
    } else {
        return ""
    }

  }
}

Shipments.propTypes = {
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
)(injectIntl(Shipments))