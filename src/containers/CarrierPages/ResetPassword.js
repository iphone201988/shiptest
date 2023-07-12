import React, { Component } from "react";
import {Redirect} from "react-router-dom";
import {injectIntl} from "react-intl";
import { connect } from "react-redux";
import {compose} from "redux";
import {firebaseConnect} from "react-redux-firebase";
import {WEB_ROUTES} from 'constants/routes'
import Loader from "components/utility/loader";
import {BoxWrapper} from "components/utility/box.style";
import FormBox from "../base/form_box";
import {notifyError, notifySuccess} from "components/notification";
import {verifyEmail} from "helpers/firebase/firebase_functions/users";



const INITIAL_STATE = {
  error: null,
  RedirectToDashboard: false,
  loading: false,
  formInputs: undefined
};

class ResetPassword extends Component {

  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    this.setFormInputs()
  }

  componentDidUpdate(nextProps) {
    if (
      this.props.isLoggedIn !== nextProps.isLoggedIn &&
      nextProps.isLoggedIn === true
    ) {
      this.setState({ redirectToReferrer: true });
    }
  }

  onSubmit = (values) => {
    
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const oobCode = urlParams.get('oobCode');
    const newPassword = values.user_password

    this.loading(true)
    const user_data = {
      profile: {
        email: email,
        password: newPassword,
      }
    }

    const registrationData = {user: user_data}

    this.props.firebase.auth().verifyPasswordResetCode(oobCode).then(res => {
      this.props.firebase.auth().confirmPasswordReset(oobCode, newPassword)
      return verifyEmail(registrationData).then(res => {
        notifySuccess("notification.success.password_reset", this.props.intl)
        this.onDone()
        this.loading(false)
        this.setState({RedirectToDashboard: true})
        }).catch(e => {
          notifyError("notification.fail.password_reset", this.props.intl)
          this.loading(false)
          console.log(e)
        })   
    })
    .catch(err => {
      notifyError("notification.code_invalid", this.props.intl)
      this.loading(false)
      console.log(err)
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

  setFormInputs = () =>{

    const formInputs = {
        form_type: "regular",
        submit_label: this.props.intl.formatMessage({id:"general.submit"}),
        formProps:{
          layout: "horizontal",
        },
        sections: [
          	{
            key: "reset_password",
            size: "full",
			title: this.props.intl.formatMessage({id:"general.company"}),
          items: [
              {
                name: "user_password",
                type: "passwordField",
                formItemProps:{
                  initialValue: "",
                  rules:[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                  ],
                  label : this.props.intl.formatMessage({id: 'general.password'}),
                  labelCol: {
                  span: 3
                  },
                  wrapperCol: {
                  span: 22
                  },
                },
                fieldProps:{
                  placeholder: this.props.intl.formatMessage({id: 'general.password'}),
                },
              },
              {
              name: "user_password_confirmation",
              type: "passwordField",
              formItemProps:{
                initialValue: "",
                rules:[
                  {
                    required: true,
                    message: this.props.intl.formatMessage({id: 'general.validation.enter_password_confirmation'}),
                  },
                  ],
                  label : this.props.intl.formatMessage({id: 'general.confirm_password'}),
                  labelCol: {
                  span: 3
                  },
                  wrapperCol: {
                  span: 22
                  },
              },
                fieldProps:{
                  placeholder: this.props.intl.formatMessage({id: 'general.confirm_password'}),
                },
              },
            ]
        	},
    	],
  	}

    this.setState({formInputs: formInputs})
}

  render() {

    const app_link = { pathname: WEB_ROUTES.carrierSignin };
    

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
                        title={"ResetPassword"}
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
)(injectIntl(ResetPassword))
