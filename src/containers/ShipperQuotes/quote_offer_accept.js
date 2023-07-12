import React from "react";
import {injectIntl, intlShape} from "react-intl";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";

import {Row, Col} from 'antd/es/grid/';

import QuoteOffer from "model/shipment/quote_offer";

import {DescriptionItem} from "helpers/views/elements";
import Notification from "components/notification";
import {BoxWrapper} from "components/utility/box.style";
import {acceptQuoteOffer} from "helpers/firebase/firebase_functions/quote_offers";

import { addEvent } from "helpers/firebase/firebase_functions/events";
import ScheduleEvent from "model/event/schedule_event";
import {PropTypes} from "prop-types";
import PaymentMethodSelector from "../BillingProfiles/PaymentMethodSelector";
import FormBox from "../base/form_box";

const INITIAL_STATE = {
  formInputs: undefined,
  submitting: false,
  selectedPaymentMethodId: undefined,
  paymentMethods: [],
}

const _ = require("underscore")


class QuoteOfferAccept extends React.PureComponent {

  static propTypes = {
    companyId: PropTypes.string,
    activeBillingProfiles: PropTypes.arrayOf(PropTypes.object),
    currentCompany: PropTypes.object
  }

  constructor(props){
    super(props);
    this.state = { ...INITIAL_STATE };
    this.state.quote = props.quote || null
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

    if (prevProps.quote instanceof QuoteOffer && prevProps.quote !== this.props.quote ) {
      this.setState({quote: this.props.quote})
    }
  }

  onClose= () => {
    const {onClose} = this.props
    this.resetState()
    if (onClose){
      onClose()
    }

  }

  resetState = () => {
    this.setState(INITIAL_STATE)
  }

  onDone = () => {
    if (this.props.onDone){
      this.props.onDone()
    }
  }

  onSubmit = (values) => {
    const {quote, selectedPaymentMethodId} = this.state
    if (selectedPaymentMethodId && quote.id){
      const data = {quote_offer_id: quote.id, payment_method_id: selectedPaymentMethodId}
      return acceptQuoteOffer(data)
      .then((res) => { 
          // addEvent(event)
          Notification('success',  this.props.intl.formatMessage({id: "quote.status.offer_accepted.name"}))
          this.onClose()
      })
      .catch(e => {
        Notification('error',  this.props.intl.formatMessage({id: "quote.status.offer_accepted.error"}))
      })
    }else{
      Notification('error',  this.props.intl.formatMessage({id: "quote.status.offer_accepted.error"}))
    }
  }

  onPaymentMethodSelected = (selectedPaymentMethodId) => {
    this.setState({selectedPaymentMethodId: selectedPaymentMethodId})
  }

  getQuoteAcceptForm = () =>{
    const formItems = [
      {
        name: "payment_method",
        type: "selectField",
        elementRenderer: (props, options) =>
          <PaymentMethodSelector {...props}  onSelect={(val) => options.onSelect(val, { fieldProps: props })}/>,
        // fieldOptions: { onSelect: this.onPaymentMethodSelected },
        fieldProps: { onPaymentMethodSelected: this.onPaymentMethodSelected },
        formItemProps:{
          // initialValue: false,
          rules:  [ {
            // required: true,
            message: this.props.intl.formatMessage({id: "payment_method.required_message"}) } ]
        }
      },
      {
        name: "accept_checkbox",
        type: "Checkbox",
        formItemProps:{
          label : this.props.intl.formatMessage({id:"page.signUpTermsConditions"}),
          initialValue: false,
          rules:  [ {
            required: true,
            message: this.props.intl.formatMessage({id: "quote.status.offer_accepted.error"}) } ]
        }
      },
    ]


    const formInput =  {
      form_type: "regular",
      formProps:{
        layout: "horizontal"
      },
      sections: [
        {
          name: "name",
          size: "full",
          items:formItems,
        }
      ]
    }

    return formInput
  }

  render() {
    const {quote} = this.state
    const rate = quote.rate || {}
    // const billingProfileForm = this.getBillingFormInputs()
    // const formInputs = this.getBillingFormInputs()
    const formInputs = this.getQuoteAcceptForm()

    return (
        <BoxWrapper>
          <Row>
            <Col span={12}>
              <DescriptionItem title={this.props.intl.formatMessage({id: 'shipment.rate.offer_rate'})}
                               content={`${rate.subtotal}  ${quote.rate.currency_code}`}
              />{' '}
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title={this.props.intl.formatMessage({id: 'shipment.rate.taxes'})}
                               content={`${rate.taxes_amount}  ${quote.rate.currency_code}`}

              />{' '}
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title={this.props.intl.formatMessage({id: 'shipment.rate.total'})}
                               content={`${rate.total}  ${quote.rate.currency_code}`}
              />{' '}
            </Col>
          </Row>
          {/*<PaymentMethodSelector onPaymentMethodSelected={this.onPaymentMethodSelected}/>*/}
          {formInputs ?
              <FormBox
                  title={this.props.intl.formatMessage({id: 'shipment.quote_offer.title'})}
                  formInputs={formInputs}
                  onSubmit={this.onSubmit}
              />: ""}
        </BoxWrapper>
    )
  }
}

QuoteOfferAccept.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = state => {
  return {
    firebase: state.FB.firebase,
    companyId: state.FB.company.companyId,
    currentCompany: state.FB.company.currentCompany,
    activeBillingProfiles: state.FB.billingProfiles?.activeBillingProfiles || [],
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default compose(
  connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(QuoteOfferAccept))

