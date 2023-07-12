import React, { Component } from "react";
import {Redirect} from "react-router-dom";
import {injectIntl} from "react-intl";
import { connect } from "react-redux";
import {compose} from "redux";
import {firebaseConnect} from "react-redux-firebase";
import {WEB_ROUTES} from 'constants/routes'
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

class VerifyEmail extends Component {

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
    this.loading(true)

    const user_data = {
      profile: {
        email: email,
        domain: "shipper"
      }
    }

    const verifyEmailData = {user: user_data}

    this.props.firebase.auth().checkActionCode(oobCode).then(res => {
      return verifyEmail(verifyEmailData).then(res => {
        notifySuccess("notification.success.password_reset", this.props.intl)
        this.onDone()
        this.loading(false)
        this.setState({RedirectToDashboard: true})
        }).catch(e => {
          notifyError("notification.fail.password_reset", this.props.intl)
          this.loading(false)
          console.log(e)
        })   
    }).catch(e => {
      notifyError("notification.fail.password_reset", this.props.intl)
      this.loading(false)
      console.log(e)
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
            key: "verify_email",
            size: "full",
			      title: this.props.intl.formatMessage({id:"general.verify_email"}),
          	},
      	],
    	}

    this.setState({formInputs: formInputs})
}

  render() {

    const app_link = { pathname: WEB_ROUTES.shipperSignin };
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');

    const {
      RedirectToDashboard,
      formInputs
    } = this.state;

    if (RedirectToDashboard) {

      return <Redirect to={app_link} />;
    }

    return (
      <BoxWrapper>
                <div> Email : {email} </div>
                {formInputs ?
                    <FormBox
                        title={"VerifyEmail"}
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
)(injectIntl(VerifyEmail))
