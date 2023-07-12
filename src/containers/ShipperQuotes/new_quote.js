import React, { PureComponent, lazy } from "react";
import { connect } from "react-redux";
import {injectIntl, intlShape} from "react-intl";
import {compose} from "redux";
import {firebaseConnect} from "react-redux-firebase";
import {Radio} from 'antd';
import Loader from "components/utility/loader";
import {notifyError, notifySuccess} from "components/notification";
import {BoxWrapper} from "components/utility/box.style";
import {objectToKeyValList} from 'helpers/data/mapper'
import {addQuoteRequest} from "helpers/firebase/firebase_functions/quote_requests"
import {addShipmentTemplate} from "helpers/firebase/firebase_functions/shipments"
import {SHIPMENT_STATUS, shipment_status, FREIGHT_TYPES, PACKAGING_TYPES, QUOTE_REQUEST_STATUS_REQUEST_CANCELLED, SHIPPING_SERVICES, TRAILER_LENGTH, TRAILER_TYPES} from "constants/options/shipping";
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
import {locationFiltersQuotes} from "constants/options/filters"

import {Capitalize} from "helpers/data/string";
import {setShipmentFilter} from 'helpers/containers/states/filters/shipment_filter'
import IntlMessages from "components/utility/intlMessages";

import Shipment from "model/shipment/shipment";
import ShipmentService from "../../services/shipment";
import QuoteRequest from "model/shipment/quote_request";
import ShipmentTemplate from "model/shipment/shipmentTemplate"
import {ShipmentLocation} from "model/shipment/baseShipment";
import {ItinerarySequence} from "model/shipment/shipmentSequences";
import HandleUnit from "model/shipment/handlingUnit";
import {DeliveryCellInfo, PickupCellInfo} from "components/Shipment/ShipmentComponents";

import {COMPANY_LOCATION_TYPES} from "constants/options/location";

import FormBox from "../base/form_box";
import {getSpan, spans} from "constants/layout/grids";

const DEFAULT_FREIGHT_TYPES = ["FTL"]
const DEFAULT_FREIGHT_TYPE = "FTL"

const FreightTypesKeyVal = objectToKeyValList(FREIGHT_TYPES)
const TrailerTypesKeyVal = objectToKeyValList(TRAILER_TYPES)
const TrailerLengthKeyVal = objectToKeyValList(TRAILER_LENGTH)
const PackageTypesKeyVal = objectToKeyValList(PACKAGING_TYPES)
const LocationTypesKeyVal = objectToKeyValList(COMPANY_LOCATION_TYPES)
const ShipmentServicesKeyVal = objectToKeyValList(SHIPPING_SERVICES)

const Drawer = lazy(() => import("antd/es/drawer"));

class ShipperNewQuote extends PureComponent {

  constructor(props) {
    super(props);
    console.log(this.props)
    this.INITIAL_STATE = {
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
      ShipmentActionReady: false,
    }

    this.state = { ...this.INITIAL_STATE };
    this.state.quote = { ...this.props.quote} || {}
    this.state.actionState = this.props.actionState || "new_quote"
    this.state.visible = true
  }

  componentDidUpdate(prevProps, prevState){
  }

  KeyValListToOptions = (KeyValList) => {
    return KeyValList.map(kv => {return {label: this.props.intl.formatMessage({id: kv.value.name}),value: kv.key}})
  }


  setOptions = () => {
  }

  onOptionSelected(selectedValues, stateVar){
    const state = {}
    state[stateVar] = selectedValues
    this.setState(state)
  }

  handleReset = () => {
    this.setState(this.INITIAL_STATE)
  }
  
  checkTemplateAction = (value) => {
    const {form, itemSetsFields} = value
    if(form.getFieldValue("action_type") === "useShipmentTemplate"){
      this.setState({template_action: true})
    }
  }
  
