import React, { PureComponent } from "react";
import {injectIntl, intlShape} from "react-intl";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import {notifyError, notifySuccess} from "components/notification";

import VopayIframe from "containers/BillingProfiles/vopay_iframe"
import Loader from "components/utility/loader";

import {CURRENCIES_CODES, PAYMENT_TYPES, PAYMENT_ACTIONS} from "constants/options/money";
import {SALUTATIONS} from "constants/options/general";

import {BoxWrapper} from "components/utility/box.style";
import FormBox from "../base/form_box";
import {spans} from "constants/layout/grids";
import {optionObjectToOptionsLabelValue} from "helpers/data/mapper";
import {addBillingProfile, getVopayURL} from "helpers/firebase/firebase_functions/billing_profiles";



class NewBillingProfile extends PureComponent {

  constructor(props) {
    super(props);
    this.INITIAL_STATE = {
      loading: false,
      formInputs: undefined,
      Label: '',
      Address: null,
      Phone: null,
      Email: null,
      FormReady: false,
      vopayURL: undefined,
      vopayToken: undefined,
      RedirectPage: false,
      Submitting: false,
      isModalVisible: false, 
      CurrencyOptions: undefined, 
      PaymentActionsOptions: Object.keys(PAYMENT_ACTIONS).map(key => {
        return {label: this.props.intl.formatMessage({id: PAYMENT_ACTIONS[key].name}) , value: key}
    }),
      PaymentActionsInitialValue: undefined,
      SalutationOptions: undefined
    }

    this.state = { ...this.INITIAL_STATE };

  }

  componentDidMount() {
    this.setOptions()
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.setState({...this.INITIAL_STATE})
  }

  setOptions = () => {
    const PaymentActionsInitialValue = []
    Object.keys(PAYMENT_ACTIONS).forEach(key => {
      PaymentActionsInitialValue.push(key)
  })
    this.setState({
      CurrencyOptions: optionObjectToOptionsLabelValue(CURRENCIES_CODES, this.props.intl),
      PaymentTypeOptions: optionObjectToOptionsLabelValue(PAYMENT_TYPES, this.props.intl),
      SalutationOptions: optionObjectToOptionsLabelValue(SALUTATIONS, this.props.intl),
      PaymentActionsInitialValue: PaymentActionsInitialValue
    }, this.setFormInputs)
  }

  onDone = () => {
    if (this.props.onDone){
      this.handleReset()
      this.props.onDone()
    }
  }

  loading = (value) => {
    this.setState({
      loading: value
    })
  }

  onSubmit = (values) => {

    const paymentProfile = {
      token: this.state.vopayToken,
      masked_account: "masked account ahah" || "",
      bank_name: "bank name hihi" || "",
      bank_number: "bank number hoho" || "",
      full_name: `${values.first_name} ${values.last_name}` || "",
    }

    let billingData = {
      type: values.payment_type,
      label: values.label,
      currency: values.currency,
      company: this.props.companyId,
      status: "values.payment_status",
      payment_actions: {
        make_payment: values.payment_actions.includes("make_payment") ? true : false,
        receive_payment: values.payment_actions.includes("receive_payment") ? true : false,
      },
      contact_profile: {
        salutation: values.salutation,
        full_name: `${values.first_name} ${values.last_name}`,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone_number,
        billing_address: values.billing_address,
      },
        payment_profile: paymentProfile || {}
    }

    return addBillingProfile(billingData).then(res => {
      notifySuccess("notification.success.new_billing_profile", this.props.intl)
      // this.onDone()
    }).catch(e => {
      notifyError("notification.fail.new_billing_profile", this.props.intl)
    })
  }

  receiveMessage = (event) => {
    if (event.origin === "https://earthnode-dev.vopay.com") {
      const data = JSON.parse(event.data)
      this.setState({
          vopayToken: data.Token,
          vopayURL: undefined,
          isModalVisible: false
      }, window.removeEventListener('message', this.receiveMessage, false))
    }
  }

  onPaymentSelect = (value) => {
    if (value === "bank") {
        this.loading(true)
        window.addEventListener('message', this.receiveMessage, false);
        return getVopayURL(value).then(res => {
          this.setState({
            vopayURL : res.EmbedURL,
            isModalVisible: true,
            loading: false
          })
        }).catch(e => {
          notifyError("notification.fail.new_billing_profile", this.props.intl)
        })
    }
  }

  handleModalCancel = () => {
    this.setIsModalVisible(false);
  };

  setIsModalVisible = (value) => {
    this.setState({
      isModalVisible: value
    })
  }
  

