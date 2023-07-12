import React from "react";
import {injectIntl, intlShape} from "react-intl";
import Card from "containers/Uielements/Card/card.style";

import {notifyError} from "../../components/notification";
import IntlMessages from "../../components/utility/intlMessages";

import {PropTypes} from "prop-types";
import {PaymentAccount} from "../../model/billing/paymentAccount";
import {FireQuery} from "../../helpers/firebase/firestore/firestore_collection";
import Loader from "../../components/utility/loader";
import {Col, Row} from "antd/es/grid";
import {getStripeOnboardLink} from "../../helpers/firebase/firebase_functions/paymentAccounts";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import {PaymentMethodCard} from "../BillingProfiles/paymentsComponents";


class CarrierPaymentAccountUpdate extends React.Component {

  static propTypes = {
    companyId: PropTypes.string,
  }

  INITIAL_STATE = {
    loading: false,
    formInputs: undefined,
    paymentAccount: undefined,
    loadingPaymentAccount: false,
    loadingPaymentAccountLink: false,
  }

  constructor(props){
    super(props);
    this.state = { ...this.INITIAL_STATE };
  }

  componentDidMount() {
    if (this.props.companyId && this.props.billing_profile) {
      PaymentAccount.collection.query([
        new FireQuery("company_account.id", "==", this.props.companyId),
        new FireQuery("billing_profile.id", "==", this.props.billing_profile?.id),
        new FireQuery("type", "==", "stripe_account")
      ], this.onPaymentAccountChange, true)
    }
    this.setState({loadingPaymentAccount: true})
  }

  componentDidUpdate(prevProps) {

  }

  onPaymentAccountChange = (paymentAccountsData) => {
    const paymentAccountData = Array.isArray(paymentAccountsData) ? paymentAccountsData[0] : undefined
    if (paymentAccountData){
      this.setState({ paymentAccount: paymentAccountData, loadingPaymentAccount: false})
    }else{
      this.setState({ loadingPaymentAccount: false})
    }
  }

  Loading = (loading) => {
    this.setState({loading: loading})
  }


  setFormInputs = () =>{

    const { SalutationOptions, PaymentActionsOptions, billing_profile } = this.state
    const contact_profile = billing_profile?.contact_profile
    const payment_profile = billing_profile?.payment_profile
    const business_profile = billing_profile?.business_profile

    console.log('***', PaymentActionsOptions);

    const PaymentActionsInitialValue = []
    Object.keys(billing_profile?.payment_actions || {}).forEach(action => {
      if (billing_profile.payment_actions[action] === true) {
        PaymentActionsInitialValue.push(action)
      }
    })

    const BillingProfileFormItemlabelCol = {
      xs: {span: 13},
      sm: {span: 11},
      md: {span: 9},
      lg: {span: 7},
    }

    const BillingProfileFormItemWrapperCol = {
      xs: {span: 10},
      sm: {span: 12},
      md: {span: 14},
      lg: {span: 16},
    }

    const BillingProfileWrapperCol = {
      xs: {span: 22},
      sm: {span: 16},
      md: {span: 10},
      lg: {span: 10},
    }


    const formInputs = {}
    this.setState({formInputs: formInputs})
  }

  onCloseDetail = () => {
    this.props.onCloseDetail()
  }

  handleSubmit = (e) => {
    const { loadingPaymentAccount, paymentAccount } = this.state
    const { billing_profile } = this.props

    const payouts_enabled = paymentAccount?.profile?.payouts_enabled
    const type = payouts_enabled ? "account_onboarding" : "account_onboarding"

    e.preventDefault()
    this.setState({ loadingPaymentAccountLink: true})
    console.log({paymentAccountId: paymentAccount.id, billingProfileId: billing_profile?.id, type: type})
    getStripeOnboardLink({paymentAccountId: paymentAccount.id, billingProfileId: billing_profile?.id, type: type}).then((res) => {
      console.log(res)
      window.location.href = res.url
    }).catch((e) => {
      notifyError("notification.fail.stripe_account_link", this.props.intl)
      console.log(e)
    }).finally(() => {
      this.setState({ loadingPaymentAccountLink: false})
    })
  }

  renderPaymentSetup = () => {
    const {loadingPaymentAccount, paymentAccount} = this.state

    let content = ''

    if (loadingPaymentAccount){
      content =  <Loader></Loader>
    }else if (paymentAccount?.profile?.payouts_enabled){
      content =  (
        <>
          <Row gutter={[0, 16]}>
            <Col>
              <IntlMessages id={"payment.stripe_connect.success"}></IntlMessages>
            </Col>
          </Row>
          <Row gutter={[0, 16]}>
            <Col>
              <button onClick={this.handleSubmit}> <IntlMessages id="payment.edit_payment_account" /> </button>
            </Col>
          </Row>
        </>
      )
    }else{
      content = (
        <>
          <Row gutter={[0, 16]}>
            <Col>
              <IntlMessages id={"payment.stripe_connect.description"}></IntlMessages>
            </Col>
          </Row>
          <Row gutter={[0, 16]}>
            <Col>
              <button onClick={this.handleSubmit}> <IntlMessages id="payment.setup_payment_account" /> </button>
            </Col>
          </Row>
        </>
      )
    }
    return <Card title={this.props.intl.formatMessage({id:"payment.setup_payment_account"})}>{content}</Card>
  }

  renderPayoutMethods = () => {
    const {loadingPaymentAccount, paymentAccount} = this.state
    const paymentAccounts = paymentAccount?.profile?.external_accounts?.data || []
    let content = ''

    if (loadingPaymentAccount){
      content = <Loader></Loader>
    }else{
      content = paymentAccounts.map(paymentAccount => {
        return <Row gutter={[16, 16]}>
          <Col span={10} >
            <PaymentMethodCard  payment_account={paymentAccount} />
          </Col>
        </Row>
      })
    }
    return   <Card title={this.props.intl.formatMessage({id:"general.payment_method"})}>{content}</Card>;
  }

  render() {
    return <>
      {this.renderPaymentSetup()}
      {this.renderPayoutMethods()}
    </>
  }

}

const mapStateToProps = state => {
  return {
    companyId: state.FB.company.companyId,
  }
}

CarrierPaymentAccountUpdate.propTypes = {
  intl: intlShape.isRequired
}

export default compose(
  connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(CarrierPaymentAccountUpdate))
