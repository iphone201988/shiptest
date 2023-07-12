import React, {PureComponent} from "react";
import {PAYMENT_ACTIONS} from "../../constants/options/money";
import Tabs, {TabPane} from "../../components/uielements/tabs";
import IntlMessages from "../../components/utility/intlMessages";
import {CARRIER_AUTHORITIES} from "../../constants/options/carrier/authorities";
import Select from "../../components/uielements/select";
import { loadStripe } from "@stripe/stripe-js"
import FormBox from "../base/form_box";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import {injectIntl, intlShape} from "react-intl";
import {
  cancelPaymentMethodSetupIntent,
  createPaymentMethodSetupIntent
} from "../../helpers/firebase/firebase_functions/payment_method";
import {notifyError, notifySuccess} from "../../components/notification";



const paymentMethodsMap = {
  'acss_debit': {
    confirmSetup: '',
    label: 'payment_method.acss.name',
    requiredFormFields: ['name', 'email', 'account_number', 'institution_number', 'transit_number'],
  }
}

export const INTEGRATION_STATUS = {
  active: {
    name: 'general.active',
    color: "green",
  },
  deactivated: {
    name: 'general.deactivated',
    color: "red",
  }
}

class CreatePaymentMethod extends PureComponent {

  constructor(props) {
    super(props);
    this.INITIAL_STATE = {
      loading: false,
      formInputs: undefined,
      clientSecret: undefined,
      setupIntent: undefined,
      paymentMethodType: undefined,
      stripe: undefined,
      setupIntentSuccess: undefined,
      }
    this.state = { ...this.INITIAL_STATE };
  }

