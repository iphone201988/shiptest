import React, {PureComponent} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {injectIntl, intlShape} from "react-intl";
import {PropTypes} from "prop-types";
import {Space} from "antd";
import PaymentMethod from "model/billing/payment_method"
import FormBox from "../base/form_box";
import {FireQuery} from "../../helpers/firebase/firestore/firestore_collection";

class PaymentMethodSelector extends PureComponent {

  INITIAL_STATE = {
    defaultBillingProfileId: undefined,
    defaultPaymentMethodId: undefined,
    paymentMethods: [],
    formInitialized: false
  }

  static propTypes = {
    domain: PropTypes.string,
    companyId: PropTypes.string,
    activeBillingProfiles: PropTypes.arrayOf(PropTypes.object),
    currentCompany: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {...this.INITIAL_STATE};
  }
  
  getBillingProfilesOptions = () => {
    return Object.keys(this.props.activeBillingProfiles).map(key => {
      return {value: key, label: this.props.activeBillingProfiles[key].label}
    })
  }

  getPaymentMethodsOptions = () => {
    const {paymentMethods} = this.state
    return paymentMethods.map(paymentMethod => {
      return {value: paymentMethod.id, label: paymentMethod.id}
    })
  }

  getDefaultBillingProfileId = () => {
    return this.props.currentCompany?.default_billing_profile?.id || this.props.activeBillingProfiles[0]
  }

  getPaymentMethods = (billingProfileId) => {
    PaymentMethod.collection.query([new FireQuery("billing_profile.id", "==", billingProfileId)], this.setPaymentMethods, true)
  }

  setPaymentMethods = (paymentMethods) => {
    this.setState({paymentMethods: paymentMethods}, this.setDefaultPaymentMethodId)
  }

  getDefaultPaymentMethod = () => {
    // TODO:  Load the default payment method using redux
    const {paymentMethods} = this.state
    return  paymentMethods[0]
  }

  setDefaultPaymentMethodId = () => {
    this.setState({defaultPaymentMethodId: this.getDefaultPaymentMethod()?.id}, () => {
      this.onPaymentMethodSelected(this.getDefaultPaymentMethod()?.id)
    })
  }

  setDefaultBillingProfileId = () => {
    /*
       set the default billing profile
     */
    const defaultBillingProfileId = this.getDefaultBillingProfileId()
    this.setState({defaultBillingProfileId: defaultBillingProfileId}, () => {
      this.getPaymentMethods(defaultBillingProfileId)
      // select the default billing profile
      this.onBillingProfileSelected(defaultBillingProfileId)
    })
  }

  onBillingProfileSelected = (billingProfileId) => {
    this.getPaymentMethods(billingProfileId)
    this.onPaymentMethodSelected(undefined)
  }

  onPaymentMethodSelected = (paymentMethodId) => {
    if (this.props.onPaymentMethodSelected){
      this.props.onPaymentMethodSelected(paymentMethodId)
    }
  }

  getFormInputs = () =>{
    const {defaultBillingProfileId, defaultPaymentMethodId} = this.state

    const billingProfilesOptions = this.getBillingProfilesOptions()
    const paymentMethodsOptions = this.getPaymentMethodsOptions()
    // const defaultBillingProfileId = this.getDefaultBillingProfileId()

    const formItems = []
    if (defaultBillingProfileId && billingProfilesOptions && billingProfilesOptions.length > 0){
      formItems.push({
        name: "billing_profile",
        type: "selectField",
        formItemProps:{
          initialValue: defaultBillingProfileId,
          rules:[
            {
              required: true
            }
          ],
          label : this.props.intl.formatMessage({id:"billing.profile"}),
          labelCol: {
            span: 4
          },
          wrapperCol: {
            span: 16
          },
        },
        fieldProps:{
          placeholder: this.props.intl.formatMessage({id:"general.billing_profile"}),
          options: billingProfilesOptions
        },
      })
    }

    if (paymentMethodsOptions.length > 0 && defaultPaymentMethodId != undefined) {
      formItems.push({
        name: "payment_methods",
        type: "selectField",
        formItemProps:{
          initialValue: defaultPaymentMethodId,
          rules:[
            {
              required: true
            }
          ],
          label : this.props.intl.formatMessage({id:"payment.payment_methods"}),
          labelCol: {
            span: 4
          },
          wrapperCol: {
            span: 16
          },
        },
        fieldProps:{
          onSelect: this.onPaymentMethodSelected,
          placeholder: this.props.intl.formatMessage({id:"payment.payment_methods.select"}),
          options: paymentMethodsOptions
        },
      })
    }

    const formInputs = {
      form_type: "regular",
      formProps:{
        layout: "horizontal"
      },
      sections: [
        {
          name: "name",
          size: "full",
          items:formItems,
          type: "noButtons",
        }
      ]
    }
    return formInputs
  }

  onSubmit = () => {
    if (this.props.onSubmit){

    }
  }

  componentDidMount() {
    if (this.props.currentCompany){
      this.setDefaultBillingProfileId()
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentCompany === undefined && this.props.currentCompany != undefined){
      this.setDefaultBillingProfileId()
    }
  }

  render() {

    const formInputs = this.getFormInputs()

    return <>
      {formInputs  ?
        <FormBox
          title=""
          formInputs={formInputs}
        />: ""}
    </>
  }
}

PaymentMethodSelector.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  return {
    domain: state.FB.company.domain,
    companyId: state.FB.company.companyId,
    currentCompany: state.FB.company.currentCompany,
    activeBillingProfiles: state.FB.billingProfiles?.activeBillingProfiles || [],
  };
};

export default compose(
  connect(mapStateToProps, {}),
)(injectIntl(PaymentMethodSelector));