import React from "react";
import { injectIntl, intlShape } from "react-intl";
import Card from "containers/Uielements/Card/card.style";
import { getSpan } from "constants/layout/grids";
import FormBox from "containers/base/form_box";
import { SALUTATIONS } from "constants/options/general";
import { PAYMENT_ACTIONS } from "constants/options/money";
import { optionObjectToOptionsLabelValue } from "helpers/data/mapper";
import { notifySuccess, notifyError } from "../../components/notification";
import { updateBillingProfile } from "helpers/firebase/firebase_functions/billing_profiles";
import { RadioButton, RadioGroup } from "../../components/uielements/radio";
import IntlMessages from "../../components/utility/intlMessages";
import UserResourcesView from "../../components/Users/UserResourcesView";
import Box from "components/utility/box";


class BillingProfileUpdate extends React.Component {

  constructor(props) {
    const INITIAL_STATE = {
      billing_profile: props.billing_profile || null,
      loading: false,
      formInputs: undefined,
    }

    super(props);
    this.state = { ...INITIAL_STATE };
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
      detailsView: this.props.itemTabKey || 'billing_profile'
    }, this.setFormInputs)
  }

  Loading = (loading) => {
    this.setState({ loading: loading })
  }

  onSubmit = (values) => {

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

    const newBillingData = { contact_profile: newBillingContactProfile, id: this.state.billing_profile.id }

    return updateBillingProfile(newBillingData).then(res => {
      notifySuccess("notification.success.update.billing_profile", this.props.intl)
      this.Loading(false)
      this.onCloseDetail()
    }).catch(e => {
      notifyError("notification.fail.update.billing_profile", this.props.intl)
      this.Loading(false)
    })
  };

  setFormInputs = () => {

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
      xs: { span: 13 },
      sm: { span: 11 },
      md: { span: 9 },
      lg: { span: 7 },
    }

    const BillingProfileFormItemWrapperCol = {
      xs: { span: 10 },
      sm: { span: 12 },
      md: { span: 14 },
      lg: { span: 16 },
    }

    const BillingProfileWrapperCol = {
      xs: { span: 22 },
      sm: { span: 16 },
      md: { span: 10 },
      lg: { span: 10 },
    }


    const formInputs = {
      form_type: "regular",
      submit_label: this.props.intl.formatMessage({ id: "general.update" }),
      formProps: {
        layout: "horizontal",
      },

      sections: [
        {
          key: "update_billing_profile",
          title: this.props.intl.formatMessage({ id: "general.billing_profile" }),
          type: "detail",
          groups: [
            {
              name: "payment_profile",
              wrapperCol: { ...getSpan(24) },
              groupWrapper: {
                type: "box",
                props: { size: "small", title: this.props.intl.formatMessage({ id: "general.general" }) }
              },
              items: [
                {
                  name: "label",
                  type: "textField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({ id: "general.label" }),
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol,
                    initialValue: billing_profile?.label
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({ id: "general.label" }),
                  },
                  wrapperCol: BillingProfileWrapperCol
                },
                {
                  name: "currency",
                  type: "selectField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({ id: "currency.title" }),
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol,
                    initialValue: billing_profile.currency
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({ id: "currency.title" }),
                    // disabled: true
                  },
                  wrapperCol: BillingProfileWrapperCol
                },
                // {
                // name: "payment_actions",
                // type: "CheckboxGroup",
                // formItemProps: {
                //   initialValue: PaymentActionsInitialValue,
                //   label : this.props.intl.formatMessage({id:"general.payment"}),
                //   labelCol: BillingProfileFormItemlabelCol,
                //   wrapperCol: BillingProfileFormItemWrapperCol
                // },
                // fieldProps: {
                //   placeholder: this.props.intl.formatMessage({id:"general.payment"}),
                //   disabled: true,
                //   options: PaymentActionsOptions,
                // },
                // wrapperCol: BillingProfileWrapperCol
                // },
                // {
                // name: "payment_type",
                // type: "selectField",
                // formItemProps:{
                //   label : this.props.intl.formatMessage({id:"payment.type"}),
                //   labelCol: BillingProfileFormItemlabelCol,
                //   wrapperCol: BillingProfileFormItemWrapperCol,
                //   initialValue: billing_profile.type
                // },
                // fieldProps:{
                //   placeholder: this.props.intl.formatMessage({id:"payment.type"}),
                //   disabled: true,
                // },
                // wrapperCol: BillingProfileWrapperCol
                // },
              ]
            },
            {
              name: "business_profile",
              wrapperCol: { ...getSpan(24) },
              groupWrapper: {
                type: "box",
                props: { size: "small", title: this.props.intl.formatMessage({ id: "general.business_profile" }) }
              },
              items: [
                {
                  name: "business_name",
                  type: "textField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({ id: "general.business_name" }),
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol,
                    initialValue: business_profile?.business_name
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({ id: "general.business_name" }),
                  },
                  wrapperCol: BillingProfileWrapperCol
                },
                {
                  name: "business_address",
                  type: "addressField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({ id: "general.billing_address" }),
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol,
                    initialValue: business_profile?.billing_address
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({ id: "general.billing_address" }),
                  },
                  wrapperCol: BillingProfileWrapperCol
                },
              ]
            },
            {
              name: "contact_information",
              wrapperCol: { ...getSpan(24) },
              groupWrapper: {
                type: "box",
                props: { size: "small", title: this.props.intl.formatMessage({ id: "general.contact_information" }) }
              },
              items: [
                // {
                //   name: "salutation",
                //   type: "selectField",
                //   formItemProps: {
                //     label : this.props.intl.formatMessage({id:"general.salutation"}),
                //     labelCol: BillingProfileFormItemlabelCol,
                //     wrapperCol: BillingProfileFormItemWrapperCol,
                //     initialValue: contact_profile.salutation
                //   },
                //   fieldProps: {
                //     placeholder: this.props.intl.formatMessage({id:"general.salutation"}),
                //     options: SalutationOptions
                //   },
                //   wrapperCol: BillingProfileWrapperCol
                // },
                {
                  name: "first_name",
                  type: "textField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({ id: "general.first_name" }),
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol,
                    initialValue: contact_profile.first_name
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({ id: "general.first_name" }),
                  },
                  wrapperCol: BillingProfileWrapperCol
                },
                {
                  name: "last_name",
                  type: "textField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({ id: "general.last_name" }),
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol,
                    initialValue: contact_profile.last_name
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({ id: "general.last_name" }),
                  },
                  wrapperCol: BillingProfileWrapperCol
                },
                {
                  name: "phone_number",
                  type: "phoneField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({ id: "general.phone_number" }),
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol,
                    initialValue: contact_profile.phone
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({ id: "general.phone_number" }),
                  },
                  wrapperCol: BillingProfileWrapperCol
                },
                {
                  name: "email",
                  type: "textField",
                  formItemProps: {
                    rules: [{ type: "email" }],
                    label: this.props.intl.formatMessage({ id: "general.email" }),
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol,
                    initialValue: contact_profile.email
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({ id: "general.email" }),
                  },
                  wrapperCol: BillingProfileWrapperCol
                },
              ]
            }
          ]
        }
      ]
    }
    this.setState({ formInputs: formInputs })
  }

  onCloseDetail = () => {
    this.props.onCloseDetail()
  }


  render() {
    const { formInputs } = this.state

    return (

      <div>
        {formInputs ?
          <FormBox
            title={"BillingProfileDetails"}
            formInputs={formInputs}
            onSubmit={this.onSubmit}
            onCloseDetail={this.onCloseDetail}
          /> : ""
        }

      </div>
    )
  }
}

BillingProfileUpdate.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(BillingProfileUpdate)

