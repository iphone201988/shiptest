import React from "react";
import {injectIntl, intlShape}  from "react-intl";
import Drawer from 'antd/es/drawer'
import Divider from 'antd/es/divider'
import {Row, Col} from 'antd/es/grid/';

import IntlMessages from "components/utility/intlMessages";
import Button from "../uielements/button";
import Form from '../uielements/form';
import Select from "../uielements/select";
import DatePicker from '../uielements/datePicker';
import InputNumber from '../uielements/InputNumber';

import {
  DELIVERY_SERVICES,
  FREIGHT_TYPES, get_freight_type, get_trailer_type,
  PICKUP_SERVICES,
  TRAILER_TYPES
} from "constants/options/shipping";
import {DescriptionItem} from 'helpers/views/elements'


import Itinerary from "model/shipment/itinerary";
import ShipmentService from "../../services/shipment";
import Notification from "../notification";

import {objectToKeyValList} from "helpers/data/mapper";

import AddressInput from "../Location/address_input";
import DynamicSelect from "../DynamicElement/select";

import {
  dateTimeFormat,
  TYPE_CREATE_QUOTE_OFFER,
  TYPE_UPDATE_QUOTE_REQUEST
} from "constants/variables";

import moment from 'moment';
import {HandlingUnit} from "../HandlingUnit/HandlingUnit";
import {CURRENCIES_CODES} from "constants/options/money";
import Shipment from "model/shipment/shipment";
import {getLocalTimeFromEpoch} from "helpers/data/format";
import {COMPANY_LOCATION_TYPES} from "constants/options/location";


const FormItem = Form.Item;

const pStyle = {
  fontSize: 18,
  color: 'rgba(0,0,0,0.95)',
  lineHeight: '24px',
  display: 'block',
  fontWeight: 700,
  marginBottom: 16,
};

const DEFAULT_CURRECY_CODE = "CAD"

export class QuoteModifyDrawer extends React.PureComponent {
  state = { visible: false };

  constructor(props){
    super(props);
    this.INITIAL_QUOTE = {
      visible: false,
      quote: null,
      PickupAddress:null,
      DeliveryAddress:null,
      PickupLocationType: null,
      DeliveryLocationType: null,
      PickupDate: null,
      DeliveryDate: null,
      PickupDateTime: null,
      DeliveryDateTime: null,
      PickupEarliestDateTime: null,
      PickupLatestDateTime: null,
      DeliveryEarliestDateTime: null,
      DeliveryLatestDateTime: null,
      FreightType: null,
      FreightTypes:[],
      TrailerTypes: [],
      TrailerType: [],
      FreightClasses: [],
      PackageTypes: [],
      LocationTypes:[],
      handlingUnits: [],  // the handling units info includes {packaging_type (pallets), dimensions, weight, product type, quantity)
      PickupServices: [], //
      PickupServicesOptions: [],
      DeliveryServices: [],
      DeliveryServicesOptions: [],
      CarrierRate: null,
      CurrencyCode: null,
      FormReady: false,
      RedirectPage: false,
      PICKUP_SERVICES: PICKUP_SERVICES,
      DELIVERY_SERVICES: DELIVERY_SERVICES,
      type: null
    }
    this.state = { ...this.INITIAL_QUOTE };
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
    if (this.props.onClose){
      this.props.onClose()
    }
  };

  componentDidMount(){
    this.setState({FreightTypes: objectToKeyValList(FREIGHT_TYPES)})
    this.setState({LocationTypes: objectToKeyValList(COMPANY_LOCATION_TYPES)})
    this.setState({PickupServicesOptions: objectToKeyValList(PICKUP_SERVICES)})
    this.setState({DeliveryServicesOptions: objectToKeyValList(DELIVERY_SERVICES)})
    this.setState({TrailerTypes: objectToKeyValList(TRAILER_TYPES)})
  }

