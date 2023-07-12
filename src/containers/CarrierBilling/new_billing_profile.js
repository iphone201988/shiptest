import React, { PureComponent } from "react";
import {injectIntl, intlShape} from "react-intl";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import {notifyError, notifySuccess} from "components/notification";

import Loader from "components/utility/loader";

import {CURRENCIES_CODES, PAYMENT_TYPES, PAYMENT_ACTIONS, default_currency} from "constants/options/money";
import {SALUTATIONS} from "constants/options/general";

import {BoxWrapper} from "components/utility/box.style";
import FormBox from "../base/form_box";
import {spans} from "constants/layout/grids";
import {optionObjectToOptionsLabelValue} from "helpers/data/mapper";
import {addBillingProfile} from "helpers/firebase/firebase_functions/billing_profiles";
import {BUSINESS_STRUCTURE} from "../../constants/options/billing_profile";
import BillingProfile from "../../model/billing/billing_profile";

 
class NewBillingProfile extends PureComponent {

  constructor(props) {
    super(props);
    this.INITIAL_STATE = {
      loading: false,
      formInputs: undefined,
      isModalVisible: false,
      CurrencyOptions: undefined,
      BusinessStructuresOptions: undefined,
      PaymentActionsOptions: Object.keys(PAYMENT_ACTIONS).map(key => {
        return {label: this.props.intl.formatMessage({id: PAYMENT_ACTIONS[key].name}) , value: key}
    }),
      PaymentActionsInitialValue: undefined,
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
      BusinessStructuresOptions: optionObjectToOptionsLabelValue(BUSINESS_STRUCTURE, this.props.intl),
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

    let billingData = new BillingProfile (undefined,
      {
        label: values.label,
        business_profile: {
          business_name: values.business_name,
          billing_address: values.billing_address,
        },
        currency: values.currency,
        company_account: {id: this.props.companyId},
        contact_profile: {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          phone: values.phone,
        }
      })
    return addBillingProfile(billingData).then(res => {
      notifySuccess("notification.success.new_billing_profile", this.props.intl)
    }).catch(e => {
      notifyError("notification.fail.new_billing_profile", this.props.intl)
    })
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

    const {CurrencyCode, CurrencyOptions, BusinessStructuresOptions, PaymentActionsOptions, PaymentActionsInitialValue, PaymentTypeOptions} = this.state


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
                    initialValue: 'Default',
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({id:"general.label"}),
                  },
                  wrapperCol: BillingProfileWrapperCol
                },
                {
                  name: "business_name",
                  type: "textField",
                  formItemProps: {
                    rules:[{ required: true}],
                    label : this.props.intl.formatMessage({id:"general.business_name"}),
                    initialValue: this.props.company?.profile?.name,
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({id:"general.business_name"}),
                  },
                  wrapperCol: BillingProfileWrapperCol
                },
                {
                  name: "billing_address",
                  type: "addressField",
                  formItemProps: {
                    rules:[{ required: true}],
                    label : this.props.intl.formatMessage({id:"general.billing_address"}),
                    initialValue: this.props.company?.profile?.address,
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({id:"general.address.placeholder.search_select"}),
                  },
                  wrapperCol: BillingProfileWrapperCol
                },
                {
                  name: "currency",
                  type: "selectField",
                  formItemProps:{
                    rules:[{ required: true, message: this.props.intl.formatMessage({id: 'currency.select.validation'})}],
                    label : this.props.intl.formatMessage({id:"currency.title"}),
                    initialValue: default_currency(),
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id:"currency.title"}),
                    options: CurrencyOptions
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
                  name: "first_name",
                  type: "textField",
                  formItemProps: {
                    rules:[{ required: true}],
                    label : this.props.intl.formatMessage({id:"general.first_name"}),
                    initialValue: this.props.user?.profile?.first_name,
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({id:"general.first_name.placeholder"}),
                  },
                  wrapperCol: BillingProfileWrapperCol
                },
                {
                  name: "last_name",
                  type: "textField",
                  formItemProps: {
                    rules:[{ required: true}],
                    label : this.props.intl.formatMessage({id:"general.last_name"}),
                    initialValue: this.props.user?.profile?.last_name,
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({id:"general.first_name.placeholder"}),
                  },
                  wrapperCol: BillingProfileWrapperCol
                },
                {
                  name: "phone",
                  type: "phoneField",
                  formItemProps:{
                    rules:[{ required: true }],
                    label : this.props.intl.formatMessage({id:"general.phone_number"}),
                    initialValue: this.props.user?.profile?.phone,
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
                    initialValue: this.props.user?.profile?.email,
                    labelCol: BillingProfileFormItemlabelCol,
                    wrapperCol: BillingProfileFormItemWrapperCol
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id:"general.email"}),
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

    const {formInputs, isModalVisible, loading} = this.state

        return (
              <BoxWrapper>
                {formInputs ?
                  <FormBox
                      title={this.props.intl.formatMessage({id: 'users.actions.add_billing_profile'})}
                      formInputs={formInputs}
                      onSubmit={this.onSubmit}
                  />: ""}
                  { loading ?
                    <Loader /> : ""
                  }
              </BoxWrapper>
        )
  }
}

NewBillingProfile.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  return {
    companyId: state.FB.company.companyId,
    company: state.FB.company.company,
    user: state.FB.companyUser.user,
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
