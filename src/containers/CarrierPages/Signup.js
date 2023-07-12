import React, { Component } from "react";
import {Redirect} from "react-router-dom";
import {injectIntl} from "react-intl";
import { connect } from "react-redux";
import {compose} from "redux";
import {firebaseConnect} from "react-redux-firebase";
import {CARRIER_ROUTES} from 'constants/routes'
import {formatPhone} from "helpers/data/format";
import Loader from "components/utility/loader";
import {spans} from "constants/layout/grids";
import {BoxWrapper} from "components/utility/box.style";
import FormBox from "../base/form_box";
import {notifyError, notifySuccess} from "components/notification";
import {registerAccount} from "helpers/firebase/firebase_functions/accounts";
import {CARRIER_AUTHORITIES} from "constants/options/carrier/authorities";
import {optionObjectToOptionsLabelValue} from "helpers/data/mapper";
import { SignupFormItemlabelCol, SignupFormItemWrapperCol, SignupWrapperCol, SignupTermsAndConditionsItemLabelCol } from "helpers/containers/properties/signup";
import {CURRENCIES_CODES} from "../../constants/options/money";
import {BUSINESS_STRUCTURE} from "../../constants/options/billing_profile";
import BillingProfile from "../../model/billing/billing_profile";
import CarrierUser from "../../model/user/carrier_user";

const INITIAL_STATE = {
  AllCarrierAuthorities:[],
  CompanyAddress:'',
  error: null,
  RedirectToDashboard: false,
  loading: false,
  formInputs: undefined,
  useBillingSameCompanyInfo: true,
  BusinessStructuresOptions: undefined,
  CurrencyOptions: undefined,
};

class Signup extends Component {


  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount(){
    this.setOptions()
  }

  componentDidUpdate(nextProps) {
    if (
      this.props.isLoggedIn !== nextProps.isLoggedIn &&
      nextProps.isLoggedIn === true
    ) {
      this.setState({ redirectToReferrer: true });
    }
  }

  setOptions() {
    this.setState({
      AllCarrierAuthorities: optionObjectToOptionsLabelValue(CARRIER_AUTHORITIES, this.props.intl),
      CurrencyOptions: optionObjectToOptionsLabelValue(CURRENCIES_CODES, this.props.intl),
      BusinessStructuresOptions: optionObjectToOptionsLabelValue(BUSINESS_STRUCTURE, this.props.intl),
    }, this.setFormInputs)
  }

  onSubmit = (values) => {
    
    this.loading(true)
    const user_data = {
      profile: {
        first_name: values.user_first_name,
        last_name: values.user_last_name,
        email: values.user_email,
        password: values.user_password,
        phone: formatPhone(values.user_phone, "E.164"),
      },
      domain: "carrier"
    }

    const companyData = {
      profile: {
        name: values.company_name,
        phone: formatPhone(values.company_phone_number, "E.164"),
        website: values.company_website,
        address: this.state.CompanyAddress,
        carrier_authority_ids: [{authority_id: values.authority_number, carrier_authority: values.carrier_authority}]
      },
      domain: 'carrier'
    }

    // let billingProfileData = {
    //   business_profile: {
    //       business_name: values.billing_business_name,
    //       billing_address: values.billing_address,
    //       business_structure: values.billing_business_structure
    //     },
    //     currency: values.billing_currency,
    //     company_account: {id: this.props.companyId},
    //     contact_profile: {
    //       first_name: values.billing_contact_first_name,
    //       last_name: values.billing_contact_last_name,
    //       email: values.billing_contact_email,
    //       phone: values.billing_contact_phone_number,
    //     }
    // }

    let registrationData = {
      user: user_data,
      company: companyData,
      // billing_profile: billingProfileData
    }

    return registerAccount(registrationData).then(res => {
      notifySuccess("notification.success.register_carrier", this.props.intl)
      this.onDone()
      this.loading(false)
      this.setState({RedirectToDashboard: true})
      }).catch(e => {
          notifyError("notification.fail.register_carrier", this.props.intl)
          this.loading(false)
      })
  }

