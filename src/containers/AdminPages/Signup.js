import React, { Component } from "react";
import {Redirect} from "react-router-dom";
import {injectIntl} from "react-intl";
import { connect } from "react-redux";
import {compose} from "redux";
import {firebaseConnect} from "react-redux-firebase";
import {ADMIN_ROUTES} from 'constants/routes'
import {formatPhone} from "helpers/data/format";
import Loader from "components/utility/loader";
import {spans} from "constants/layout/grids";
import {BoxWrapper} from "components/utility/box.style";
import FormBox from "../base/form_box";
import {notifyError, notifySuccess} from "components/notification";
import {addAdminUser} from "helpers/firebase/firebase_functions/users";
import User from "model/user/user";
import { SignupFormItemlabelCol, SignupFormItemWrapperCol, SignupWrapperCol, SignupTermsAndConditionsItemLabelCol } from "helpers/containers/properties/signup";

const INITIAL_STATE = {
  CompanyAddress:'',
  error: null,
  RedirectToDashboard: false,
  loading: false,
  formInputs: undefined
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
        fax: values.user_fax,
      },
      domain: "admin"
    }

    const user = new User(undefined, user_data)
    console.log(user)

    return addAdminUser(user).then(res => {
      notifySuccess("notification.success.register_admin", this.props.intl)
      this.onDone()
      this.loading(false)
      this.setState({RedirectToDashboard: true})
      }).catch(e => {
          notifyError("notification.fail.register_admin", this.props.intl)
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
          key: "signup_user",
          title: this.props.intl.formatMessage({id:"general.user_info"}),
          groups: [
            {
              name: "userInfo",
              wrapperCol:{...spans["full"]},
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
                    rules:[{ required: true, message: this.props.intl.formatMessage({id: 'admin.signup.validation.enter_first_name'}) }],
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
                    rules:[{ required: true, message: this.props.intl.formatMessage({id: 'admin.signup.validation.enter_last_name'}) }],
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
                    rules:[{ required: true, message: this.props.intl.formatMessage({id: 'admin.signup.validation.enter_user_email'}) }],
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
                {
                  name: "user_fax",
                  type: "phoneField",
                  formItemProps:{
                    initialValue: "",
                    rules:[],
                    label : this.props.intl.formatMessage({id: 'general.fax_number'}),
                    labelCol: SignupFormItemlabelCol,
                    wrapperCol: SignupFormItemWrapperCol
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
    ],
  }

  this.setState({formInputs: formInputs})

}

  render() {
    const app_link = { pathname: ADMIN_ROUTES.app };
    

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
                        title={"RegisterAdmin"}
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
