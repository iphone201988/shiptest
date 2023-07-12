import React, {PureComponent}  from "react";
import {injectIntl, intlShape}  from "react-intl";
import {compose} from "redux";
import {connect} from "react-redux";
import {PropTypes} from "prop-types";
import {firebaseConnect} from "react-redux-firebase";


import LayoutWrapper from "components/utility/layoutWrapper";
import Notification from "components/notification";
import FilterBox from "components/base/filter_box";
import {
    LocationFilterFormItemlabelCol, 
    LocationFilterFormItemWrapperCol, 
    LocationFilterWrapperCol, 
    LocationRadiusFilterFormItemLabelCol, 
    LocationRadiusFilterFormItemWrapperCol, 
    LocationRadiusFilterWrapperCol,
  } from "helpers/containers/properties/rate";

import { H3_RADIUS_SIZES, GEOHASH_RADIUS_SIZES } from "constants/options/shipping";

import CarrierRate from "model/rate/carrier_transport_rate";
import {USER_STATUS} from "constants/options/user";
import DataView from "../base/data_view";
import {deleteRate} from "helpers/firebase/firebase_functions/rates";
import { GeoQuery, FireQuery, H3Query} from "helpers/firebase/firestore/firestore_collection";
import {Capitalize} from "helpers/data/string";
import {getSpan} from "constants/layout/grids";
import {objectToKeyValList} from 'helpers/data/mapper'
import {rateLocationFilters} from "constants/options/filters"

const H3RadiusOptionsKeyVal = objectToKeyValList(H3_RADIUS_SIZES)
const GeohashRadiusOptionsKeyVal = objectToKeyValList(GEOHASH_RADIUS_SIZES)

class Rates extends PureComponent {

    defaultViewType = "table"
    INITIAL_STATE = {
        Users: [],
        queryFilterConditions: [],
        columns: [],
        itemActions: [],
        viewType: this.defaultViewType,
        selectedUser: undefined,
        userDetailsVisible: false,
        UserModifyVisible : false,
        NewUserVisible: false,
        Loading: true,
        filterInputs: [],
        H3RadiusOptions: [],
        GeohashRadiusOptions: [],
    }

    static propTypes = {
        companyId: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = { ...this.INITIAL_STATE };
        this.state.columns =  this.getColumns()
        this.state.itemActions = this.getItemActions()
    }

    componentDidMount() {
        if (this.props.companyId){
            this.setFilterConditions()
        }
        this.setOptions()
    }

    componentDidUpdate(prevProps)  {
        if (prevProps.companyId !== this.props.companyId || prevProps.view !== this.props.view){
            this.setFilterConditions()
        }
    }

    KeyValListToOptions = (KeyValList) => {
        return KeyValList.map(kv => {return {label: this.props.intl.formatMessage({id: kv.value.name}),value: kv.key}})
    }

    setFilterConditions = (formValues={}) => {


        const queryFilterConditions = []
        const resultsFilterConditions = []
        const itemType = "carrier_transport_rate"

        queryFilterConditions.push(new FireQuery('company_account.id', '==', this.props.companyId))

        this.setShipmentLocationFilterConditions(queryFilterConditions, resultsFilterConditions, formValues)

        this.setState({queryFilterConditions: queryFilterConditions, resultsFilterConditions: resultsFilterConditions,itemType:itemType})
    }

    setShipmentLocationFilterConditions = (queryFilterConditions, resultsFilterConditions, formValues) => {

        const {originLocation, originLocationRadius, destinationLocation, destinationLocationRadius} = formValues || {}
    
        if (originLocation && originLocationRadius){
            this.setLocationFilterConditions(queryFilterConditions, resultsFilterConditions, formValues.originLocation, formValues.originLocationRadius,  "origin", "h3_query" )
        }
        if (destinationLocation && destinationLocationRadius){
            this.setLocationFilterConditions(queryFilterConditions, resultsFilterConditions, formValues.destinationLocation, formValues.destinationLocationRadius,  "destination", "geo_query" )
        }
    
        return {filterConditions: queryFilterConditions, resultsFilterConditions: resultsFilterConditions}
    
    }

    setLocationFilterConditions = (queryFilterConditions, resultsFilterConditions, location, locationRadius, field='', type="geo_query") => {

        let QueryFunction = GeoQuery;
        if (type === "geo_query"){
            QueryFunction = GeoQuery;
        }
    
        if (location && locationRadius){
            if (type === "h3_query") {
                queryFilterConditions.push(new H3Query(`${field}.displayPosition.h3_geohash`,  location.displayPosition, locationRadius))
            } else if (type === "geo_query") {
                queryFilterConditions.push(new QueryFunction(`${field}.displayPosition`, location.displayPosition, locationRadius))
            }
        }
    
        return {filterConditions: queryFilterConditions, resultsFilterConditions: resultsFilterConditions}
    }

    sortString = (a, b) => {
        return a.localeCompare(b)
    }

    sortName = (a, b) => {
        return this.sortString(a.profile.first_name, b.profile.first_name)
    }

    sortLastName = (a, b) => {
        return this.sortString(a.profile.last_name, b.profile.last_name)
    }

    userProfile = (user) => {
        return user.profile || {}
    }

    setOptions = () => {

        this.setState({
            H3RadiusOptions: this.KeyValListToOptions(H3RadiusOptionsKeyVal),
            GeohashRadiusOptions: this.KeyValListToOptions(GeohashRadiusOptionsKeyVal),
        })
    }