  getFormInputs = () =>{

    const {TrailerLengthOptions, FreightTypesOptions, TrailerTypesOptions, PackageTypesOptions,
      ShipmentServicesOptions, quoteRequest, QuoteRequestReady, ShipmentActionReady, quote} =this.state

    const formInputs = {
      form_type: "multi_steps_tabs",
      submit_label: this.props.intl.formatMessage({id:"general.submit"}),
      formProps:{
        layout: "horizontal",
        initialValues: {hu_quantity: 1}
      },
      sections: [
        {
          key: "freight_type",
          title: this.props.intl.formatMessage({id:"shipment.freight_type.title"}),
          groups: [
            {
              name: "freight_type",
              wrapperCol: {...getSpan(16)},
              groupWrapper:{
                type: "box",
              },
              items:[
                {
                  name: "freight_type",
                  type: "radioGroupField",
                  formItemProps:{
                    hasFeedback: true,
                    rules:[{
                      required: true
                    }],
                    label : this.props.intl.formatMessage({id:"shipment.freight_type.title"}),
                    labelCol: {
                      span: 10
                    },
                    wrapperCol: {
                      span: 14
                    },
                    initialValue: quote.freight_type
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id:"shipment.freight_type.title"}),
                    options: FreightTypesOptions,
                    // options: [{label: "Full Truck Load", value: "FTL"}, {label: "Full Truck Load", value: "FTL"}]
                  },
                  wrapperCol: getSpan(12)
                },
                {
                  name: "trailer_types",
                  type: "selectField",
                  formItemProps:{
                    rules:[{
                      required: true
                    }],
                    hasFeedback: true,
                    label : this.props.intl.formatMessage({id:"trailer.type"}),
                    labelCol: {
                      span: 10
                    },
                    wrapperCol: {
                      span: 14
                    },
                    initialValue: quote.trailer_types
                  },
                  wrapperCol: getSpan(12),
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id:"trailer.type.select"}),
                    options: TrailerTypesOptions,
                  },
                },
                {
                  name: "trailer_length",
                  type: "selectField",
                  formItemProps:{
                    rules:[{
                      required: true
                    }],
                    hasFeedback: true,
                    label : this.props.intl.formatMessage({id:"trailer.length.title"}),
                    labelCol: {
                      span: 10
                    },
                    wrapperCol: {
                      span: 14
                    },
                    initialValue: quote.trailer_length
                  },
                  wrapperCol: getSpan(12),
                  fieldProps:{
                    mode: "multiple",
                    placeholder: this.props.intl.formatMessage({id:"trailer.length.title"}),
                    options: TrailerLengthOptions,
                  },
                },
                {
                  name: "shipment_services",
                  type: "selectField",
                  formItemProps:{
                    hasFeedback: true,
                    label : this.props.intl.formatMessage({id:"shipping.services.title"}),
                    labelCol: {
                      span: 10
                    },
                    wrapperCol: {
                      span: 14
                    },
                    initialValue: quote.shipment_services
                  },
                  wrapperCol: getSpan(12),
                  fieldProps:{
                    mode: "multiple",
                    placeholder: this.props.intl.formatMessage({id:"shipping.services.title"}),
                    options: ShipmentServicesOptions,
                  },
                },
              ]
            }
          ]
        },
        {
          key: "shipmentOrigin",
          title: this.props.intl.formatMessage({id:"shipment.origin.title"}),
          groups: [
            {
              name: "originLocation",
              wrapperCol: {...getSpan(24)},
              groupWrapper:{
                type: "box",
              },
              items: [
                {
                  name: "originShipmentLocation",
                  type: "addressField",
                  formItemProps:{
                    rules:[{
                      required: true
                    }],
                    hasFeedback: true,
                    label : this.props.intl.formatMessage({id:"general.address"}),
                    labelCol: {
                      span: 6
                    },
                    wrapperCol: {
                      span: 12
                    },
                    initialValue: quote.origin ? quote.origin.location : {}
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id:"general.address.placeholder.search_select"}),
                  },
                  wrapperCol: getSpan(24)
                },
                {
                  name: "originsShipmentLocationInfos",
                  type: "textField",
                  formItemProps: {
                    hasFeedback: false,
                    label: this.props.intl.formatMessage({id: "general.address.label.additional_info"}),
                    labelCol: {
                      span: 6
                    },
                    wrapperCol: {
                      span: 12
                    },
                    initialValue: quote.origin ? quote.origin.address_info : "",
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({id: "general.address.placeholder.additional_info"}),
                  },
                  wrapperCol: getSpan(24)
                },
                {
                  name: "originShipmentLocationDateTimeRange",
                  type: "DateRangePickerField",
                  formItemProps:{
                    rules:[{
                      required: true
                    }],
                    hasFeedback: true,
                    label : this.props.intl.formatMessage({id:"shipment.location.arrival_date_time"}),
                    labelCol: {
                      span: 6
                    },
                    wrapperCol: {
                      span: 12
                    },
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id:"general.address.placeholder.additional_info"}),
                  },
                  wrapperCol: getSpan(24)
                },
              ],
            },
          ]
        },
        {
          key: "shipmentDestinations",
          title: this.props.intl.formatMessage({id:"shipment.destinations.title"}),
          groups:[
            {
              name: "destinationLocation",
              mode: "multiple",
              wrapperCol: {...getSpan(24)},
              groupWrapper:{
                type: "card",
                props: {size: "small",title: this.props.intl.formatMessage({id:"location.destination"})},
              },
              formItemsProps: quote.stops ? quote.stops.map(stop => {
                return {destinationShipmentLocation: {initialValue: stop.location}, destinationShipmentLocationInfos: {initialValue: stop.address_info}}
              })  : [],
              items: [
                {
                  name: "destinationShipmentLocation",
                  type: "addressField",
                  formItemProps: {
                    rules:[{
                      required: true,
                    }],
                    hasFeedback: true,
                    label : this.props.intl.formatMessage({id:"location.destination"}),
                    labelCol: {
                      span: 6
                    },
                    wrapperCol: {
                      span: 12
                    },
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id:"general.address.placeholder.search_select"}),
                  },
                  wrapperCol: getSpan(24)
                },
                {
                  name: "destinationShipmentLocationInfos",
                  type: "textField",
                  formItemProps:{
                    hasFeedback: false,
                    label : this.props.intl.formatMessage({id:"general.address.label.additional_info"}),
                    labelCol: {
                      span: 6
                    },
                    wrapperCol: {
                      span: 12
                    },
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id:"general.address.placeholder.additional_info"}),
                  },
                  wrapperCol: getSpan(24)
                },          
              ]
            },
          ]
        },
        {
          key: "items",
          title: this.props.intl.formatMessage({id:"shipment.items.title"}),
          groups: [
              {
                name: "handling_units",
                mode: "multiple",
                wrapperCol: {...spans["full"]},
                groupWrapper:{
                  type: "card",
                  props: {size: "small", title: this.props.intl.formatMessage({id:"shipment.handling_units.title"})},
                },
                formItemsProps: quote.handling_units ? quote.handling_units.map(unit => {
                  return {hu_quantity: {initialValue: unit.quantity}, hu_type: {initialValue: unit.packaging_type}, hu_weight: {initialValue: unit.weight}, hu_length: {initialValue: unit.length}, hu_width: {initialValue: unit.width}, hu_height: {initialValue: unit.height} }
                }) : [],
                items:[
                  {
                    name: "hu_quantity",
                    type: "numberField",
                    formItemProps:{
                      hasFeedback: false,
                      label : this.props.intl.formatMessage({id:"general.quantity"}),
                      labelCol: {
                        span: 24
                      },
                      wrapperCol: {
                        span: 24
                      },
                    },
                    fieldProps:{
                      min: 0,
                      placeholder: this.props.intl.formatMessage({id:"general.quantity"}),
                    },
                    wrapperCol: getSpan(4)
                  },
                  {
                    name: "hu_type",
                    type: "selectField",
                    formItemProps:{
                      hasFeedback: false,
                      label : this.props.intl.formatMessage({id:"general.type"}),
                      labelCol: {
                        span: 24
                      },
                      wrapperCol: {
                        span: 24
                      },
                    },
                    fieldProps:{
                      placeholder: this.props.intl.formatMessage({id:"general.type"}),
                      options: PackageTypesOptions
                    },
                    wrapperCol: getSpan(4)
                  },
                  {
                    name: "hu_weight",
                    type: "numberField",
                    formItemProps:{
                      hasFeedback: false,
                      rules: [{required: true}],
                      label : this.props.intl.formatMessage({id:"general.weight"}),
                      labelCol: {
                        span: 24
                      },
                      wrapperCol: {
                        span: 24
                      },
                    },
                    fieldProps:{
                      min: 0,
                      placeholder: this.props.intl.formatMessage({id:"general.weight"}),
                    },
                    wrapperCol: getSpan(4)
                  },
                  {
                    name: "hu_length",
                    type: "numberField",
                    formItemProps:{
                      hasFeedback: false,
                      label : this.props.intl.formatMessage({id:"general.length"}),
                      labelCol: {
                        span: 24
                      },
                      wrapperCol: {
                        span: 14
                      },
                    },
                    fieldProps:{
                      min: 0,
                      placeholder: this.props.intl.formatMessage({id:"general.length"}),
                    },
                    wrapperCol: getSpan(4)
                  },
                  {
                    name: "hu_width",
                    initialValue: "1",
                    type: "numberField",
                    formItemProps:{
                      hasFeedback: false,
                      label : this.props.intl.formatMessage({id:"general.width"}),
                      labelCol: {
                        span: 24
                      },
                      wrapperCol: {
                        span: 24
                      },
                    },
                    fieldProps:{
                      min: 0,
                      placeholder: this.props.intl.formatMessage({id:"general.width"}),
                    },
                    wrapperCol: getSpan(4)
                  },
                  {
                    name: "hu_height",
                    type: "numberField",
                    formItemProps:{
                      hasFeedback: false,
                      label : this.props.intl.formatMessage({id:"general.height"}),
                      labelCol: {
                        min: 0,
                        span: 24
                      },
                      wrapperCol: {
                        span: 24
                      },
                    },
                    fieldProps:{
                      placeholder: this.props.intl.formatMessage({id:"general.height"}),
                    },
                    wrapperCol: getSpan(4)
                  },
                  {
                    name: "hu_pickup_address",
                    type: "addressField",
                    formItemProps: {
                      initialFormValue: "originShipmentLocation",
                      hasFeedback: false,
                      label : this.props.intl.formatMessage({id:"shipment.pickup.location"}),
                      labelCol: getSpan(8),
                      wrapperCol: 24
                    },
                    fieldProps:{
                      placeholder: this.props.intl.formatMessage({id:"general.address"}),
                      mode: "offline",
                      optionsProp: "searchResults",
                      optionsType: "map", // map or label_value,
                      optionsLabelValue: [{field: "originShipmentLocation", label: "id"},
                        {multiple:true, field: "destinationShipmentLocation", label: "id"}
                      ],
                      default_option: "first"
                    },
                    wrapperCol: getSpan(12)
                  },
                  {
                    name: "hu_drop_address",
                    type: "addressField",
                    formItemProps: {
                      initialFormSetValue: ["destinationShipmentLocation", 0],
                      hasFeedback: false,
                      label : this.props.intl.formatMessage({id:"shipment.drop.location"}),
                      labelCol: getSpan(8),
                      wrapperCol: {
                        span: 12
                      },
                    },
                    fieldProps:{
                      placeholder: this.props.intl.formatMessage({id:"general.address"}),
                      mode: "offline",
                      optionsProp: "searchResults",
                      optionsType: "map", // map or label_value
                      optionsLabelValue: [{multiple:true, field: "destinationShipmentLocation", label: "id"}],
                      default_option: "first"
                    },
                    wrapperCol: getSpan(12)
                  }
                ]
              }
          ]
        },
        {
          key: "review",
          load: QuoteRequestReady,
          loadMode: "lazy",
          onEnter: this.updateQuoteRequest,
          title: this.props.intl.formatMessage({id:"general.review"}),
          items: [
            {
              name: "quote_review",
              type: "QuoteRequestReview",
              formItemProps: {
                name: "quote_review"
              },
              fieldProps:{
                QuoteRequest: quoteRequest,
              },
            },
          ]
        },
      ]
    }

    return formInputs
  }

  onFormFieldChanged = () => {
    this.setState({formUpdated: true})
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
                                    wrapperCol: StatusFilterFormItemWrapperCol,
                                    initialValue: ""
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
    this.setState(setShipmentFilter(formValues, view, this.props.companyId, "shipment", "shipping"))
}

  updateQuoteRequest = (value) => {
    const {form, itemSetsFields} = value
    if (true){
      const freight_type = form.getFieldValue("freight_type")
      const trailer_types = form.getFieldValue("trailer_types")
      const trailer_length = form.getFieldValue("trailer_length")
      const shipment_services = form.getFieldValue("shipment_services") || []
      const action_type = form.getFieldValue("action_type")
      const originLocation = form.getFieldValue("originShipmentLocation")
      const originLocationInfo = form.getFieldValue("originsShipmentLocationInfos")
      const originShipmentLocationDateTimeRange = form.getFieldValue("originShipmentLocationDateTimeRange")
      let originEarliestDate = undefined
      let originLatestDate = undefined
      try{originEarliestDate = originShipmentLocationDateTimeRange[0].unix()}catch (e) {}
      try{originLatestDate = originShipmentLocationDateTimeRange[1].unix()}catch (e) {}
      const access_time = {
        earliest_time: originEarliestDate,
        latest_time: originLatestDate
      }
      const originShipmentLocation = new ShipmentLocation({id: originLocation.id,location: originLocation,
        address_info: originLocationInfo, access_time: access_time})

      const destinationlocations = Object.values((itemSetsFields.groups || {}).destinationLocation || {}).map(shipmentLocationGroup => {
        const shipmentLocation = form.getFieldValue(shipmentLocationGroup.destinationShipmentLocation)
        const ShipmentLocationInfos = form.getFieldValue(shipmentLocationGroup.destinationShipmentLocationInfos)
        const ShipmentLocationDateTimeRange = form.getFieldValue(shipmentLocationGroup.destinationShipmentLocationDateTimeRange)
        let earliestDate = undefined
        let latestDate = undefined
        try{earliestDate = ShipmentLocationDateTimeRange[0].unix()}catch (e) {}
        try{latestDate = ShipmentLocationDateTimeRange[1].unix()}catch (e) {}
        const access_time = {
          earliest_time: earliestDate,
          latest_time: latestDate
        }
        return new ShipmentLocation({id: shipmentLocation.id, location: shipmentLocation, address_info: ShipmentLocationInfos,
          access_time: access_time})
      })

      const handling_units = Object.values((itemSetsFields.groups || {}).handling_units || {}).map(handlingUnitGroup =>
      {
        const hu_quantity = form.getFieldValue(handlingUnitGroup.hu_quantity)
        const hu_type = form.getFieldValue(handlingUnitGroup.hu_type)
        const hu_weight = form.getFieldValue(handlingUnitGroup.hu_weight)
        const hu_length = form.getFieldValue(handlingUnitGroup.hu_length)
        const hu_width = form.getFieldValue(handlingUnitGroup.hu_width)
        const hu_height = form.getFieldValue(handlingUnitGroup.hu_height)
        const hu_pickup_address = form.getFieldValue(handlingUnitGroup.hu_pickup_address) || {}
        const hu_drop_address = form.getFieldValue(handlingUnitGroup.hu_drop_address) || {}
        const hu =  new HandleUnit({quantity: hu_quantity, packaging_type: hu_type, weight: hu_weight, length: hu_length,
          width: hu_width, height: hu_height, origin_location: {id: hu_pickup_address.id || ""},
          destination_location: {id: hu_drop_address.id || ""}
        })
        return hu
      })

      const quoteRequestData = {
        action_type: action_type,
        freight_type: freight_type,
        trailer_types: Array.isArray(trailer_types) ? trailer_types: [trailer_types],
        trailer_length: trailer_length,
        origin: originShipmentLocation,
        destinations: destinationlocations,
        handling_units: handling_units,
        shipment_services: shipment_services
      }
        this.setState({quoteRequestData: quoteRequestData})
        const quoteRequest = new QuoteRequest(null,
            quoteRequestData, {expand: false})
        this.getItinerarySequence(quoteRequest).then(itinerary_sequence => {
          quoteRequest.itinerary_sequence = itinerary_sequence
          quoteRequest.expand()
          quoteRequest.setLocationTimes()
          this.setState({quoteRequest: quoteRequest, formUpdated: false})
          this.Ready(true)
        }).catch(e => 
          {notifyError("Error getting Itinerary Sequence", this.props.intl)
          console.error(e)
        })
    }
  }

  setLocationPickupsAndDrops = () => {
    const {LocationForms, handlingUnits} = this.state

    // reset pickups and drops
    Object.keys(LocationForms).forEach(Key => {
      LocationForms[Key].Pickups = []
      LocationForms[Key].Drops = []
    })

    Object.values(handlingUnits).forEach(HU => {

      if (HU.PickupLocation && LocationForms[HU.PickupLocation] &&
        !LocationForms[HU.PickupLocation].Pickups.includes(HU.id)){
        LocationForms[HU.PickupLocation].Pickups.push(HU.id)
      }
      if (HU.DropLocation && LocationForms[HU.DropLocation] &&
        !LocationForms[HU.DropLocation].Drops.includes(HU.i))
      {
        LocationForms[HU.DropLocation].Drops.push(HU.id)
      }

      if (LocationForms[HU.PickupLocation] && !LocationForms[HU.PickupLocation].BeforeLocations.includes(HU.DropLocation)){
        LocationForms[HU.PickupLocation].BeforeLocations.push(HU.DropLocation)
      }

    })

    this.setState({LocationForms: LocationForms})
  }

  ValidateQuoteRequest = () => {
    const {quoteRequest} = this.state
    if (quoteRequest){
      return true
    }else{
      return false
    }

  }

  Loading = (loading) => {
    this.setState({loading: loading})
  }

  Ready = (isReady = false) => {
    this.setState({QuoteRequestReady: isReady})
  }

  ShipmentActionReady = (isReady = false) => {
    console.log(this.state.quote)
    this.setState({ShipmentActionReady: isReady})
  }

  async getItinerarySequence(quoteRequest) {

    const start_location = quoteRequest.StartLocation()
    // const end_location = quoteRequest.EndLocation()
    const stop_locations = quoteRequest.StopLocations()

    try{
      return ItinerarySequence.getItinerarySequence(start_location, stop_locations)
    }catch (e) {
      throw e
    }
  }

  onHandlingUnitsChange = (handlingUnits) => {
    this.setState({"handlingUnits": handlingUnits, "Weight": Shipment.getWeight(handlingUnits)})
  }

  onLocationFormsChange = (locationForms) => {
    this.setState({"LocationForms": locationForms})
  }

  onShipmentServicesChange = (value) => {
    this.setState({"ShipmentServices": value})
  }

  onDone(){
    if (this.props.onDone){
      this.handleReset()
      this.props.onDone()
    }
  }

  onTrailerLengthSelect(val){
    this.setState({ TrailerLength: val });
  }

  onSubmit = (values) => {

    const {quoteRequest, actionState} = this.state
    this.Loading(true)
    quoteRequest.compact()
    if (actionState === "new_quote" || actionState === "use_template") {
      return addQuoteRequest(quoteRequest).then(res => {
        notifySuccess("notification.success.new_quote_request", this.props.intl)
        this.onDone()
        this.Loading(false)
      }).catch(e => {
        notifyError("notification.fail.new_quote_request", this.props.intl)
        console.error(e)
        this.Loading(false)
      })  
    } else if (actionState === "new_template") {
      return addShipmentTemplate(quoteRequest).then(res => {
        notifySuccess("notification.success.new_shipment_template", this.props.intl)
        this.onDone()
        this.Loading(false)
      }).catch(e => {
        notifyError("notification.fail.new_quote_request", this.props.intl)
        console.error(e)
        this.Loading(false)
      })
  
    }

  }

  
  onClose = () => {
    this.setState({
      visible: false,
    });
    if (this.props.onClose){
      this.props.onClose()
    }
  };

  render() {
    const {loading} = this.state;

    if(loading){
      return <Loader></Loader>
    }

    const formInputs = this.getFormInputs()

    const {visible} = this.state


    return (
      <Drawer
        width="80%"
        placement="right"
        closable={true}
        onClose={this.onClose}
        visible={visible}>
        {formInputs ?
          <FormBox
              title={this.props.intl.formatMessage({id: 'general.actions.add_quote_request'})}
              formInputs={formInputs}
              onSubmit={this.onSubmit}
              onClose={this.onClose}
              onFormFieldChanged={this.onFormFieldChanged}
              destroyOnClose={true}
          />: ""}
      </Drawer>
    )
  }

  showDestinationSection() {

  }
}

ShipperNewQuote.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  return {}
}

export default compose(
  connect(mapStateToProps, {}),
  firebaseConnect()
)(injectIntl(ShipperNewQuote))