  componentDidUpdate(prevProps) {

    if (this.props.quote instanceof Shipment && (prevProps.visible !== this.props.visible || prevProps.quote !== this.props.quote)) {
      let quote = this.props.quote
      const pickup_address = quote.itinerary.origin
      const delivery_address = quote.itinerary.destination

      this.setState(
          {
            visible: this.props.visible,
            quote: quote,
            FreightType: quote.freight_type,
            TrailerType: quote.trailer_type,
            CarrierRate: quote.rate.carrier_rate,
            PickupAddress: quote.itinerary.origin,
            DeliveryAddress: quote.itinerary.destination,
            PickupLocationType: quote.itinerary.origin_type,
            DeliveryLocationType: quote.itinerary.destination_type,
            PickupEarliestDateTime: getLocalTimeFromEpoch(quote.itinerary.pickup_earliest_time, pickup_address.utc_offset),
            PickupLatestDateTime: getLocalTimeFromEpoch(quote.itinerary.pickup_latest_datetime, pickup_address.utc_offset),
            DeliveryEarliestDateTime: getLocalTimeFromEpoch(quote.itinerary.delivery_earliest_time, delivery_address.utc_offset),
            DeliveryLatesttDateTime:  getLocalTimeFromEpoch(quote.itinerary.delivery_earliest_time, delivery_address.utc_offset),
            PickupServices: quote.pickup_services,
            DeliveryServices: quote.delivery_services,
            handlingUnits: quote.handling_units
          })
    }
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.setState({...this.INITIAL_QUOTE})
  }

  handleFreightTypeSelect = (value) => {
    this.setState({ FreightType: value });
  }

  handleTrailerTypeSelect = (value) => {
    this.setState({ TrailerType: value });
  }

  handleCurrencySelect = (value) => {
    this.setState({ CurrencyCode: value });
  }

  handingUnitsList = () => {
    const {handlingUnits} = this.state
    return Object.values(handlingUnits)
  }