  setFormInputs = () => {

    const {CurrencyCode, CurrencyOptions, PaymentActionsOptions, PaymentActionsInitialValue, PaymentTypeOptions, SalutationOptions} = this.state


    const BillingProfileFormItemlabelCol = {
			xs: {span: 10},
			sm: {span: 8},
			md: {span: 6},
			lg: {span: 3},
		}

		const BillingProfileFormItemWrapperCol = {
			xs: {span: 4},
			sm: {span: 6},
			md: {span: 8},
			lg: {span: 10},
		}

		const BillingProfileWrapperCol = {
			xs: {span: 18},
			sm: {span: 16},
			md: {span: 14},
			lg: {span: 24},
		}

  
    const formInputs = {
      form_type: "multi_steps_tabs",
      submit_label: this.props.intl.formatMessage({id:"general.submit"}),
      formProps: {
        layout: "horizontal",
      },
      sections: [
        {
          key: "account_information",
          size: "full",
          title: this.props.intl.formatMessage({id:"general.account_information"}),
          groups: [
            {
              name: "Account Information",
              wrapperCol: {...spans["full"]},
              groupWrapper:{
                type: "box",
                props: {size: "small"},
              },
              items: [
                {
                  name: "label",
                  type: "textField",
                  formItemProps: {
                    rules:[{ required: true}],
                    label : this.props.intl.formatMessage({id:"general.label"}),
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({id:"general.label"}),
                  },
                  wrapperCol: BillingProfileWrapperCol
                },
                {
                  name: "currency",
                  type: "selectField",
                  formItemProps:{
                    initialValue: CurrencyCode,
                    rules:[{ required: true, message: this.props.intl.formatMessage({id: 'currency.select.validation'})}],
                    label : this.props.intl.formatMessage({id:"currency.title"}),
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id:"currency.title"}),
                    options: CurrencyOptions
                  },
                  wrapperCol: BillingProfileWrapperCol
                },
                {
                  name: "payment_actions",
                  type: "CheckboxGroup",
                  formItemProps: {
                    rules:[{ required: true}],
                    initialValue: PaymentActionsInitialValue,
                    label : this.props.intl.formatMessage({id:"general.payment"}),
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({id:"general.payment"}),
                    options: PaymentActionsOptions,
                  },
                  wrapperCol: BillingProfileWrapperCol
                },
                {
                  name: "payment_type",
                  type: "selectField",
                  formItemProps:{
                    rules:[{ required: true}],
                    label : this.props.intl.formatMessage({id:"payment.type"}),
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol,
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id:"payment.type"}),
                    options: PaymentTypeOptions,
                    onSelect: this.onPaymentSelect
                  },
                  wrapperCol: BillingProfileWrapperCol
                },
              ]
            }
          ]
        },
        {
          key: "contact_information",
          size: "full",
          title: this.props.intl.formatMessage({id:"general.contact_information"}),
          groups: [
            {
              name: "userProfile",
              wrapperCol: {...spans["full"]},
              groupWrapper:{
                type: "box",
                props: {size: "small"},
              },
              items: [
                {
                  name: "salutation",
                  type: "selectField",
                  formItemProps: {
                    rules:[{ required: true}],
                    label : this.props.intl.formatMessage({id:"general.salutation"}),
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({id:"general.salutation"}),
                    options: SalutationOptions
                  },
                  wrapperCol: BillingProfileWrapperCol
                },
                {
                  name: "first_name",
                  type: "textField",
                  formItemProps: {
                    rules:[{ required: true}],
                    label : this.props.intl.formatMessage({id:"general.first_name"}),
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({id:"general.first_name"}),
                  },
                  wrapperCol: BillingProfileWrapperCol
                },
                {
                  name: "last_name",
                  type: "textField",
                  formItemProps:{
                    rules:[{ required: true}],
                    label : this.props.intl.formatMessage({id:"general.last_name"}),
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id:"general.last_name"}),
                  },
                  wrapperCol: BillingProfileWrapperCol
                },
                {
                  name: "phone_number",
                  type: "phoneField",
                  formItemProps:{
                    rules:[{ required: true }],
                    label : this.props.intl.formatMessage({id:"general.phone_number"}),
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id:"general.phone_number"}),
                  },
                  wrapperCol: BillingProfileWrapperCol
                },
                {
                  name: "email",
                  type: "textField",
                  formItemProps:{
                    rules:[{ type:"email", required: true}],
                    label : this.props.intl.formatMessage({id:"general.email"}),
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id:"general.email"}),
                  },
                  wrapperCol: BillingProfileWrapperCol
                },
                {
                  name: "billing_address",
                  type: "addressField",
                  formItemProps:{
                    rules:[{ required: true}],
                    hasFeedback: true,
                    label : this.props.intl.formatMessage({id:"general.address"}),
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id:"general.address.placeholder.search_select"}),
                  },
                  wrapperCol: BillingProfileWrapperCol
                },
              ]
            }
          ]
        }
      ]
    }
    this.setState({formInputs: formInputs})
  }

  render() {

    const {formInputs, vopayURL, isModalVisible, loading} = this.state

        return (
              <BoxWrapper>
                {formInputs ?
                  <FormBox
                      title={this.props.intl.formatMessage({id: 'users.actions.add_user'})}
                      formInputs={formInputs}
                      onSubmit={this.onSubmit}
                  />: ""}
                  { loading ?
                    <Loader /> : ""
                  }
                  <VopayIframe vopayURL={vopayURL} isModalVisible={isModalVisible} handleModalCancel={this.handleModalCancel} /> 
              </BoxWrapper>
        )
  }
}

NewBillingProfile.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  return {
    companyId: state.FB.company.companyId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    clearFirestore: () => dispatch({ type: '@@reduxFirestore/CLEAR_DATA' })
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firebaseConnect()
)(injectIntl(NewBillingProfile))
