import React from "react";
import {injectIntl, intlShape} from "react-intl";
import User from "model/user/shipper_user";
import {getSpan} from "constants/layout/grids";
import FormBox from "containers/base/form_box";
import {objectToKeyValList} from 'helpers/data/mapper'
import {ROLES} from "constants/options/user";
import {notifyError, notifySuccess} from "components/notification";
import {updateUser} from "helpers/firebase/firebase_functions/users";
import { RadioGroup, RadioButton } from "components/uielements/radio";
import IntlMessages from "components/utility/intlMessages";
import Card from "containers/Uielements/Card/card.style";
import Box from "components/utility/box";
import UserResourcesView from "./UserResourcesView"
import {roleTypeToRoleObject} from "../../helpers/data/mappers/user_roles";

const RolesKeyVal = objectToKeyValList(ROLES)

class UserDetails extends React.Component {

	constructor(props){
		const INITIAL_QUOTE = {
			user: props.user || null,
			detailsView: undefined,
			formInputs: undefined
		}

		super(props);
		this.state = { 
			...INITIAL_QUOTE,
			RolesOptions: []
		};
	}

	componentDidMount() {
		this.setOptions()
	}

	componentDidUpdate(prevProps) {

		if ((this.props.user instanceof User ) && (prevProps.user !== this.props.user)) {
			this.setState({user: this.props.user}, this.setOptions)
		}
	}

	KeyValListToOptions = (KeyValList) => {
		return KeyValList.map(kv => {return {label: this.props.intl.formatMessage({id: kv.value.name}),value: kv.key}})
	}
	
	setOptions = () => {
		this.setState({
			RolesOptions: this.KeyValListToOptions(RolesKeyVal), detailsView: this.props.itemTabKey,
		}, this.setFormInputs)
	}

	onSubmit = (values) =>{

		let { first_name, last_name, email, user_roles_types } = values

		const updateUserData = {
			userId: this.state.user.id,
			profile: {
				...this.state.user.profile,
				first_name: first_name,
				last_name: last_name,
				email: email,
			}
		}

		if (user_roles_types.length > 0){
			const roles = user_roles_types.map(roleType => roleTypeToRoleObject(roleType))
			updateUserData.roles = roles
			updateUserData.role_types = user_roles_types
		}
		
		return updateUser(updateUserData).then(res => {
			notifySuccess("notification.success.update_user", this.props.intl)
			this.onCloseDetail()
			}).catch(e => {
				notifyError("notification.fail.update_user", this.props.intl)
			})
	};

	setFormInputs = () =>{

		const { user, RolesOptions } =  this.state
		const profile = user.profile

		const UserDetailFormItemLabelCol = {
			xs: {span: 13},
			sm: {span: 11},
			md: {span: 9},
			lg: {span: 6},
		}
	
		const UserDetailFormItemWrapperCol = {
			xs: {span: 10},
			sm: {span: 12},
			md: {span: 14},
			lg: {span: 15},
		}
	
		const UserDetailWrapperCol = {
			xs: {span: 22},
			sm: {span: 16},
			md: {span: 14},
			lg: {span: 10},
		}

		const UserDetailRolesWrapperCol = {
			xs: {span: 22},
			sm: {span: 16},
			md: {span: 14},
			lg: {span: 12},
		}

		const UserDetailRolesLabelCol = {
			xs: {span: 22},
			sm: {span: 16},
			md: {span: 14},
			lg: {span: 4},
		}
	
		
		const formInputs = {
			form_type: "regular",
			submit_label: this.props.intl.formatMessage({id:"general.update"}),
			formProps:{
				layout: "horizontal",
			},
	
			sections: [
				{
				key: "user_detail",
				title: this.props.intl.formatMessage({id:"general.User_detail"}),
				type: "detail",
				groups: [
					{
					name: "user_detail",
					wrapperCol: {...getSpan(24)},
					groupWrapper:{
						type: "box",
					},
					items: [
								{
								  name: "first_name",
								  type: "textField",
								  formItemProps:{
									  label : this.props.intl.formatMessage({id:"general.first_name"}),
									  labelCol: UserDetailFormItemLabelCol,
									  wrapperCol: UserDetailFormItemWrapperCol,
									  initialValue: profile.first_name,
								  },
								  fieldProps:{
								  },
								  wrapperCol: UserDetailWrapperCol
								},
								{
								  name: "last_name",
								  type: "textField",
								  formItemProps:{
									  label : this.props.intl.formatMessage({id:"general.last_name"}),
									  labelCol: UserDetailFormItemLabelCol,
									  wrapperCol: UserDetailFormItemWrapperCol,
									  initialValue: profile.last_name
								  },
								  fieldProps:{
								  },
								  wrapperCol: UserDetailWrapperCol
								},
								{
									name: "email",
									type: "textField",
									formItemProps:{
										label : this.props.intl.formatMessage({id:"general.email"}),
										labelCol: UserDetailFormItemLabelCol,
										wrapperCol: UserDetailFormItemWrapperCol,
										initialValue: profile.email
									},
									fieldProps:{
										disabled: true
									},
									wrapperCol: UserDetailWrapperCol
								},
								{
									name: "user_roles_types",
									type: "CheckboxGroup",
									formItemProps:{
										label : this.props.intl.formatMessage({id:"general.roles"}),
										labelCol: UserDetailRolesLabelCol,
										wrapperCol: UserDetailFormItemWrapperCol,
										initialValue: user.role_types
									},
									fieldProps:{
										options: RolesOptions,
									},
									wrapperCol: UserDetailRolesWrapperCol
								},
							]
						}
					]
				}
			]
		}
		this.setState({formInputs: formInputs})
	}

	onCloseDetail = () => {
		this.props.onCloseDetail()
	}

	render() {

		let { user, detailsView, formInputs } = this.state

		if (user === null){
			return (<div></div>)
		}

		return (
			<div>
				<Box>
					<RadioGroup
						buttonStyle="solid"
						id="ShipperUserDetails"
						name="ShipperUserDetails"
						value={detailsView}
						onChange={event => {
							this.setState({detailsView: event.target.value})
						}}
					>
						<RadioButton value="details"><IntlMessages id="user.details.title"/></RadioButton>
						<RadioButton value="resources"><IntlMessages id="general.shipment_transport_resources"/></RadioButton>
					</RadioGroup>
					{	detailsView === "details"
						?
					<>
						{formInputs ?
						<FormBox
							title={"UserDetails"}
							formInputs={formInputs}
							onSubmit={this.onSubmit}
							onCloseDetail={this.onCloseDetail}
						/>: ""}
					</>
						:<Card>
							<UserResourcesView
								user={user}
								onCloseDetail={this.onCloseDetail}
								/>
						</Card>
					}
				</Box>
			</div>
		)
	}
}

UserDetails.propTypes = {
	intl: intlShape.isRequired
}

export default injectIntl(UserDetails)
