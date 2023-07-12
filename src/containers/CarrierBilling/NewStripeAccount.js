import React, { PureComponent } from "react";
import {Row, Col} from 'antd/es/grid/';
import {injectIntl, intlShape}  from "react-intl";
import {PropTypes} from "prop-types";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import IntlMessages from "components/utility/intlMessages";
import Card from "containers/Uielements/Card/card.style";
import Loader from "components/utility/loader";
import {createPaymentCustomerAccount, getStripeOnboardLink} from "helpers/firebase/firebase_functions/paymentAccounts";
import {PaymentAccount} from "model/billing/paymentAccount";
import {FireQuery} from "../../helpers/firebase/firestore/firestore_collection";
import {notifyError} from "../../components/notification";

class NewStripeAccount extends PureComponent {

  static propTypes = {
    companyId: PropTypes.string,
  }

  INITIAL_STATE = {
    loading: false,
    isModalVisible: false,
    paymentAccount: undefined,
    loadingPaymentAccount: true,
    loadingPaymentAccountLink: false,
  }

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
  }

  componentDidMount() {
    if (this.props.companyId) {
      PaymentAccount.collection.query([new FireQuery("company_account.id", "==", this.props.companyId)], this.onPaymentAccountChange, true)
    }
    createPaymentCustomerAccount()
  }

  onPaymentAccountChange = (paymentAccountsData) => {
    const paymentAccountData = Array.isArray(paymentAccountsData) ? paymentAccountsData[0] : undefined
    if (paymentAccountData){
      this.setState({ paymentAccount: paymentAccountData, loadingPaymentAccount: false})
    }else{
      this.setState({ loadingPaymentAccount: false})

    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({ loadingPaymentAccountLink: true})
    getStripeOnboardLink(this.props.companyId).then((res) => {
      window.location.href = res.url
    }).catch((e) => {
      notifyError("notification.fail.stripe_account_link", this.props.intl)
      console.log(e)
    }).finally(() => {
      this.setState({ loadingPaymentAccountLink: false})
    })

  }

  render() {
    const {loadingPaymentAccount, paymentAccount} = this.state

    let content = ''

    if (loadingPaymentAccount){
      content =  <Loader></Loader>
    }else if (paymentAccount?.profile?.payouts_enabled){
      content =  (
          <Row gutter={[0, 16]}>
          <Col>
            <IntlMessages id={"payment.stripe_connect.success"}></IntlMessages>
          </Col>
        </Row>
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
              <button onClick={this.handleSubmit}> <IntlMessages id="stripe.connect" /> </button>
            </Col>
          </Row>
        </>
      )
    }
    return <Card>{content}</Card>
  }
}


NewStripeAccount.propTypes = {
  intl: intlShape.isRequired
}

const mapStateToProps = state => {
  return {
    companyId: state.FB.company.companyId,
  }
}

export default compose(
  connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(NewStripeAccount))
