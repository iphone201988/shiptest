import React from "react";
import {injectIntl, intlShape} from "react-intl";
import Card from "containers/Uielements/Card/card.style";
import {getSpan} from "constants/layout/grids";
import FormBox from "containers/base/form_box";
import {SALUTATIONS} from "constants/options/general";
import {PAYMENT_ACTIONS} from "constants/options/money";
import {optionObjectToOptionsLabelValue} from "helpers/data/mapper";
import {notifySuccess, notifyError} from "../../components/notification";
import {updateBillingProfile} from "helpers/firebase/firebase_functions/billing_profiles";
import {RadioButton, RadioGroup} from "../../components/uielements/radio";
import IntlMessages from "../../components/utility/intlMessages";
import UserResourcesView from "../../components/Users/UserResourcesView";
import Box from "components/utility/box";


class SinglePaymentMethod extends React.Component {

  constructor(props){
    const INITIAL_STATE = {
      billing_profile: props.billing_profile || null,
      loading: false,
      formInputs: undefined,
      profile: props.payment_method.profile || null,
    }

    super(props);
    this.state = { ...INITIAL_STATE, ...props };
  }

  componentDidMount() {
    this.setOptions()
  }

  componentDidUpdate(prevProps) {

  }

  setOptions = () => {
    this.setState({
      SalutationOptions: optionObjectToOptionsLabelValue(SALUTATIONS, this.props.intl),
      PaymentActionsOptions: optionObjectToOptionsLabelValue(PAYMENT_ACTIONS, this.props.intl),
      detailsView: this.props.domain || 'billing_profile'
    }, this.setFormInputs)
  }

  Loading = (loading) => {
    this.setState({loading: loading})
  }

  onSubmit = (values) =>{

    this.Loading(true)

    const newBillingContactProfile = {
      salutation: values.salutation,
      full_name: `${values.first_name} ${values.last_name}`,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone: values.phone_number,
      billing_address: values.billing_address,
    }

    const newBillingData = { contact_profile: newBillingContactProfile, id: this.state.billing_profile.id}

    return updateBillingProfile(newBillingData).then(res => {
      notifySuccess("notification.success.update.billing_profile", this.props.intl)
      this.Loading(false)
      this.onCloseDetail()
    }).catch(e => {
      notifyError("notification.fail.update.billing_profile", this.props.intl)
      this.Loading(false)
    })
  };

