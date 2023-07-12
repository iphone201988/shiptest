import {
  Drawer, Divider, Col, Row,
} from 'antd';
import React from "react";
import {PropTypes} from "prop-types";
import {
  PICKUP_SERVICES,
  DELIVERY_SERVICES,
  shipment_status
} from "constants/options/shipping";
import Shipment from "model/shipment/shipment";

const pStyle = {
  fontSize: 18,
  color: 'rgba(0,0,0,0.95)',
  lineHeight: '24px',
  display: 'block',
  fontWeight: 700,
  marginBottom: 16,
};

const DescriptionItem = ({ title, content }) => (
    <div
        style={{
          fontSize: 14,
          lineHeight: '22px',
          marginBottom: 7,
          color: 'rgba(0,0,0,0.65)',
        }}
    >
      <p
          style={{
            marginRight: 8,
            display: 'inline-block',
            color: 'rgba(0,0,0,0.85)',
          }}
      >
        {title}:
      </p>
      {content}
    </div>
);

export class FreightBill extends React.Component {
  state = { visible: false };

  constructor(props){
    const INITIAL_QUOTE = {
      visible: false,
      is_shipper: false,
      shipment: null,
      PICKUP_SERVICES: PICKUP_SERVICES,
      DELIVERY_SERVICES: DELIVERY_SERVICES,
      remove_map: false
    }

    super(props);
    this.state = { ...INITIAL_QUOTE };
  }

  onClose = () => {
    this.setState({
      visible: false,
      shipment: null,
      remove_map: true,
    });
    if (this.props.onClose){
      this.props.onClose()
    }
  };


  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {


    if ((nextProps.shipment instanceof Shipment) &&  nextProps.shipment !== this.props.shipment) {
      this.setState(
          {
            shipment: nextProps.shipment,
          })
    }

    if (nextProps.visible !== this.props.visible) {
      this.setState(
          {
            visible: nextProps.visible,
          })
    }
    if (nextProps.is_shipper !== this.props.is_shipper) {
      this.setState(
          {
            is_shipper: nextProps.is_shipper,
          })
    }
  }

