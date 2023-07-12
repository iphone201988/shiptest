import Form from 'components/uielements/form';
import React from "react";
import {PropTypes} from "prop-types";
import QuoteOffer from "model/shipment/quote_offer";
import IntlMessages from "components/utility/intlMessages";
import ShipmentService from "../../services/shipment";

import Notification from "../notification";
import {compose} from "redux";
import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {injectIntl} from "react-intl";
import BillingProfile from "model/billing/billing_profile";
import Loader from "components/utility/loader";
import {mapFirestoreResultsToModelList} from "helpers/firebase/firestore_model";
import {BoxWrapper} from "components/utility/box.style";
import FormBox from "containers/base/form_box";

const FormItem = Form.Item;

const TAX_RATE = 0.14975

const INITIAL_QUOTE = {
  formInputs: undefined,
  Submitting: false,
  BillingProfiles: [],
  SelectedBillingProfileID: null,
  Rate: 0.00,
  Taxes:  0.0,
  Total: 0.00,
  Ready: false
}

const _ = require("underscore")

class QuoteOfferAccept extends React.PureComponent {

  constructor(props){
    super(props);
    this.state = { ...INITIAL_QUOTE };
    this.state.quote = props.quote || null
    this.state.onClose = props.onClose || null
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    if (this.props.quote instanceof QuoteOffer){
      this.setRate(quote)
    }

  }

  componentDidUpdate(prevProps) {

    if (!_.isEqual( prevProps.BillingProfiles , this.props.BillingProfiles)){
      this.setState({BillingProfiles:  this.props.BillingProfiles})
    }

    if (this.props.quote instanceof QuoteOffer && prevProps.quote !== this.props.quote ) {
      this.setState({quote: this.props.quote, is_shipper: this.props.is_shipper})
      this.setRate( this.props.quote)
    }

  }

  onClose= () => {
    const {onClose} = this.state
    if (onClose){
      onClose()
    }
    this.resetState()
  }

  resetState = () => {
    this.setState(INITIAL_QUOTE)
  }

  setRate = (quote) => {
    this.setState({Total: quote.total, Taxes: quote.taxes, Rate: quote.subtotal})
  }

  BillingProfileSelect = (value) => {
    this.setState({SelectedBillingProfileID: value})
  }

  Submitting = () => {
    this.setState({Submitting: true})
  }

  NotSubmitting = () => {
    this.setState({Submitting: false})
  }

  handleSubmit(e){
    const {quote, SelectedBillingProfileID} = this.state
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, form_values) => {
      if (!err && SelectedBillingProfileID) {
        this.Submitting()
        ShipmentService.acceptQuoteOffer(quote.id, SelectedBillingProfileID, this.props.firebase.auth()).then(res => {
          this.NotSubmitting()
          Notification('success',  this.context.intl.formatMessage({id: "quote.status.offer_accepted.name"}))
          this.onClose()
        }).catch(e=>{this.NotSubmitting()})

      }
    })
  }

  setFormInputs = () =>{

    const {Rate, Taxes, Total} = this.state

    const formInputs = {
      form_type: "regular",
      submit_label: this.props.intl.formatMessage({id:"general.submit"}),
      formProps:{
        layout: "horizontal"
      },
      sections: [
        {
          name: "name",
          size: "full",
          items: [
            {
              name: "name",
              type: "textField",
              formItemProps:{
                rules:[
                  {
                    required: true
                  }
                ],
                label : this.props.intl.formatMessage({id:"carrier.vehicle.name"}),
                labelCol: {
                  span: 2
                },
                wrapperCol: {
                  span: 22
                },
              },
              fieldProps:{
                placeholder: this.props.intl.formatMessage({id:"carrier.vehicle.name"}),
              },
            }]
        }
      ]
    }
    this.setState({formInputs: formInputs})
  }

  render() {
    const {formInputs, quote, BillingProfiles, Rate, Taxes, Total, Ready, Submitting} = this.state

    if(Submitting || quote === null){
      return <Loader></Loader>
    }

    if (quote === null){
      return (<div><IntlMessages id="general.loading"></IntlMessages> </div>)
    }

    return (
        <BoxWrapper>
          {formInputs ?
              <FormBox
                  title={this.props.intl.formatMessage({id: 'shipment.quote_offer.title'})}
                  formInputs={formInputs}
                  onSubmit={this.onSubmit}
              />: ""}
        </BoxWrapper>
    )

    // return (
    //
    //    <div>
    //      <Row>
    //        <Col span={12}>
    //          <DescriptionItem title={this.context.intl.formatMessage({id: 'shipment.rate.offer_rate'})}
    //                           content={`${Rate.toFixed(2)}  ${quote.rate.currency_code}`}
    //          />{' '}
    //        </Col>
    //      </Row>
    //      <Row>
    //        <Col span={12}>
    //          <DescriptionItem title={this.context.intl.formatMessage({id: 'shipment.rate.taxes'})}
    //                           content={`${Taxes.toFixed(2)}  ${quote.rate.currency_code}`}
    //
    //          />{' '}
    //        </Col>
    //      </Row>
    //      <Row>
    //        <Col span={12}>
    //          <DescriptionItem title={this.context.intl.formatMessage({id: 'shipment.rate.total'})}
    //                           content={`${Total.toFixed(2)}  ${quote.rate.currency_code}`}
    //
    //          />{' '}
    //        </Col>
    //      </Row>
    //
    //      <Form onSubmit={this.handleSubmit}>
    //        <FormItem {...formItemLayout}
    //        label={this.context.intl.formatMessage({id: 'general.payment_method'})}
    //        >
    //          {getFieldDecorator('Payment_Method', {
    //          rules: [
    //            {
    //            required: true,
    //            message: this.context.intl.formatMessage({id: 'payment_method.select.validation'}),
    //            }
    //          ],
    //          })(
    //            <Select
    //              onChange={this.BillingProfileSelect}
    //              style={{ width: '80%' }}
    //            >
    //              {OptionObjectToKeyValList(BillingProfiles).map((e) => {
    //                 return <option value={e.key}> {this.context.intl.formatMessage({id: e.value.label})}</option>
    //              })}
    //            </Select>)}
    //        </FormItem>
    //
    //
    //        <Row>
    //          <FormItem {...tailFormItemLayout}>
    //            <Button type="primary" htmlType="submit">
    //              <IntlMessages id="general.accept" />
    //            </Button>
    //            <Button style={{ marginLeft: 8 }} onClick={this.onClose}>
    //              Cancel
    //            </Button>
    //          </FormItem>
    //        </Row>
    //      </Form>
    //
    //    </div>
    // );
  }
}

QuoteOfferAccept.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    firebase: state.FB.firebase,
    companyId: state.FB.company.companyId,
    BillingProfiles: state.FB.firestore.data.BillingProfiles ?
      mapFirestoreResultsToModelList(state.FB.firestore.data.BillingProfiles, BillingProfile, true): {}

  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((props) => {
    let queries = []

    if (props.companyId){

      const where_query = [['company', '==', `${props.companyId}`]]
      let storeAs = "BillingProfiles"
      queries.push( {
        collection: 'BillingProfiles',
        where: where_query,
        storeAs: storeAs,
        "merge": false
      })
    }
    return queries
  })
)(injectIntl(QuoteOfferAccept))



