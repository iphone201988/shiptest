import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from 'redux'
import { firebaseConnect } from 'react-redux-firebase'

import {PropTypes} from "prop-types";
import {injectIntl, intlShape} from "react-intl";

import * as _ from "helpers/data/underscore";
import {BoxWrapper} from "components/utility/box.style";
import FormBox from "../base/form_box"; // Keep this to format Cleave Phone input

const INITIAL_STATE = {
	formInputs: undefined,
	shipperUser: null,
	FirstName: '',
	LastName: '',
	Phone: '',
	Email: '',
	FormReady: false,
	Loading: false,
};

class UserProfile extends Component {

	static propTypes = {
		shipperUser:PropTypes.object,
	}

	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
	}

	componentDidMount(){
		if (this.props.shipperUser){
			this.setOptions()
		}
	}

	componentDidUpdate(prevProps) {
		if (!_.isEqual(this.props.shipperUser, prevProps.shipperUser)) {
			this.setOptions()
		}
	}

	setOptions = () => {
		this.setState({ shipperUser: this.props.shipperUser }, this.setFormInputs)
	}

	onSubmit = (values) =>{

		let { first_name, last_name, email, user_phone } = values
		
		const newUserProfile = {
			...this.state.shipperUser.profile,
			first_name: first_name,
			last_name: last_name,
			email: email,
			phone: user_phone,
		}

		console.log(newUserProfile)
		// return updateUserProfile(newUserProfile).then(res => {
		// 	notifySuccess("notification.success.update_userProfile", this.props.intl)
		// 	this.onDone()
		// 	this.loading(false)
		// 	this.setState({RedirectToDashboard: true})
		// 	}).catch(e => {
		// 		notifyError("notification.fail.update_userProfile", this.props.intl)
		// 		this.loading(false)
		// 	})
	};

	setFormInputs = () => {
		const shipperUser = this.state.shipperUser || {}
		const user_profile = shipperUser.profile || {}

		const formInputs = {
			form_type: "regular",
			submit_label: this.props.intl.formatMessage({id:"general.update"}),
			formProps:{
				layout: "horizontal",
			},
			sections: [
				{
					key: "user_profile",
					size: "full",
					type: "onlySubmit",
					items: [
						{
							name: "first_name",
							type: "textField",
							formItemProps:{
								initialValue: user_profile.first_name,
								rules:[
									{
										required: true,
										message: this.props.intl.formatMessage({id: 'general.validation.enter_first_name'}),
									}
								],
								label : this.props.intl.formatMessage({id:"general.first_name"}),
								labelCol: {
									span: 3
								},
								wrapperCol: {
									span: 20
								},
							},
							fieldProps:{
								placeholder: this.props.intl.formatMessage({id:"general.first_name"}),
							},
						},
						{
							name: "last_name",
							type: "textField",
							formItemProps:{
								initialValue: user_profile.last_name,
								rules:[
									{
										required: true,
										message: this.props.intl.formatMessage({id: 'general.validation.enter_last_name'}),
									}
								],
								label : this.props.intl.formatMessage({id:"general.last_name"}),
								labelCol: {
									span: 3
								},
								wrapperCol: {
									span: 20
								},
							},
							fieldProps:{
								placeholder: this.props.intl.formatMessage({id:"general.last_name"}),
							},
						},
						{
							name: "email",
							type: "textField",
							formItemProps:{
								initialValue: user_profile.email,
								rules:[
									{
										required: true,
										type: 'email',
										message: this.props.intl.formatMessage({id: 'general.validation.enter_user_email'}),
									}
								],
								label : this.props.intl.formatMessage({id:"general.email"}),
								labelCol: {
									span: 3
								},
								wrapperCol: {
									span: 20
								},
							},
							fieldProps:{
								placeholder: this.props.intl.formatMessage({id:"general.email"}),
							},
						},
						{
							name: "user_phone",
							type: "textField",
							formItemProps:{
								initialValue: user_profile.phone,
								rules:[
									{
										required: false,
										message: this.props.intl.formatMessage({id: 'general.validation.enter_user_phone_number'}),
									}
								],
								label : this.props.intl.formatMessage({id:"general.phone_number"}),
								labelCol: {
									span: 3
								},
								wrapperCol: {
									span: 20
								},
							},
							fieldProps:{
								placeholder: this.props.intl.formatMessage({id:"general.phone_number"}),
							},
						},
					]
				}
			]
		}
		this.setState({formInputs: formInputs})
	}

	render() {

		const {formInputs} =  this.state

		return (
			<BoxWrapper>
				{formInputs ?
					<FormBox
						title={this.props.intl.formatMessage({id:'user'})}
						formInputs={formInputs}
						onSubmit={this.onSubmit}
					/> : ""}
			</BoxWrapper>
		)
	}
}

UserProfile.propTypes = {
	intl: intlShape.isRequired
}

const mapStateToProps = state => {
	return {
		shipperUser: state.FB.companyUser.user,
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
)(injectIntl(UserProfile))

