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
import {forgotUserPassword} from "helpers/firebase/firebase_functions/users";


const INITIAL_STATE = {
  error: null,
  RedirectToDashboard: false,
  loading: false,
  formInputs: undefined
};

class ForgotPassword extends Component {

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
    
    this.loading(true)
    const user_data = {
      profile: {
        email: values.user_email,
      },
      domain: "shipper",
    }

    const forgotPasswordData = {user: user_data}

    return forgotUserPassword(forgotPasswordData).then(res => {
      notifySuccess("notification.success.forgot_password", this.props.intl)
      this.onDone()
      this.loading(false)
      this.setState({RedirectToDashboard: true})
      }).catch(e => {
          notifyError("notification.fail.forgot_password", this.props.intl)
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

  setFormInputs = () =>{

    const formInputs = {
        form_type: "regular",
        submit_label: this.props.intl.formatMessage({id:"general.submit"}),
        formProps:{
          layout: "horizontal",
        },
        sections: [
          	{
            key: "forgot_password",
            size: "full",
			      title: this.props.intl.formatMessage({id:"general.forgot_password"}),
          items: [
            {
              name: "user_email",
              type: "textField",
              formItemProps:{
                initialValue: "",
                rules:[
                  {
                    required: true,
                    message: this.props.intl.formatMessage({id: 'carrier.signup.validation.enter_user_email'}),
                  },
                ],

                label : this.props.intl.formatMessage({id: 'general.email'}),
                labelCol: {
                  span: 3
                },
                wrapperCol: {
                  span: 22
                },
              },
              fieldProps:{
                placeholder: this.props.intl.formatMessage({id: 'general.email'}),
              },
            },
              
            ]
        	},
    	],
  	}

    this.setState({formInputs: formInputs})
}

  render() {

    const app_link = { pathname: WEB_ROUTES.shipperSignin };
    

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
                        title={"ForgotPassword"}
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
)(injectIntl(ForgotPassword))