    getFilterInputs = () =>{
        const { H3RadiusOptions, GeohashRadiusOptions } =  this.state
    
        const filterInputs = {
            form_type: "regular",
            submit_label: this.props.intl.formatMessage({id:"general.search"}),
            formProps:{
                layout: "horizontal",
            },
    
            sections: [
                {
                key: "find_devices",
                title: this.props.intl.formatMessage({id:"general.find_devices"}),
                groups: [
                    {
                    name: "find_devices",
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
                                        onSelect: this.onOriginSelect
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
                                        onSelect: this.onDestinationSelect
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
                            ]
                        }
                    ]
                }
            ]
        }
        return filterInputs
    }

    getColumns = () => {
        return [
            {
                title: this.props.intl.formatMessage({id: "location.destination"}),
                dataIndex: '',
                rowKey: 'origin',
                width: '20%',
                // sorter: this.locationSort,
                defaultSortOrder: 'descend',
                sortDirections: ['ascend', 'descend'],
                render: (text, rate) => <div>
                    <div>{rate.origin.address.label}</div>
                </div>,
            },
            {
                title: this.props.intl.formatMessage({id: "location.destination"}),
                dataIndex: '',
                rowKey: 'destination',
                width: '20%',
                // sorter: this.locationSort,
                defaultSortOrder: 'descend',
                sortDirections: ['ascend', 'descend'],
                render: (text, rate) => <div>
                    <div>{rate.destination.address.label}</div>
                </div>,
            },
            {
                title: Capitalize(this.props.intl.formatMessage({id: "carrier.rates.fuel_baseline"})),
                dataIndex: '',
                rowKey: 'fuel_baseline',
                width: '15%',
                render: (text, rate) => <div>{rate.rate_info.fuel_rate.baseline}</div>
            },
            {
                title: Capitalize(this.props.intl.formatMessage({id: "carrier.rates.fuel_economy"})),
                dataIndex: '',
                rowKey: 'fuel_economy',
                width: '15%',
                render: (text, rate) => <div>{rate.rate_info.fuel_rate.economy}</div>
            },
            {
                title: Capitalize(this.props.intl.formatMessage({id: "carrier.rates.linehaul"})),
                dataIndex: '',
                rowKey: 'linehaul',
                width: '15%',
                render: (text, rate) => <div>{rate.rate_info.linehaul_rate.linehaul}</div>
            },
            {
                title: Capitalize(this.props.intl.formatMessage({id: "carrier.rates.min_linehaul"})),
                dataIndex: '',
                rowKey: 'min_linehaul',
                width: '15%',
                render: (text, rate) => <div>{rate.rate_info.linehaul_rate.min_linehaul}</div>
            },
        ]
    }

    showNewUser = () => {
        this.setState({NewUserVisible: true})
    }

    showUserDetails = (user) => {
        if (user instanceof CarrierRate){
            this.setState({userDetailsVisible: true, selectedUser: user})
        }
    }

    modifyUser = (user) => {
        if (user instanceof CarrierRate){
            this.setState({UserModifyVisible: true, selectedUser: user})
        }
    }

    deleteRate = (rate) => {

        if (rate instanceof CarrierRate){
            deleteRate({rateId: rate.id}).then((res)=> {
                Notification('success', this.props.intl.formatMessage({id: "carrier.rates.delete_success"}))
            }).catch(e=>{
                Notification('error', this.props.intl.formatMessage({id: "carrier.rates.delete_fail"}))
            })
        }
    }

    onItemModifyClose = () => {
        this.setState({UserModifyVisible: false})
    }

    onNewItemTabClose = () => {
        this.setState({NewUserVisible: false})
    }

    suspendedDisplayCondition = (user) => {
        return !([USER_STATUS.suspended.key].includes(user.account_status))
    }

    getItemActions = () => {
        return [
            {label: "general.details", type:"viewItem"},
            {label: "general.modify", type:"link", callback: this.modifyUser},
            {confirm_text: "carrier.rates.delete_confirm", label:"general.delete", type:"confirm", callback: this.deleteRate, displayCondition: this.suspendedDisplayCondition},
        ]
    }

    render() {
        const {viewType, columns, queryFilterConditions, resultsFilterConditions, itemActions, itemType} = this.state

            const filterInputs = this.getFilterInputs()

        return    <LayoutWrapper>
            <FilterBox
                title={this.props.intl.formatMessage({id: 'carrier.rates.find_rate'})}
                formInputs={filterInputs}
                onSubmit={this.setFilterConditions}
            />
            <DataView itemType={itemType}
                      queryFilterConditions={queryFilterConditions}
                      resultsFilterConditions={resultsFilterConditions}
                      columns={columns}
                      itemActions={itemActions}
                      viewType={viewType}
                      hasLocationFilters={rateLocationFilters}
                      layouts={[{key: 'table', sections:[{type: 'table', span: 24}]}]}
            />
        </LayoutWrapper>
    }
}

Rates.propTypes = {
    intl: intlShape.isRequired
}


const mapStateToProps = state => {
    return {
        companyId: state.FB.company.companyId,
        users: Array.isArray(state.FB.carrierUsers) ? state.FB.carrierUsers: []
    }
}

export default compose(
    connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(Rates))
