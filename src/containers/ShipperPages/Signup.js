import React, { Component } from "react";
import {Redirect} from "react-router-dom";
import {injectIntl} from "react-intl";
import { connect } from "react-redux";
import {compose} from "redux";
import {firebaseConnect} from "react-redux-firebase";
import {SHIPPING_ROUTES} from 'constants/routes'
import {formatPhone} from "helpers/data/format";
import Loader from "components/utility/loader";
import {spans} from "constants/layout/grids";
import {BoxWrapper} from "components/utility/box.style";
import FormBox from "../base/form_box";
import {notifyError, notifySuccess} from "components/notification";
import {registerAccount} from "helpers/firebase/firebase_functions/accounts";
import { SignupFormItemlabelCol, SignupFormItemWrapperCol, SignupWrapperCol, SignupTermsAndConditionsItemLabelCol } from "helpers/containers/properties/signup";


const INITIAL_STATE = {
  formInputs: undefined,
  CompanyAddress:'',
  error: null,
  RedirectToDashboard: false,
  loading: false
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

  setOptions = () => {
    this.setFormInputs()
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
      domain: 'shipping'
    }

    const company_data = {
      profile: {
        name: values.company_name,
        phone: formatPhone(values.company_phone_number, "E.164"),
        website: values.company_website,
        address: this.state.CompanyAddress,
      },
      domain: "shipping"
    }

    let registrationData = {user: user_data, company: company_data}

    return registerAccount(registrationData).then(res => {
      notifySuccess("notification.success.register_shipper", this.props.intl)
      this.onDone()
      this.loading(false)
      this.setState({RedirectToDashboard: true})
      }).catch(e => {
          notifyError("notification.fail.register_shipper", this.props.intl)
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

    const formInputs = {
        form_type: "multi_steps_tabs",
        submit_label: this.props.intl.formatMessage({id:"general.submit"}),
        formProps:{
          layout: "horizontal",
          initialValues: {hu_quantity: 1}
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
                      rules:[{ required: true, message: this.props.intl.formatMessage({id: 'shipper.signup.validation.enter_company'}) }],
                      label : this.props.intl.formatMessage({id: 'general.company_name'}),
                      labelCol: SignupFormItemlabelCol,
                      wrapperCol: SignupFormItemWrapperCol,
                    },
                    fieldProps:{
                      placeholder: this.props.intl.formatMessage({id: 'shipper.signup.validation.enter_company'}),
                    },
                    wrapperCol: SignupWrapperCol
                  },
                  {
                    name: "company_address",
                    type: "addressField",
                    formItemProps:{
                      defaultValue: "",
                      hasFeedback: true,
                      // rules:[{ required: true,  message: this.props.intl.formatMessage({id: 'shipper.signup.validation.enter_company_address'}) }],
                      label : this.props.intl.formatMessage({id: 'general.address'}),
                      labelCol: SignupFormItemlabelCol,
                      wrapperCol: SignupFormItemWrapperCol,
                    },
                    fieldProps:{
                        placeholder: this.props.intl.formatMessage({id: 'general.address'}),
                        defaultValue: "",
                        onSelect: this.onAddressSelect,
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
                      wrapperCol: SignupFormItemWrapperCol,
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
                      wrapperCol: SignupFormItemWrapperCol,
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
          title: this.props.intl.formatMessage({id:"general.administrator_account"}),
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
                    rules:[{ required: true, message: this.props.intl.formatMessage({id: 'shipper.signup.validation.enter_first_name'}) }],
                    label : this.props.intl.formatMessage({id: 'general.first_name'}),
                    labelCol: SignupFormItemlabelCol,
                    wrapperCol: SignupFormItemWrapperCol,
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
                    rules:[{ required: true, message: this.props.intl.formatMessage({id: 'shipper.signup.validation.enter_last_name'}) }],
  
                    label : this.props.intl.formatMessage({id: 'general.last_name'}),
                    labelCol: SignupFormItemlabelCol,
                    wrapperCol: SignupFormItemWrapperCol,
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
                    rules:[{ required: true, message: this.props.intl.formatMessage({id: 'shipper.signup.validation.enter_user_email'}) }],
                    label : this.props.intl.formatMessage({id: 'general.email'}),
                    labelCol: SignupFormItemlabelCol,
                    wrapperCol: SignupFormItemWrapperCol,
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
                    wrapperCol: SignupFormItemWrapperCol,
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id: 'general.phone_number'}),
                  },
                  wrapperCol: SignupWrapperCol
                },
                {
                  name: "user_fax",
                  type: "phoneField",
                  formItemProps:{
                    initialValue: "",
                    rules:[],
                    label : this.props.intl.formatMessage({id: 'general.fax_number'}),
                    labelCol: SignupFormItemlabelCol,
                    wrapperCol: SignupFormItemWrapperCol,
                  },
                  fieldProps:{
                    placeholder: this.props.intl.formatMessage({id: 'general.fax_number'}),
                  },
                  wrapperCol: SignupWrapperCol
                },
                {
                  name: "user_password",
                  type: "passwordField",
                  formItemProps:{
                    initialValue: "",
                    rules:[{ required: true, message: 'Please input your password!' }],
                    label : this.props.intl.formatMessage({id: 'general.password'}),
                    labelCol: SignupFormItemlabelCol,
                    wrapperCol: SignupFormItemWrapperCol,
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
                    wrapperCol: SignupFormItemWrapperCol,
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
                      wrapperCol: SignupFormItemWrapperCol,
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
    ],
  }

  this.setState({formInputs: formInputs})

}

  render() {
    const app_link = { pathname: SHIPPING_ROUTES.app };
    

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
                        title={"RegisterShipper"}
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