  onDone = () => {
    if (this.props.onDone){
        this.props.onDone()
    }
  }

  loading = (loading) => {
    this.setState({loading: loading})
}


  onAddressSelect = (value) => {
    this.setState({CompanyAddress: value})
  }

  setFormInputs = () =>{
     const { CurrencyOptions, BusinessStructuresOptions } = this.state

    const formInputs = {
        form_type: "multi_steps_tabs",
        submit_label: this.props.intl.formatMessage({id:"general.submit"}),
        formProps:{
          layout: "horizontal",
        },
        sections: [
          {
            key: "signup_company",
            size: "full",
            title: this.props.intl.formatMessage({id:"general.company"}),
            groups: [
              {
                name: "companyInfo",
                wrapperCol: {...spans["full"]},
                groupWrapper:{
                  type: "box",
                  props: {size: "small"},
                },
                items: [
                  {
                    name: "company_name",
                    type: "textField",
                    formItemProps:{
                      initialValue: "",
                      label : this.props.intl.formatMessage({id: 'general.company_name'}),
                      rules:[{ required: true, message: this.props.intl.formatMessage({id: 'carrier.signup.validation.enter_company'}) }],
                      labelCol: SignupFormItemlabelCol,
                      wrapperCol: SignupFormItemWrapperCol
                    },
                    fieldProps:{
                      placeholder: this.props.intl.formatMessage({id: 'carrier.signup.validation.enter_company'}),
                    },
                    wrapperCol: SignupWrapperCol
                  },
                  {
                    name: "company_address",
                    type: "addressField",
                    formItemProps:{
                      defaultValue: "",
                      hasFeedback: true,
                      // rules:[{ required: true, message: this.props.intl.formatMessage({id: 'carrier.signup.validation.enter_company_address'}) }],
                      label : this.props.intl.formatMessage({id: 'general.address'}),
                      labelCol: SignupFormItemlabelCol,
                      wrapperCol: SignupFormItemWrapperCol
                    },
                    fieldProps:{
                        placeholder: this.props.intl.formatMessage({id: 'general.address'}),
                        defaultValue: "",
                        onSelect: this.onAddressSelect,
                    },
                    wrapperCol: SignupWrapperCol
                  },
                  {
                    name: "carrier_authority",
                    type: "selectField",
                    formItemProps:{
                        hasFeedback: true,
                        rules:[{ required: true, message: this.props.intl.formatMessage({id: 'carrier.signup.validation.enter_company'}) }],
                        label : this.props.intl.formatMessage({id: 'carrier.signup.authority'}),
                        labelCol: SignupFormItemlabelCol,
                        wrapperCol: SignupFormItemWrapperCol
                    },
                    fieldProps:{
                      placeholder: this.props.intl.formatMessage({id: 'carrier.signup.authority'}),
                      options: this.state.AllCarrierAuthorities
                    },
                    wrapperCol: SignupWrapperCol
                  },
                  {
                    name: "authority_number",
                    type: "textField",
                    formItemProps:{
                      hasFeedback: true,
                      rules:[{ required: true, message: this.props.intl.formatMessage({id: 'carrier.signup.validation.enter_authority_number'}) }],
                      label : this.props.intl.formatMessage({id: 'carrier.signup.authority_number'}),
                      labelCol: SignupFormItemlabelCol,
                      wrapperCol: SignupFormItemWrapperCol
                    },
                    fieldProps:{
                      placeholder: this.props.intl.formatMessage({id: 'carrier.signup.authority_number'}),
                    },
                    wrapperCol: SignupWrapperCol
                  },
                  {
                    name: "company_phone_number",
                    type: "phoneField",
                    formItemProps:{
                      initialValue: "",
                      rules:[{required:true}],
                      label : this.props.intl.formatMessage({id:"general.phone_number"}),
                      labelCol: SignupFormItemlabelCol,
                      wrapperCol: SignupFormItemWrapperCol
                    },
                    fieldProps:{
                      placeholder: this.props.intl.formatMessage({id:"general.phone_number"}),
                    },
                    wrapperCol: SignupWrapperCol
                  },
                  {
                    name: "company_website",
                    type: "textField",
                    formItemProps:{
                      rules:[],
                      label : this.props.intl.formatMessage({id:'general.website'}),
                      labelCol: SignupFormItemlabelCol,
                      wrapperCol: SignupFormItemWrapperCol
                    },
                    fieldProps:{
                      placeholder: this.props.intl.formatMessage({id:'general.website'}),
                    },
                    wrapperCol: SignupWrapperCol
                  },
                ]
              }
            ]
          },
          {
          key: "signup_user",
          title: this.props.intl.formatMessage({id:"general.user_info"}),
          groups: [
            {
              name: "userInfo",
              wrapperCol: {...spans["full"]},
              groupWrapper:{
                type: "box",
                props: {size: "small"},
              },
              items: [
                {
                  name: "user_first_name",
                  type: "textField",
                  formItemProps:{
                    initialValue: "",
                    rules:[{ required: true, message: this.props.intl.formatMessage({id: 'carrier.signup.validation.enter_first_name'}) }],
                    label : this.props.intl.formatMessage({id: 'general.first_name'}),
                    labelCol: SignupFormItemlabelCol,
                    wrapperCol: SignupFormItemWrapperCol
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id: 'general.first_name'}),
                  },
                  wrapperCol: SignupWrapperCol
                },
                {
                  name: "user_last_name",
                  type: "textField",
                  formItemProps:{
                    initialValue: "",
                    rules:[{ required: true, message: this.props.intl.formatMessage({id: 'carrier.signup.validation.enter_last_name'}) }],
                    label : this.props.intl.formatMessage({id: 'general.last_name'}),
                    labelCol: SignupFormItemlabelCol,
                    wrapperCol: SignupFormItemWrapperCol
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id: 'general.last_name'}),
                  },
                  wrapperCol: SignupWrapperCol
                },
                {
                  name: "user_email",
                  type: "textField",
                  formItemProps:{
                    initialValue: "",
                    rules:[{ required: true, message: this.props.intl.formatMessage({id: 'carrier.signup.validation.enter_user_email'}) }],
                    label : this.props.intl.formatMessage({id: 'general.email'}),
                    labelCol: SignupFormItemlabelCol,
                    wrapperCol: SignupFormItemWrapperCol
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id: 'general.email'}),
                  },
                  wrapperCol: SignupWrapperCol
                },
                {
                  name: "user_phone",
                  type: "phoneField",
                  formItemProps:{
                    initialValue: "",
                    rules:[],
                    label : this.props.intl.formatMessage({id: 'general.phone_number'}),
                    labelCol: SignupFormItemlabelCol,
                    wrapperCol: SignupFormItemWrapperCol
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id: 'general.phone_number'}),
                  },
                  wrapperCol: SignupWrapperCol
                },
                // {
                //   name: "user_fax",
                //   type: "phoneField",
                //   formItemProps:{
                //     initialValue: "",
                //     rules:[],
                //     label : this.props.intl.formatMessage({id: 'general.fax_number'}),
                //     labelCol: SignupFormItemlabelCol,
                //     wrapperCol: SignupFormItemWrapperCol
                //   },
                //   fieldProps:{
                //     placeholder: this.props.intl.formatMessage({id: 'general.fax_number'}),
                //   },
                //   wrapperCol: SignupWrapperCol
                // },
                {
                  name: "user_password",
                  type: "passwordField",
                  formItemProps:{
                    initialValue: "",
                    rules:[{ required: true,  message: 'Please input your password!' }],
                    label : this.props.intl.formatMessage({id: 'general.password'}),
                    labelCol: SignupFormItemlabelCol,
                    wrapperCol: SignupFormItemWrapperCol
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id: 'general.password'}),
                  },
                  wrapperCol: SignupWrapperCol
                },
                {
                  name: "user_password_confirmation",
                  type: "passwordField",
                  formItemProps:{
                    initialValue: "",
                    rules:[{ required: true, message: this.props.intl.formatMessage({id: 'general.validation.enter_password_confirmation'}) }],
                    label : this.props.intl.formatMessage({id: 'general.confirm_password'}),
                    labelCol: SignupFormItemlabelCol,
                    wrapperCol: SignupFormItemWrapperCol
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id: 'general.confirm_password'}),
                  },
                  wrapperCol: SignupWrapperCol
                },
                {
                  name: "terms_conditions",
                  type: "Checkbox",
                  formItemProps:{
                      // rules:[{ required: true }],
                      label : this.props.intl.formatMessage({id:"page.signUpTermsConditions"}),
                      labelCol: SignupTermsAndConditionsItemLabelCol,
                      wrapperCol: SignupFormItemWrapperCol
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id:"page.signUpTermsConditions"}),
                  },
                  wrapperCol: SignupWrapperCol
                },
              ]
            }
          ]
        },
          // {
          //   key: "signup_billing",
          //   size: "full",
          //   title: this.props.intl.formatMessage({id:"billing.profile"}),
          //   groups: [
          //     {
          //       name: "BillingInfo",
          //       wrapperCol: {...spans["full"]},
          //       groupWrapper:{
          //         type: "box",
          //         props: {size: "small"},
          //       },
          //       items: [
          //         {
          //           name: "billing_business_name",
          //           type: "textField",
          //           formItemProps:{
          //             initialFormValue: "company_name",
          //             label : this.props.intl.formatMessage({id: 'general.business_name'}),
          //             rules:[{ required: true, message: this.props.intl.formatMessage({id: 'general.field_validation'}) }],
          //             labelCol: SignupFormItemlabelCol,
          //             wrapperCol: SignupFormItemWrapperCol
          //           },
          //           fieldProps:{
          //             placeholder: this.props.intl.formatMessage({id: 'carrier.signup.validation.enter_company'}),
          //           },
          //           wrapperCol: SignupWrapperCol
          //         },
          //         {
          //           name: "billing_address",
          //           type: "addressField",
          //           formItemProps:{
          //             initialFormValue: "company_address",
          //             rules:[{ required: true, message: this.props.intl.formatMessage({id: 'general.field_address_validation'})}],
          //             defaultValue: "",
          //             hasFeedback: true,
          //             label : this.props.intl.formatMessage({id: 'general.address'}),
          //             labelCol: SignupFormItemlabelCol,
          //             wrapperCol: SignupFormItemWrapperCol
          //           },
          //           fieldProps:{
          //             placeholder: this.props.intl.formatMessage({id: 'general.address'}),
          //             defaultValue: "",
          //             onSelect: this.onAddressSelect,
          //           },
          //           wrapperCol: SignupWrapperCol
          //         },
          //         {
          //           name: "billing_business_structure",
          //           type: "selectField",
          //           formItemProps:{
          //             rules:[{ required: true, message: this.props.intl.formatMessage({id: 'general.business_structure'})}],
          //             label : this.props.intl.formatMessage({id:"general.business_structure"}),
          //             labelCol: SignupFormItemlabelCol,
          //             wrapperCol: SignupFormItemWrapperCol
          //           },
          //           fieldProps:{
          //             placeholder: this.props.intl.formatMessage({id:"general.business_structure"}),
          //             options: BusinessStructuresOptions
          //           },
          //           wrapperCol: SignupWrapperCol
          //         },
          //         {
          //           name: "billing_currency",
          //           type: "selectField",
          //           formItemProps:{
          //             rules:[{ required: true, message: this.props.intl.formatMessage({id: 'currency.select.validation'})}],
          //             label : this.props.intl.formatMessage({id:"currency.title"}),
          //             labelCol: SignupFormItemlabelCol,
          //             wrapperCol: SignupFormItemWrapperCol
          //           },
          //           fieldProps:{
          //             placeholder: this.props.intl.formatMessage({id:"currency.title"}),
          //             options: CurrencyOptions
          //           },
          //           wrapperCol: SignupWrapperCol
          //         },
          //       ]
          //     },
          //   ]
          // },
          // {
          //   key: "contact_information",
          //   size: "full",
          //   title: this.props.intl.formatMessage({id:"general.contact_information"}),
          //   groups: [
          //     {
          //       name: "userProfile",
          //       wrapperCol: {...spans["full"]},
          //       groupWrapper:{
          //         type: "box",
          //         props: {size: "small"},
          //       },
          //       items: [
          //         {
          //           name: "billing_contact_first_name",
          //           type: "textField",
          //           formItemProps: {
          //             initialFormValue: "user_first_name",
          //             rules:[{ required: true}],
          //             label : this.props.intl.formatMessage({id:"general.first_name"}),
          //             labelCol: SignupFormItemlabelCol,
          //             wrapperCol: SignupFormItemWrapperCol
          //           },
          //           fieldProps: {
          //             placeholder: this.props.intl.formatMessage({id:"general.first_name.placeholder"}),
          //           },
          //           wrapperCol: SignupFormItemWrapperCol
          //         },
          //         {
          //           name: "billing_contact_last_name",
          //           type: "textField",
          //           formItemProps: {
          //             initialFormValue: "user_last_name",
          //             rules:[{ required: true}],
          //             label : this.props.intl.formatMessage({id:"general.last_name"}),
          //             labelCol: SignupFormItemlabelCol,
          //             wrapperCol: SignupFormItemWrapperCol
          //           },
          //           fieldProps: {
          //             placeholder: this.props.intl.formatMessage({id:"general.last_name.placeholder"}),
          //           },
          //           wrapperCol: SignupFormItemWrapperCol
          //         },
          //         {
          //           name: "billing_contact_phone_number",
          //           type: "phoneField",
          //           formItemProps:{
          //             initialFormValue: "user_phone",
          //             rules:[{ required: true }],
          //             label : this.props.intl.formatMessage({id:"general.phone_number"}),
          //             labelCol: SignupFormItemlabelCol,
          //             wrapperCol: SignupFormItemWrapperCol
          //           },
          //           fieldProps:{
          //             placeholder: this.props.intl.formatMessage({id:"general.phone_number"}),
          //           },
          //           wrapperCol: SignupFormItemWrapperCol
          //         },
          //         {
          //           name: "billing_contact_email",
          //           type: "textField",
          //           formItemProps:{
          //             initialFormValue: "user_email",
          //             rules:[{ type:"email", required: true}],
          //             label : this.props.intl.formatMessage({id:"general.email"}),
          //             labelCol: SignupFormItemlabelCol,
          //             wrapperCol: SignupFormItemWrapperCol
          //           },
          //           fieldProps:{
          //             placeholder: this.props.intl.formatMessage({id:"general.email"}),
          //           },
          //           wrapperCol: SignupFormItemWrapperCol
          //         },
          //       ]
          //     }
          //   ]
          // }
    ],
  }

  this.setState({formInputs: formInputs})

}

  render() {
    const app_link = { pathname: CARRIER_ROUTES.app };
    

    const {
      RedirectToDashboard,
      loading,
      formInputs
    } = this.state;


    if (loading){
      return <Loader />;
    }


    if (RedirectToDashboard) {

      return <Redirect to={app_link} />;
    }

    return (
      <BoxWrapper>
                {formInputs ?
                    <FormBox
                        title={"RegisterCarrier"}
                        formInputs={formInputs}
                        onSubmit={this.onSubmit}
                    />: ""}
            </BoxWrapper>
    )

  }
}

const mapStateToProps = state => {
  return 
}

const mapDispatchToProps = dispatch => {
  return {
    clearFirestore: () => dispatch({ type: '@@reduxFirestore/CLEAR_DATA' })
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firebaseConnect()
)(injectIntl(Signup))