  setFormInputs = () =>{

    const { SalutationOptions, PaymentActionsOptions, billing_profile, profile } = this.state
    console.log(this.state, "79")
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

    const PaymentMethodFormItemlabelCol = {
      xs: {span: 13},
      sm: {span: 11},
      md: {span: 9},
      lg: {span: 7},
    }

    const PaymentMethodFormItemWrapperCol = {
      xs: {span: 10},
      sm: {span: 12},
      md: {span: 14},
      lg: {span: 16},
    }

    const PaymentMethodWrapperCol = {
      xs: {span: 22},
      sm: {span: 16},
      md: {span: 10},
      lg: {span: 10},
    }
    let formInputs={}
    if(profile?.card){
      formInputs = {
        form_type: "regular",
        submit_label: null,
        formProps:{
          layout: "horizontal",
        },
  
        sections: [
          {
            key: "view_payment_method",
            title: this.props.intl.formatMessage({id:"general.payment_method"}),
            type: "detail",
            groups: [
              {
                // name: "card",
                wrapperCol: {...getSpan(24)},
                groupWrapper:{
                  type: "box",
                  props: {size: "small", title: this.props.intl.formatMessage({id:"general.card"})}
                },
                items: [
                  {
                    name: "brand",
                    type: "textField",
                    formItemProps: {
                      label : this.props.intl.formatMessage({id:"general.card.brand"}),
                      labelCol: PaymentMethodFormItemlabelCol,
                      wrapperCol: PaymentMethodFormItemWrapperCol,
                      initialValue: profile?.card?.brand
                    },
                    fieldProps: {
                      placeholder: this.props.intl.formatMessage({id:"general.card.brand"}),
                      disabled: true
                    },
                    wrapperCol: PaymentMethodWrapperCol
                  },
                  {
                    name: "country",
                    type: "textField",
                    formItemProps:{
                      label : this.props.intl.formatMessage({id:"general.card.country"}),
                      labelCol: PaymentMethodFormItemlabelCol,
                      wrapperCol: PaymentMethodFormItemWrapperCol,
                      initialValue: profile?.card?.country
                    },
                    fieldProps:{
                      placeholder: this.props.intl.formatMessage({id:"general.card.country"}),
                      disabled: true
                    },
                    wrapperCol: PaymentMethodWrapperCol
                  },
                  {
                    name: "expiration_date",
                    type: "textField",
                    formItemProps:{
                      label : this.props.intl.formatMessage({id:"general.card.expiration_date"}),
                      labelCol: PaymentMethodFormItemlabelCol,
                      wrapperCol: PaymentMethodFormItemWrapperCol,
                      initialValue: profile?.card?.expiration_date
                    },
                    fieldProps:{
                      placeholder: this.props.intl.formatMessage({id:"general.card.expiration_date"}),
                      disabled: true
                    },
                    wrapperCol: PaymentMethodWrapperCol
                  },
                  {
                    name: "account_number",
                    type: "textField",
                    formItemProps:{
                      label : this.props.intl.formatMessage({id:"general.card.account_number"}),
                      labelCol: PaymentMethodFormItemlabelCol,
                      wrapperCol: PaymentMethodFormItemWrapperCol,
                      initialValue: contact_profile?.card?.account_number
                    },
                    fieldProps:{
                      placeholder: this.props.intl.formatMessage({id:"general.card.account_number"}),
                      disabled: true
                    },
                    wrapperCol: PaymentMethodWrapperCol
                  },
                  {
                    name: "type",
                    type: "textField",
                    formItemProps:{
                      label : this.props.intl.formatMessage({id:"general.card.type"}),
                      labelCol: PaymentMethodFormItemlabelCol,
                      wrapperCol: PaymentMethodFormItemWrapperCol,
                      initialValue: contact_profile?.card?.type
                    },
                    fieldProps:{
                      placeholder: this.props.intl.formatMessage({id:"general.card.type"}),
                      disabled: true
                    },
                    wrapperCol: PaymentMethodWrapperCol
                  },
                ]
              }, 
            ]
          }
        ]
      }
    }else if(profile?.acss_debit){
      formInputs = {
        form_type: "regular",
        submit_label: null,
        formProps:{
          layout: "horizontal",
        },
  
        sections: [
          {
            key: "view_payment_method",
            title: this.props.intl.formatMessage({id:"general.payment_method"}),
            type: "detail",
            groups: [
            
              {
                name: null,
                wrapperCol: {...getSpan(24)},
                groupWrapper:{
                  type: "box",
                  props: {size: "small", title: null}
                },
                items: [
                  {
                    name: "acss_debit.bank_name",
                    type: "textField",
                    formItemProps: {
                      label : this.props.intl.formatMessage({id:"general.acss_debit.bank_name"}),
                      labelCol: PaymentMethodFormItemlabelCol,
                      wrapperCol: PaymentMethodFormItemWrapperCol,
                      initialValue: profile?.acss_debit?.bank_name
                    },
                    fieldProps: {
                      placeholder: this.props.intl.formatMessage({id:"general.acss_debit.bank_name"}),
                      disabled: true
                    },
                    wrapperCol: PaymentMethodWrapperCol
                  },
                  {
                    name: "acss_debit.institution_number",
                    type: "textField",
                    formItemProps:{
                      label : this.props.intl.formatMessage({id:"acss_debit.institution_number"}),
                      labelCol: PaymentMethodFormItemlabelCol,
                      wrapperCol: PaymentMethodFormItemWrapperCol,
                      initialValue: profile?.acss_debit?.institution_number
                    },
                    fieldProps:{
                      placeholder: this.props.intl.formatMessage({id:"acss_debit.institution_number"}),
                      disabled: true
                    },
                    wrapperCol: PaymentMethodWrapperCol
                  },
                  {
                    name: "acss_debit.transit_number",
                    type: "textField",
                    formItemProps:{
                      label : this.props.intl.formatMessage({id:"acss_debit.transit_number"}),
                      labelCol: PaymentMethodFormItemlabelCol,
                      wrapperCol: PaymentMethodFormItemWrapperCol,
                      initialValue: profile?.acss_debit?.transit_number
                    },
                    fieldProps:{
                      placeholder: this.props.intl.formatMessage({id:"acss_debit.transit_number"}),
                      disabled: true
                    },
                    wrapperCol: PaymentMethodWrapperCol
                  },
                  {
                    name: "acss_debit.account_number",
                    type: "textField",
                    formItemProps:{
                      label : this.props.intl.formatMessage({id:"acss_debit.account_number"}),
                      labelCol: PaymentMethodFormItemlabelCol,
                      wrapperCol: PaymentMethodFormItemWrapperCol,
                      initialValue: profile?.acss_debit?.last4
                    },
                    fieldProps:{
                      placeholder: this.props.intl.formatMessage({id:"acss_debit.account_number"}),
                      disabled: true
                    },
                    wrapperCol: PaymentMethodWrapperCol
                  },
                ]
              },        
        ]
          }
        ]
      }
    }else{
      formInputs = {
        form_type: "regular",
        submit_label: null,
        formProps:{
          layout: "horizontal",
        },
  
        sections: [
          {
            key: "view_payment_method",
            title: this.props.intl.formatMessage({id:"general.payment_method"}),
            type: "detail",
            groups: [
              {
                name: "us_bank_account",
                wrapperCol: {...getSpan(24)},
                groupWrapper:{
                  type: "box",
                  props: {size: "small", title: this.props.intl.formatMessage({id:"general.us_bank_account"})}
                },
                items: [
                  {
                    name: "us_bank_account.bank_name",
                    type: "textField",
                    formItemProps: {
                      label : this.props.intl.formatMessage({id:"general.us_bank_account.bank_name"}),
                      labelCol: PaymentMethodFormItemlabelCol,
                      wrapperCol: PaymentMethodFormItemWrapperCol,
                      initialValue: profile?.us_bank_account?.bank_name
                    },
                    fieldProps: {
                      placeholder: this.props.intl.formatMessage({id:"general.us_bank_account.bank_name"}),
                      disabled: true
                    },
                    wrapperCol: PaymentMethodWrapperCol
                  },
                  {
                    name: "us_bank_account.routing_number",
                    type: "textField",
                    formItemProps: {
                      label : this.props.intl.formatMessage({id:"general.us_bank_account.routing_number"}),
                      labelCol: PaymentMethodFormItemlabelCol,
                      wrapperCol: PaymentMethodFormItemWrapperCol,
                      initialValue: business_profile?.us_bank_account?.routing_number
                    },
                    fieldProps: {
                      placeholder: this.props.intl.formatMessage({id:"general.us_bank_account.routing_number"}),
                      disabled: true
                    },
                    wrapperCol: PaymentMethodWrapperCol
                  },
                  {
                    name: "us_bank_account.account_number",
                    type: "textField",
                    formItemProps: {
                      label : this.props.intl.formatMessage({id:"general.us_bank_account.account_number"}),
                      labelCol: PaymentMethodFormItemlabelCol,
                      wrapperCol: PaymentMethodFormItemWrapperCol,
                      initialValue: business_profile?.us_bank_account?.last4
                    },
                    fieldProps: {
                      placeholder: this.props.intl.formatMessage({id:"general.us_bank_account.accout_number"}),
                      disabled: true
                    },
                    wrapperCol: PaymentMethodWrapperCol
                  },
                  {
                    name: "us_bank_account.account_holder_type",
                    type: "textField",
                    formItemProps: {
                      label : this.props.intl.formatMessage({id:"general.us_bank_account.account_holder_type"}),
                      labelCol: PaymentMethodFormItemlabelCol,
                      wrapperCol: PaymentMethodFormItemWrapperCol,
                      initialValue: business_profile?.us_bank_account?.account_holder_type
                    },
                    fieldProps: {
                      placeholder: this.props.intl.formatMessage({id:"general.us_bank_account.account_holder_type"}),
                      disabled: true
                    },
                    wrapperCol: PaymentMethodWrapperCol
                  },
  
                ]
              },
            
            ]
          }
        ]
      }
    }
  
    this.setState({formInputs: formInputs})
  }

  onCloseDetail = () => {
    this.props.onCloseDetail()
  }


  render() {
    const {formInputs} = this.state
    console.log(formInputs)
    return (

      <div>
        {formInputs ?
          <FormBox
            title={"Payment_methods"}
            formInputs={formInputs}
            // onSubmit={this.onSubmit}
            onCloseDetail={this.onCloseDetail}
          />: ""
        }

      </div>
    )
  }
}

SinglePaymentMethod.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(SinglePaymentMethod)

