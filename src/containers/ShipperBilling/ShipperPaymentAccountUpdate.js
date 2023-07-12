import React from "react";
import {injectIntl, intlShape} from "react-intl";
import Card from "containers/Uielements/Card/card.style";
import {notifySuccess, notifyError} from "../../components/notification";

import {PropTypes} from "prop-types";
import {PaymentAccount} from "../../model/billing/paymentAccount";
import {FireQuery} from "../../helpers/firebase/firestore/firestore_collection";
import {getStripeOnboardLink} from "../../helpers/firebase/firebase_functions/paymentAccounts";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import Loader from "../../components/utility/loader";
import {Col, Row} from "antd/es/grid";
import {PaymentMethodCard} from "../BillingProfiles/paymentsComponents";

import Tabs, {TabPane} from "../../components/uielements/tabs";
import IntlMessages from "../../components/utility/intlMessages";
import {Button, Space} from "antd";
import {setupPaymentMethodSession} from "../../helpers/firebase/firebase_functions/payment_method";
import {BoxWrapper} from "../../components/utility/box.style";
import PaymentMethods from "./payment_methods";

class ShipperPaymentAccountUpdate extends React.Component {

  static propTypes = {
    companyId: PropTypes.string,
  }

  INITIAL_STATE = {
    loading: false,
    formInputs: undefined,
    currentPane: 'list',
    paymentAccount: undefined,
    queryFilterConditions: [],
    loadingPaymentAccount: false,
    loadingPaymentAccountLink: false,
    checkoutSession: undefined,
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
        new FireQuery("type", "==", "stripe_customer")
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

    e.preventDefault()
    this.setState({ loadingPaymentAccountLink: true})
    getStripeOnboardLink({paymentAccountId: paymentAccount.id, billingProfileId: billing_profile?.id}).then((res) => {
      window.location.href = res.url
    }).catch((e) => {
      notifyError("notification.fail.stripe_account_link", this.props.intl)
      console.log(e)
    }).finally(() => {
      this.setState({ loadingPaymentAccountLink: false})
    })

  }

  renderPayoutMethods = () => {
    const {loadingPaymentAccount, paymentAccount} = this.state
    console.info(`paymentAccount: ${JSON.stringify(paymentAccount || {})}`)

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

  handleChange = () => {

  }

  onCompletedPaymentMethod = () => {

  }

  onCanceledPaymentMethod = () => {
    this.setState({currentPane: 'list'})
  }

  setupPaymentMethodSession = () => {
    const {billing_profile} = this.props

    return setupPaymentMethodSession({billingProfileId: billing_profile?.id}).then(checkoutSession =>{
      this.setState({checkoutSession: checkoutSession}, () => {
        window.location.href = checkoutSession.url
      })

    }).catch(error =>{
      notifyError("billing_profile.setup_payment_method_session.failed", this.props.intl)
    })
  }

  renderPaymentMethodSetup = () => {
    const {paymentAccount, currentPane} = this.state
    const {billing_profile} = this.props

    let content = <Tabs activeKey={currentPane} onTabClick={(key) => this.setState({currentPane: key})}>
      <TabPane tab={<IntlMessages id="payment_method.list" />} key="list">

        <Space
          direction="vertical"
          size="middle"
          style={{
            display: 'flex',
          }}
        >
          <BoxWrapper>
            <Button onClick={this.setupPaymentMethodSession}>
              <IntlMessages id="payment_method.add"/>
            </Button>
          </BoxWrapper>
          <PaymentMethods billing_profile={billing_profile} />
        </Space>

      </TabPane>
    </Tabs>
    return <Card>{content}</Card>

  }

  render() {
    return <>
      {this.renderPaymentMethodSetup()}
    </>
  }

}

const mapStateToProps = state => {
  return {
    companyId: state.FB.company.companyId,
  }
}

ShipperPaymentAccountUpdate.propTypes = {
  intl: intlShape.isRequired
}

export default compose(
  connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(ShipperPaymentAccountUpdate))