  onSubmitComplete = () => {
    if (this.props.onSubmit !== undefined){
      this.props.onSubmit()
    }
  }

  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, form_values) => {
      if (!err) {

        const {handlingUnits, PickupAddress, DeliveryAddress, TrailerType,
          PickupLocationType, DeliveryLocationType, DeliveryServices, PickupServices,
          PickupDate, DeliveryDate, CurrencyCode, CarrierRate,
          quote} = this.state

        let quote_data =
            {
              "freight_type": form_values.FreightType,
              "trailer_type": TrailerType,
              "itinerary": new Itinerary({origin:PickupAddress, destination: DeliveryAddress,
                origin_type:PickupLocationType, destination_type: DeliveryLocationType, pickup_date: PickupDate,
                delivery_date: DeliveryDate

              }),
              "handling_units": handlingUnits,
              "delivery_services": DeliveryServices,
              "pickup_services": PickupServices,
              "rate": {
                'currency_code': CurrencyCode,
                'carrier_rate': CarrierRate,
              }
            }

        var _this = this

        if (this.props.type === TYPE_UPDATE_QUOTE_REQUEST){
          ShipmentService.updateQuoteRequest(quote.id, quote_data)
              .then(res => {
                Notification('success', "Quote Request updated")
                _this.handleReset()
                _this.onClose()
                _this.onSubmitComplete()
              }).catch(e => {})
        } else if (this.props.type === TYPE_CREATE_QUOTE_OFFER){
           ShipmentService.createQuoteOffer(quote.id, quote_data)
               .then(res => {
                 Notification('success', "Quote Offer Created")
                 _this.handleReset()
                 _this.onClose()
                 _this.onSubmitComplete()
               }).catch(e => {})
        }

      }
    });
  };

  onAddressSelect = (value) => {
    this.setState({"CompanyAddress": value})
  }

  onPickupAddressSelect = (value) => {
    this.setState({"PickupAddress": value})
  }

  onDeliveryAddressSelect = (value) => {
    this.setState({"DeliveryAddress": value})
  }

  onHandlingUnitsChange = (handlingUnits) => {
    this.setState({"handlingUnits": handlingUnits})
  }

  onDeliveryServicesChange = (value) => {
    this.setState({"DeliveryServices": value})
  }

  onPickupServicesChange = (value) => {
    this.setState({"PickupServices": value})
  }

  onChangeLocationType = (val, type) => {
    if (type === "Pickup"){
      this.setState({PickupLocationType: val})
    }else if (type === "Delivery"){
      this.setState({DeliveryLocationType: val})
    }

  }

  renderLocationTypesSelect = (Type) => {
    const {LocationTypes }= this.state
    return (
        <Select
            onChange={(val) => {(this.onChangeLocationType(val, Type))}}
            style={{ width: 400 }}
            placeholder="Location type"
        >
          {LocationTypes.map((e) => {
            return <option value={e.key}> { this.props.intl.formatMessage({id: e.value.name})}</option>
          })}
        </Select>
    )

  }

  onPickupEarliestDateTimeChange = (date, datestring) => {
    this.setState({PickupEarliestDateTime: date})
    let latest_date = date.clone()
    this.setState({PickupLatestDateTime: latest_date.add(3,'hours')})
  }

  onPickupLatestDateTimeChange = (date, datestring) => {
    let {PickupEarliestDateTime} = this.state
    if (PickupEarliestDateTime <= date){
      this.setState({PickupLatestDateTime: date})
    }else{
      let latest_date = PickupEarliestDateTime.clone()
      this.setState({PickupLatestDateTime: latest_date.add(1,'hours')})
    }
  }

  onDeliveryEarliestDateTimeChange = (date, datestring) => {
    this.setState({DeliveryEarliestDateTime: date})
    let latest_date = date.clone()
    this.setState({DeliveryLatestDateTime: latest_date.add(3,'hours')})
  }

  onDeliveryLatestDateTimeChange = (date, datestring) => {
    let {DeliveryEarliestDateTime} = this.state
    if (DeliveryEarliestDateTime <= date){
      this.setState({DeliveryLatestDateTime: date})
    }else{
      let latest_date = DeliveryEarliestDateTime.clone()
      this.setState({DeliveryLatestDateTime: latest_date.add(1,'hours')})
    }
  }



  render() {

    const { getFieldDecorator } = this.props.form;
    const {
      PickupAddress,
      DeliveryAddress,
      PackageTypes,
      handlingUnits,  // the handling units info includes {packaging_type (pallets), dimensions, weight, product type, quantity)
      PickupServices, //
      PickupServicesOptions,
      DeliveryServices,
      DeliveryServicesOptions,
      PickupEarliestDateTime,
      PickupLatestDateTime,
      CarrierRate,
    } = this.state;

    const {quote, visible} = this.state
    const {type} = this.props

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };

    if (quote === undefined){
      return ("")
    }

    const TYPE_UPDATE_QUOTE_REQUEST = "update_quote_request"

    let print_itinerary_form = type === TYPE_UPDATE_QUOTE_REQUEST

    return (
        <div>
          <Drawer
              width="70%"
              placement="right"
              closable={true}
              onClose={this.onClose}
              visible={visible}
              destroyOnClose={true}
          >
            <Form className="isoQuoteForm" onSubmit={this.handleSubmit}>
              <p style={{ ...pStyle, marginBottom: 24 }}>{this.props.intl.formatMessage({id: 'quote.details.title'})}</p>

              <Row>
                <Col span={12}>
                  <DescriptionItem title={this.props.intl.formatMessage({id: 'freight.types.title'})}
                                   content={this.props.intl.formatMessage({id: get_freight_type(quote.freight_type).name})} />{' '}
                </Col>
                <Col span={12}>
                  <DescriptionItem title={this.props.intl.formatMessage({id: 'trailer.title'})}
                                   content={this.props.intl.formatMessage({id: get_trailer_type(quote.trailer_type).name})} />
                </Col>
              </Row>

              <Divider />

              <p style={pStyle}>{this.props.intl.formatMessage({id: "shipment.rate.title"})}</p>
              {
                  <div>

                    <Row>
                      <Col span={8}>
                        <FormItem {...formItemLayout}
                                  label={this.props.intl.formatMessage({id: 'shipment.rate.title'})}
                        >
                          {getFieldDecorator('CarrierRate', {
                            initialValue: CarrierRate,
                            rules: [
                              {
                                required: true,
                              },
                            ],
                          })(
                              <InputNumber
                                  min={0}
                                  value={CarrierRate}
                                  onChange={(val) => {this.setState({"CarrierRate": val})}}
                                  placeholder={this.props.intl.formatMessage({id: "shipment.rate.title"})}
                              />)}
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label={this.props.intl.formatMessage({id: 'currency.title'})}>
                          {getFieldDecorator('CurrencyCode', {
                            initialValue: DEFAULT_CURRECY_CODE,
                            rules: [
                              {
                                required: true,
                                message: this.props.intl.formatMessage({id: 'currency.select.validation'}),
                              },
                            ],
                          })(
                            <Select
                              onChange={this.handleCurrencySelect}
                              style={{ width: '80%' }}
                            >
                              { Object.keys(CURRENCIES_CODES).map((key) => {
                                return <option value={key}> {this.props.intl.formatMessage(
                                  {id: CURRENCIES_CODES[key]['name']})}</option>
                              })}
                            </Select>)}
                        </FormItem>
                      </Col>
                      <Col span={16}>


                      </Col>
                    </Row>
                  </div>

              }

              <Divider/>

              <p style={pStyle}>{this.props.intl.formatMessage({id: 'shipment.itinerary.title'})}</p>

              { print_itinerary_form ?
                  <div>

                    <Row>
                      <Col span={24}>
                        <FormItem {...formItemLayout}
                                  label={this.props.intl.formatMessage({id: 'shipment.pickup.address'})}>
                          {getFieldDecorator('PickupAddress', {
                            initialValue: PickupAddress,
                            rules: [
                              {
                                required: true,
                                message: this.props.intl.formatMessage({id: 'general.validation.enter_valid_address'}),
                              }
                            ],
                          })(
                              <div className="isoInputWrapper">
                                {PickupAddress ?
                                    <AddressInput onSelect={this.onPickupAddressSelect}
                                                  Value={PickupAddress}></AddressInput>

                                : ""}
                              </div>
                          )
                          }
                        </FormItem>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={24}>
                        <FormItem {...formItemLayout}
                                  label={this.props.intl.formatMessage({id: 'location.pickup_type.title'})}
                        >
                          {getFieldDecorator('PickupLocationType', {
                            rules: [
                              {
                                required: true,
                                message: this.props.intl.formatMessage({id: 'location.type.select.validation'}),
                              },
                            ],
                            initialValue: this.state.PickupLocationType
                          })(
                              this.renderLocationTypesSelect('Pickup'))}
                        </FormItem>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={2}></Col>
                      <Col span={10}>

                        <FormItem {...formItemLayout}>
                          {getFieldDecorator('PickupEarliestDateTime', {
                            rules: [
                              {
                                required: true,
                                message: this.props.intl.formatMessage({id: 'shipment.pickup_info.date.required'}),
                              },
                            ],
                          })(
                            <DatePicker  placeholder={this.props.intl.formatMessage({id: 'shipment.pickup_earliest.date.title'})}
                                         showTime={{ defaultValue: moment('08:00:00', 'HH:mm:ss') }}
                                         format={dateTimeFormat}
                                         value={PickupEarliestDateTime}
                                         onChange={this.onPickupEarliestDateTimeChange}
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={10}>
                        <FormItem {...formItemLayout}>
                          {getFieldDecorator('PickupLatestDateTime', {
                            rules: [
                              {
                                required: true,
                                message: this.props.intl.formatMessage({id: 'shipment.pickup_info.date.required'}),
                              },
                            ],
                          })(
                            <DatePicker  placeholder={this.props.intl.formatMessage({id: 'shipment.pickup_latest.date.title'})}
                                         showTime={{ defaultValue: moment('17:00:00', 'HH:mm:ss') }}
                                         format={dateTimeFormat}
                                         value={PickupLatestDateTime}
                                         onChange={this.onPickupLatestDateTimeChange}
                                         size="Large"
                            />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={2}></Col>
                    </Row>

                    {/*<Row>*/}
                      {/*<Col span={24}>*/}
                      {/*<FormItem {...formItemLayout}*/}
                                {/*label={this.props.intl.formatMessage({id: 'shipment.pickup_info.date.title'})}>*/}
                        {/*{getFieldDecorator('PickupDate', {*/}
                          {/*initialValue: moment.unix(PickupDate),*/}
                          {/*rules: [*/}
                            {/*{*/}
                              {/*required: true,*/}
                              {/*message: this.props.intl.formatMessage({id: 'shipment.pickup_info.date.required'}),*/}
                            {/*},*/}
                          {/*],*/}
                        {/*})(*/}
                            {/*<DatePicker*/}
                                {/*allowClear={false}*/}
                                {/*format={dateFormat}*/}
                                {/*onChange={(date, dateString) => {this.setState({PickupDate: dateString})}}>*/}
                            {/*</DatePicker>)}*/}
                      {/*</FormItem>*/}
                      {/*</Col>*/}
                    {/*</Row>*/}

                    <Row>
                      <Col span={24}>
                        <FormItem {...formItemLayout}
                                  label={this.props.intl.formatMessage({id: 'shipment.delivery.address'})}>
                          {getFieldDecorator('DeliveryAddress', {
                            initialValue: DeliveryAddress,
                            rules: [
                              {
                                required: true,
                                message: this.props.intl.formatMessage({id: 'general.validation.enter_valid_address'}),
                              }
                            ],
                          })(
                              <div className="isoInputWrapper">
                                <AddressInput onSelect={this.onDeliveryAddressSelect} Value={DeliveryAddress}></AddressInput>

                              </div>
                          )
                          }
                        </FormItem>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={24}>
                        <FormItem {...formItemLayout}
                                  label={this.props.intl.formatMessage({id: 'location.delivery_type.title'})}
                        >
                          {getFieldDecorator('DeliveryLocationType', {
                            rules: [
                              {
                                required: true,
                                message: this.props.intl.formatMessage({id: 'location.type.select.validation'}),
                              },
                            ],
                            initialValue: this.state.DeliveryLocationType
                          })(
                              this.renderLocationTypesSelect('Delivery'))}
                        </FormItem>
                      </Col>
                    </Row>
                    {/*<Row>*/}
                      {/*<Col span={24}>*/}
                        {/*<FormItem {...formItemLayout}*/}
                                  {/*label={this.props.intl.formatMessage({id: 'shipment.delivery_info.date.title'})}>*/}
                          {/*{getFieldDecorator('DeliveryDate', {*/}
                            {/*initialValue: moment(DeliveryDate),*/}
                            {/*rules: [*/}
                              {/*{*/}
                                {/*required: true,*/}
                                {/*message: this.props.intl.formatMessage({id: 'shipment.delivery_info.date.required'}),*/}
                              {/*},*/}
                            {/*],*/}
                          {/*})(*/}
                              {/*<DatePicker*/}
                                  {/*allowClear={false}*/}
                                  {/*format={dateFormat}*/}
                                  {/*onChange={(date, dateString) => {this.setState({DeliveryDate: dateString})}}>*/}
                              {/*</DatePicker>)}*/}
                        {/*</FormItem>*/}
                      {/*</Col>*/}
                    {/*</Row>*/}
                  </div>
                  :
                  // else
                  <div>
                    <Row>
                      <Col span={10}>
                        <DescriptionItem title={this.props.intl.formatMessage({id: 'shipment.pickup.title'})}
                                         content={quote.itinerary.origin.label} />{' '}
                      </Col>
                      <Col span={10}>
                        <DescriptionItem title={this.props.intl.formatMessage({id: 'shipment.pickup_info.date.title'})}
                                         content={`${moment.unix(quote.itinerary.pickup_earliest_time).format(dateTimeFormat)} -
                                         ${moment.unix(quote.itinerary.pickup_latest_time).format(dateTimeFormat)}`} />{' '}
                      </Col>

                    </Row>

                    {/*<Row>*/}
                      {/*<Col span={12}>*/}
                        {/*<DescriptionItem title={this.props.intl.formatMessage({id: 'shipment.delivery.title'})}*/}
                                         {/*content={ quote.itinerary.destination.label} />*/}
                      {/*</Col>*/}
                      {/*<Col span={12}>*/}
                        {/*<DescriptionItem title={this.props.intl.formatMessage({id: 'shipment.delivery_info.date.title'})}*/}
                                         {/*content={moment.unix(quote.itinerary.delivery_earliest_time).format(dateTimeFormat)} />{' '}*/}
                      {/*</Col>*/}
                    {/*</Row>*/}

                  </div>

              }

              <Divider />

              {/*<p style={pStyle}>{this.props.intl.formatMessage({id: 'shipper.title'})}</p>*/}
              {/*<Row>*/}
              {/*</Row>*/}

              {/*<Divider />*/}


              <p style={pStyle}>{this.props.intl.formatMessage({id: 'shipment.handling_units.title'})}</p>

              <HandlingUnit onChange={this.onHandlingUnitsChange}
														handlingUnits={handlingUnits}
														PackageTypes={PackageTypes} DimensionUnit='cm' WeightUnit="lbs"
              ></HandlingUnit>

              <Divider />

              <p style={pStyle}>{this.props.intl.formatMessage({id: 'shipping.pickup_services.title'})}</p>


              {PickupServicesOptions.length > 0 ?  <DynamicSelect options={PickupServicesOptions}
                                                                  Elements={PickupServices}
                                                                  onChange={this.onPickupServicesChange}/> : ""}

              <Divider/>

              <p style={pStyle}>{this.props.intl.formatMessage({id: 'shipping.delivery_services.title'})}</p>

              {DeliveryServicesOptions.length > 0 ?  <DynamicSelect options={DeliveryServicesOptions}
                                                                  Elements={DeliveryServices}
                                                                  onChange={this.onDeliveryServicesChange}/> : ""}

              <Row>
                <FormItem {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit">
                    <IntlMessages id="general.submit" />
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.onClose}>
                    Cancel
                  </Button>
                </FormItem>
              </Row>

            </Form>
          </Drawer>
        </div>
    );
  }
}

QuoteModifyDrawer.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(QuoteModifyDrawer)