  componentDidMount() {
    loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY).then(stripe => {this.setState({stripe: stripe})})
    this.setFormInputs()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.paymentMethodType != this.state.paymentMethodType){
      this.setFormInputs()
    }
  }

  componentWillUnmount(){
    this.cancelSetupIntent()
  }

  checkRequiredFields = (values, required_fields=[]) => {
    required_fields.forEach((field) => {
      if (values[field] === undefined){
        return false
      }
    })
    return true
  }

  confirmPaymentSetupData = (values) => {
    const {paymentMethodType, } = this.state
    const {companyId, billing_profile} = this.props

    if (paymentMethodType === 'acss_debit') {
      return {
        payment_method: {
        }
      }
    }else{
      return {}
    }
  }

  confirmPaymentSetup = (confirmSetupPayload) => {

    const {setupIntent, stripe} = this.state
    const confirmSetupFunc = stripe.confirmAcssDebitSetup

    if (setupIntent?.client_secret){
      console.log(`confirmPaymentSetup with  payload ${JSON.confirmSetupPayload}`)

      confirmSetupFunc(setupIntent?.client_secret, confirmSetupPayload).then((result) => {
        if (result.error) {
          // Inform the customer that there was an error.
          console.log(result.error.message);
          notifyError("notification.fail.payment_method_added", this.props.intl)
        } else {
          // Handle next step based on SetupIntent's status.
          console.log(`success response: ${JSON.stringify(result)}`)
          this.setState({setupIntentSuccess: true})
          notifySuccess("notification.success.payment_method_added", this.props.intl)
          if (this.props.onCompleted){
            this.props.onCompleted()
          }
        }
      }).catch(e => {console.error((e))})
    }else{
      console.error('No client_secret available')
    }

  }

  onOpenPaymentMethodSetup = (formValues) => {
    const {paymentMethodType} = this.state

    let validForm = this.checkRequiredFields(formValues, paymentMethodsMap[paymentMethodType]?.requiredFormFields ?? [])
    const confirmSetupPayload =  this.confirmPaymentSetupData(formValues)

    if (validForm){
      return this.setSetupIntent(formValues, () => {this.confirmPaymentSetup(confirmSetupPayload)})
    }else{
      console.error('confirmPaymentSetup Invalid Form')
    }
    return {}
  }

  getPaymentMethodFormItems = () => {
    const {paymentMethodType} = this.state
    if (paymentMethodType == 'acss_debit'){

    }
  }

  getFormItem = (field) => {
    const {billing_profile} = this.props

    // cvor Shouldice Trucking
    if (field == 'name'){
      return {
        name: "name",
        type: "textField",
        formItemProps: {
          rules:[{ required: true}],
          label : this.props.intl.formatMessage({id:"general.name"}),
          initialValue: `${billing_profile?.contact_profile?.first_name} ${billing_profile?.contact_profile?.last_name}` ,
        },
        fieldProps: {
          placeholder: this.props.intl.formatMessage({id:"general.name"}),
        },
      }
    }else if (field == 'email'){
      return {
        name: "email",
        type: "textField",
        formItemProps: {
          rules:[{ required: true}],
          label : this.props.intl.formatMessage({id:"general.email"}),
          initialValue: billing_profile?.contact_profile?.email,
        },
        fieldProps: {
          placeholder: this.props.intl.formatMessage({id:"general.email"}),
        },
      }
    }else if (field == 'account_number'){
      return {
        name: "account_number",
        type: "textField",
        formItemProps: {
          rules:[{ required: true}],
          label : this.props.intl.formatMessage({id:"payment.bank_account.name"}),
          initialValue: '000123456789',
        },
        fieldProps: {
          placeholder: this.props.intl.formatMessage({id:"payment.bank_account.placeholder"}),
        },
      }
    }else if (field == 'institution_number'){
      return {
        name: "institution_number",
        type: "textField",
        formItemProps: {
          rules:[{ required: true}],
          label : this.props.intl.formatMessage({id:"payment.institution_number.name"}),
          initialValue: '000',
        },
        fieldProps: {
          placeholder: this.props.intl.formatMessage({id:"payment.institution_number.placeholder"}),
        },
      }
    }else if (field == 'transit_number'){
      return {
        name: "transit_number",
        type: "textField",
        formItemProps: {
          rules:[{ required: true}],
          label : this.props.intl.formatMessage({id:"payment.institution_number.name"}),
          initialValue: '11000',
        },
        fieldProps: {
          placeholder: this.props.intl.formatMessage({id:"payment.institution_number.placeholder"}),
        },
      }
    }

    return undefined

  }

  setFormInputs = () => {

    const {billing_profile} = this.props
    const {paymentMethodType} = this.state

    const paymentMethodOptions = Object.keys(paymentMethodsMap).map(type => {
      return {value: type, label: this.props.intl.formatMessage({id: paymentMethodsMap[type].label})}
    })


    const formItems = [ {
      name: "paymentMethodSelect",
      type: "selectField",
      formItemProps: {
        rules:[{ required: true}],
        label : this.props.intl.formatMessage({id:"payment.type"}),
      },
      fieldProps: {
        placeholder: this.props.intl.formatMessage({id:"payment.type"}),
        options: paymentMethodOptions,
        onSelect: this.onPaymentMethodSelected,
      },
    },]

    const requiredFormFields = paymentMethodsMap[paymentMethodType]?.requiredFormFields ?? []
    requiredFormFields.forEach(field => {
      const formItem = this.getFormItem(field)
      if (formItem){
        formItems.push(formItem)
      }
    })

    // if (requiredFormFields.includes('name') ){
    //   formItems.push({
    //     name: "name",
    //     type: "textField",
    //     formItemProps: {
    //       rules:[{ required: true}],
    //       label : this.props.intl.formatMessage({id:"general.name"}),
    //       initialValue: `${billing_profile?.contact_profile?.first_name} ${billing_profile?.contact_profile?.last_name}` ,
    //     },
    //     fieldProps: {
    //       placeholder: this.props.intl.formatMessage({id:"general.name"}),
    //     },
    //   })
    // }
    //
    // if (requiredFormFields.includes('email')){
    //   formItems.push({
    //     name: "email",
    //     type: "textField",
    //     formItemProps: {
    //       rules:[{ required: true}],
    //       label : this.props.intl.formatMessage({id:"general.email"}),
    //       initialValue: billing_profile?.contact_profile?.email,
    //     },
    //     fieldProps: {
    //       placeholder: this.props.intl.formatMessage({id:"general.email"}),
    //     },
    //   })
    // }

    const formInputs = {
      submit_label: this.props.intl.formatMessage({id: "general.setup"}),
      formProps: {
        layout: "horizontal",
      },
      sections: [
        {
          key: 'main',
          size: 'full',
          items: formItems
        }
        ]
    }
    this.setState({formInputs: formInputs})
  }

  setSetupIntent = (formValues, callback=()=>{}) => {
    const {customer_id, billing_profile} = this.props
    const {paymentMethodType} = this.state

    const data = {
      customer_id: customer_id,
      billing_profile_id: billing_profile?.id,
      payment_method_type: paymentMethodType,
      billing_details: {
        name: formValues.name,
        email: formValues.email
      },
      acss_debit: {
        account_number: formValues.account_number,
        institution_number: formValues.institution_number,
        transit_number: formValues.transit_number
      }
    }

    return createPaymentMethodSetupIntent(data).then((setupIntent) => {
      console.log(`successful setupIntent ${JSON.stringify(setupIntent)}`)
      this.setState({setupIntent: setupIntent}, callback)
    }).catch(e => {
      console.error('failed setupIntent')
    })
  }

  cancelSetupIntent = () => {
    const {setupIntent, setupIntentSuccess} = this.state
    if ( setupIntent?.id && setupIntentSuccess != true){
      cancelPaymentMethodSetupIntent({id: setupIntent?.id}).then(()=>{
        console.log(`Canceling Setup intent ${setupIntent?.id}`)
      }).catch((e)=> {
        console.error(`Error canceling Setup intent ${setupIntent?.id}`)
      })
    }
  }

  onPaymentMethodSelected = (type) => {
    console.log(`onPaymentMethodSelected ${type}`)
    this.cancelSetupIntent()
    this.setState({paymentMethodType: type})
  }

  renderPaymentTypesOptions = () => {

  }


  render(){
    const {formInputs} = this.state
    const {billing_profile} = this.props

    if (billing_profile?.id === undefined){
      return ''
    }


    return (<>
        {formInputs  ? <FormBox
          title={this.props.intl.formatMessage({id: 'general.new_format'})}
          formInputs={formInputs}
          onSubmit={this.onOpenPaymentMethodSetup}
        /> : ""}
    </>
// TODO: add a disable submit button on FormBox
    )
  }
  }

const mapStateToProps = state => {
  return {
    companyId: state.FB.company.companyId,
  }
}

CreatePaymentMethod.propTypes = {
  intl: intlShape.isRequired
}

export default compose(
  connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(CreatePaymentMethod))