  render() {
    const {shipment, visible} = this.state

    if (shipment == null){
      return ("")
    }

    return (
        <Drawer
            width="70%"
            placement="right"
            closable={true}
            onClose={this.onClose}
            visible={visible}
        >
          <div>
              <p style={{ ...pStyle, marginBottom: 24 }}>{this.context.intl.formatMessage({id: 'document.freight_bill'})}</p>

              <Row>
                <Col span={12}>
                  <DescriptionItem title={this.context.intl.formatMessage({id: 'shipment.id'})}
                                   content={shipment.id}/>
                </Col>
                <Col span={12}>
                  <DescriptionItem title={this.context.intl.formatMessage({id: 'shipment.status.name'})}
                                   content={this.context.intl.formatMessage({id: shipment_status(shipment.status).name || ""})} />
                </Col>
              </Row>
            {/*<Row>*/}
              {/*<Col span={12}>*/}
                {/*<DescriptionItem title={this.context.intl.formatMessage({id: 'shipment.pickup_info.date.title'})}*/}
                {/*content={shipment.itinerary.pickup_date.format(dateFormat)} />*/}
              {/*</Col>*/}
              {/*<Col span={12}>*/}
                {/*<DescriptionItem title={this.context.intl.formatMessage({id: 'shipment.delivery_info.date.title'})}*/}
                                 {/*content={shipment.itinerary.delivery_date.format(dateFormat)} />*/}
              {/*</Col>*/}
            {/*</Row>*/}

              <Divider />

              {/*{is_shipper?*/}
                  {/*<Row>*/}
                    {/*<Col span={12}>*/}
                      {/*<DescriptionItem title={this.context.intl.formatMessage({id: 'shipment.rate.offer_rate'})}*/}
                                       {/*content={`${shipment.rate.currency_code} ${shipment.rate.shipper_rate}` }  />{' '}*/}
                    {/*</Col>*/}
                  {/*</Row>*/}
                  {/*:*/}
                  {/*<Row>*/}
                    {/*<Col span={12}>*/}
                      {/*<DescriptionItem title={this.context.intl.formatMessage({id: 'shipment.rate.offer_rate'})}*/}
                                       {/*content={`${shipment.rate.currency_code} ${shipment.rate.carrier_rate}`}  />{' '}*/}
                    {/*</Col>*/}
                  {/*</Row>*/}

              {/*}*/}



              {/*<Divider/>*/}

              {/*<p style={pStyle}>{this.context.intl.formatMessage({id: 'shipment.itinerary.title'})}</p>*/}

              {/*<Row>*/}

                {/*<DescriptionItem title={this.context.intl.formatMessage({id: 'shipment.pickup.title'})}*/}
                                 {/*content={shipment.itinerary.origin.address.label} />{' '}*/}
              {/*</Row>*/}
              {/*<Row>*/}
                {/*<DescriptionItem title={this.context.intl.formatMessage({id: 'shipment.pickup_info.date.title'})}*/}
                                 {/*content={shipment.itinerary.pickup_date} />{' '}*/}
              {/*</Row>*/}

              {/*<Row>*/}

                {/*<DescriptionItem title={this.context.intl.formatMessage({id: 'shipment.delivery.title'})}*/}
                                 {/*content={shipment.itinerary.destination.address.label} />*/}
              {/*</Row>*/}
              {/*<Row>*/}

                {/*<DescriptionItem title={this.context.intl.formatMessage({id: 'shipment.delivery_info.date.title'})}*/}
                                 {/*content={shipment.itinerary.delivery_date} />{' '}*/}
              {/*</Row>*/}
              {/*<Row>*/}
                {/*<Map locations={[shipment.itinerary.origin, shipment.itinerary.destination]} remove_map={remove_map}></Map>*/}
              {/*</Row>*/}

              {/*<Divider />*/}

              {/*<p style={pStyle}>{this.context.intl.formatMessage({id: 'shipper.title'})}</p>*/}
              {/*<Row>*/}
                {/*<Col span={12}>*/}
                  {/*<DescriptionItem title={this.context.intl.formatMessage({id: 'general.company'})}*/}
                                   {/*content={this.context.intl.formatMessage({id: shipment.shipper.profile.name})}  />*/}
                {/*</Col>*/}
                {/*<Col span={12}>*/}
                  {/*<DescriptionItem title={this.context.intl.formatMessage({id: 'general.website'})}*/}
                                   {/*content={this.context.intl.formatMessage({id: shipment.shipper.profile.website})}  />*/}
                {/*</Col>*/}

              {/*</Row>*/}

              {/*<Divider />*/}


              {/*<p style={pStyle}>{this.context.intl.formatMessage({id: 'shipment.handling_units.title'})}</p>*/}

              {/*{shipment.handling_units.map((hu) => {*/}
                {/*return (*/}
                    {/*<div>*/}
                      {/*<Row>*/}
                        {/*<Col span={12}>*/}
                          {/*<DescriptionItem title={this.context.intl.formatMessage({id: 'shipment.packaging.title'})}*/}
                                           {/*content={`${hu.quantity || "N/A"}  ${hu.packaging_type ||*/}
                                           {/*this.context.intl.formatMessage({id: 'shipment.packages'})}`}  />*/}

                        {/*</Col>*/}
                        {/*<Col span={12}>*/}
                          {/*<DescriptionItem  title={this.context.intl.formatMessage({id: 'shipment.packaging.weight.title'})}*/}
                                            {/*content={`${hu.weight || "N/A"} lbs`}  />*/}
                        {/*</Col>*/}
                      {/*</Row>*/}
                      {/*<Row>*/}
                        {/*<Col span={24}>*/}
                          {/*<DescriptionItem title={this.context.intl.formatMessage({id: 'shipment.packaging.dimensions.title'})}*/}
                                           {/*content={`(${hu.length} X ${hu.width} X ${hu.height})  cm`}  />*/}
                        {/*</Col>*/}


                      {/*</Row>*/}

                    {/*</div>*/}
                {/*)*/}
              {/*})}*/}
              {/*<Row>*/}
                {/*<DescriptionItem title={this.context.intl.formatMessage({id: 'general.weight'})}*/}
                                 {/*content={weight_convert(shipment.weight, {show_unit:true})}*/}
                {/*/>*/}

              {/*</Row>*/}

              {/*<Divider />*/}

              {/*<p style={pStyle}>{this.context.intl.formatMessage({id: 'shipping.pickup_services.title'})}</p>*/}

              {/*{shipment.pickup_services.map((service) => {*/}
                {/*let service_name = ""*/}

                {/*try{*/}
                  {/*service_name = this.state.PICKUP_SERVICES[service]['name']*/}
                {/*}catch (e) {*/}
                  {/*service_name = ""*/}
                {/*}*/}

                {/*return (*/}
                    {/*<div>*/}
                      {/*<Row>*/}
                        {/*<Col span={16}>*/}
                          {/*{this.context.intl.formatMessage({id: service_name})}*/}
                        {/*</Col>*/}
                      {/*</Row>*/}

                    {/*</div>*/}
                {/*)*/}
              {/*}, this)}*/}

              {/*<Divider/>*/}

              {/*<p style={pStyle}>{this.context.intl.formatMessage({id: 'shipping.delivery_services.title'})}</p>*/}

              {/*{shipment.delivery_services.map((service) => {*/}
                {/*let service_name = ""*/}

                {/*try{*/}
                  {/*service_name = this.state.DELIVERY_SERVICES[service]['name']*/}
                {/*}catch (e) {*/}
                  {/*service_name = ""*/}
                {/*}*/}

                {/*return (*/}
                    {/*<div>*/}
                      {/*<Row>*/}
                        {/*<Col span={16}>*/}
                          {/*{this.context.intl.formatMessage({id: service_name})}*/}
                        {/*</Col>*/}
                      {/*</Row>*/}

                    {/*</div>*/}
                {/*)*/}
              {/*}, this)}*/}

          </div>
        </Drawer>
    );
  }
}

FreightBill.contextTypes = {
  intl: PropTypes.object.isRequired,
};
