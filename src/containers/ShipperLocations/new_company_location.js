import React, { Component } from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import {injectIntl} from "react-intl";
import {PropTypes} from "prop-types";

import CompanyLocation from "model/location/company_location";
import {WEEK_DAYS, RELATIONSHIP_TYPE, COMPANY_LOCATION_TYPES, VISIBILITY_OPTIONS, CONTACT_TYPE} from "constants/options/location";

import {notifySuccess, notifyError} from "components/notification";
import {addCompanyLocation} from "helpers/firebase/firebase_functions/company_location";
import FormBox from "../base/form_box";
import {getCompanyName} from "helpers/containers/states/get_company_name"
import {getWeekAccess, getContactInformation} from "helpers/containers/states/location"
import {getSpan} from "constants/layout/grids";
import {optionObjectToOptionsLabelValue} from "helpers/data/mapper";


class NewCompanyLocation extends Component {

	static propTypes = {
		firebase: PropTypes.object,
	}

	constructor(props) {
		super(props);
		this.INITIAL_STATE = {
			loading: false,
			formInputs: undefined,
			DaysOptions: [],
			RelationshipTypeOptions: [],
			CategoryOptions: [],
			VisibilityOptions: [],
			ContactTypeOptions: [],
		}

		this.state = { ...this.INITIAL_STATE };
	}

	componentDidMount() {
		this.setOptions()
	}

	componentDidUpdate(prevProps) {
		if (this.props.firebase !== prevProps.firebase){
		}
	}

	setOptions = () => {
		this.setState({
		  DaysOptions: optionObjectToOptionsLabelValue(WEEK_DAYS, this.props.intl),
		  RelationshipTypeOptions: optionObjectToOptionsLabelValue(RELATIONSHIP_TYPE, this.props.intl),
		  CategoryOptions: optionObjectToOptionsLabelValue(COMPANY_LOCATION_TYPES, this.props.intl),
		  VisibilityOptions: optionObjectToOptionsLabelValue(VISIBILITY_OPTIONS, this.props.intl),
		  ContactTypeOptions: optionObjectToOptionsLabelValue(CONTACT_TYPE, this.props.intl),
		}, this.setFormInputs)
	  }

	handleReset = () => {
		this.setState = {...this.INITIAL_STATE};
	}

	onDone = () => {
		if (this.props.onDone){
			this.props.onDone()
		}
	}

	Loading = (loading) => {
		this.setState({loading: loading})
	}

	setFormInputs = () =>{

		const CompanyLocationInfoFormItemlabelCol = {
			xs: {span: 10},
			sm: {span: 8},
			md: {span: 6},
			lg: {span: 7},
		}
		
		const CompanyLocationInfoFormItemWrapperCol = {
			xs: {span: 4},
			sm: {span: 6},
			md: {span: 8},
			lg: {span: 16},
		}
		
		const CompanyLocationInfoWrapperCol = {
			xs: {span: 18},
			sm: {span: 16},
			md: {span: 14},
			lg: {span: 10},
		}

		const DaysFormItemLabelCol = {
			xs: {span: 13},
			sm: {span: 11},
			md: {span: 9},
			lg: {span: 4},
		}
	
		const DaysFormItemWrapperCol = {
			xs: {span: 10},
			sm: {span: 12},
			md: {span: 14},
			lg: {span: 20},
		}
	
		const DaysWrapperCol = {
			xs: {span: 22},
			sm: {span: 16},
			md: {span: 10},
			lg: {span: 20},
		}
		

		const { DaysOptions, RelationshipTypeOptions, CategoryOptions, VisibilityOptions, ContactTypeOptions } = this.state

		const formInputs = {
			form_type: "multi_steps_tabs",
			submit_label: this.props.intl.formatMessage({id:"general.submit"}),
			formProps:{
				layout: "horizontal"
			},
			sections: [
				{
					key: "new_company_location_info",
					size: "full",
					title: this.props.intl.formatMessage({id:"general.company_location"}),
					type: "noButtons",
					groups: [
						{
						  name: "new_company_location_info",
						  wrapperCol: {...getSpan(24)},
						  groupWrapper:{
							type: "box",
                			props: {size: "small"},
						  },
						  items: 
						  [
							  {
								  name: "profile_name",
								  type: "textField",
								  formItemProps:{
									  label : this.props.intl.formatMessage({id:"general.name"}),
									  labelCol: CompanyLocationInfoFormItemlabelCol,
									  wrapperCol: CompanyLocationInfoFormItemWrapperCol,
									  infoBubble: {
										  title: "Test",
										  content: "Name"
									  }
								  },
								  fieldProps:{
									  placeholder: this.props.intl.formatMessage({id:"general.name"}),
								  },
								  wrapperCol: CompanyLocationInfoWrapperCol
							  },
							  {
									name: "profile_address",
									type: "addressField",
									formItemProps:{
										// rules:[{ required: true }],
										label : this.props.intl.formatMessage({id:"general.address"}),
										labelCol: CompanyLocationInfoFormItemlabelCol,
										wrapperCol: CompanyLocationInfoFormItemWrapperCol
									},
									fieldProps:{
										placeholder: this.props.intl.formatMessage({id:"general.address"}),
									},
									wrapperCol: CompanyLocationInfoWrapperCol
		
								},
								{
									name: "code",
									type: "textField",
									formItemProps:{
										label : this.props.intl.formatMessage({id:"company_location.code"}),
										labelCol: CompanyLocationInfoFormItemlabelCol,
										wrapperCol: CompanyLocationInfoFormItemWrapperCol
									},
									fieldProps:{
										placeholder: this.props.intl.formatMessage({id:"company_location.code"}),
									},
									wrapperCol: CompanyLocationInfoWrapperCol
								},
								{
									name: "tags",
									type: "tagField",
									formItemProps:{
										label : this.props.intl.formatMessage({id: 'company_location.tags'}),
										labelCol: CompanyLocationInfoFormItemlabelCol,
										wrapperCol: CompanyLocationInfoFormItemWrapperCol
									},
									fieldProps:{
									  placeholder: this.props.intl.formatMessage({id: 'company_location.tags'}),
									  options: CategoryOptions,
									},
									wrapperCol: CompanyLocationInfoWrapperCol
								},
								{
									name: "relationship_type",
									type: "selectField",
									formItemProps:{
										label : this.props.intl.formatMessage({id:"general.relationship_type"}),
										labelCol: CompanyLocationInfoFormItemlabelCol,
										wrapperCol: CompanyLocationInfoFormItemWrapperCol
									},
									fieldProps:{
										placeholder: this.props.intl.formatMessage({id:"general.relationship_type"}),
										options: RelationshipTypeOptions
									},
									wrapperCol: CompanyLocationInfoWrapperCol
								},
								{
									name: "private_notes",
									type: "textField",
									formItemProps:{
										label : this.props.intl.formatMessage({id:"general.private_notes"}),
										labelCol: CompanyLocationInfoFormItemlabelCol,
										wrapperCol: CompanyLocationInfoFormItemWrapperCol
									},
									fieldProps:{
										placeholder: this.props.intl.formatMessage({id:"general.private_notes"}),
									},
									wrapperCol: CompanyLocationInfoWrapperCol
								},
								{
									name: "public_notes",
									type: "textField",
									formItemProps:{
										label : this.props.intl.formatMessage({id:"general.public_notes"}),
										labelCol: CompanyLocationInfoFormItemlabelCol,
										wrapperCol: CompanyLocationInfoFormItemWrapperCol
									},
									fieldProps:{
										placeholder: this.props.intl.formatMessage({id:"general.public_notes"}),
									},
									wrapperCol: CompanyLocationInfoWrapperCol
								},
								{
									name: "visibility",
									type: "radioGroupField",
									formItemProps: {
									  label : this.props.intl.formatMessage({id:"general.visibility"}),
									  labelCol: CompanyLocationInfoFormItemlabelCol,
									  wrapperCol: CompanyLocationInfoFormItemWrapperCol,
									  initialValue: "private"
									},
									fieldProps: {
									  placeholder: this.props.intl.formatMessage({id:"general.visibility"}),
									  options: VisibilityOptions,
									},
									wrapperCol: CompanyLocationInfoWrapperCol
								},
						  	]
						},
						{
							name: "week_access",
							mode: "multiple",
							wrapperCol: {...getSpan(24)},
							groupWrapper:{
							  type: "card",
							  props: {size: "small", title: this.props.intl.formatMessage({id:"company_location.week_access"})},
							},
							items: 
								[
								  {
									  name: "time",
									  type: "TimeRangePickerField",
									  formItemProps:{
										  label : this.props.intl.formatMessage({id:"company_location.access_time"}),
										  labelCol: CompanyLocationInfoFormItemlabelCol,
										  wrapperCol: CompanyLocationInfoFormItemWrapperCol
									  },
									  fieldProps:{
										  placeholder: this.props.intl.formatMessage({id:"company_location.access_time"}),
									  },
									  wrapperCol: CompanyLocationInfoWrapperCol
								  },
								  {
									  name: "days",
									  type: "CheckboxGroup",
									  formItemProps:{
										  label : this.props.intl.formatMessage({id:"general.days"}),
										  labelCol: DaysFormItemLabelCol,
										  wrapperCol: DaysFormItemWrapperCol
									  },
									  fieldProps:{
										  options: DaysOptions,
										  placeholder: this.props.intl.formatMessage({id:"general.days"}),
									  },
									  wrapperCol: DaysWrapperCol
								  },
								]
						  }
					]
				},
				{
					key: "contact_information",
					title: this.props.intl.formatMessage({id:"general.contact_information"}),
					type: "detail",
					groups: [
						{
							name: "contact_information",
							mode: "multiple",
							wrapperCol: {...getSpan(24)},
							groupWrapper:{
							  type: "card",
							  props: {size: "small", title: this.props.intl.formatMessage({id:"general.contact_information"})},
							},
							items: 
								[
									{
										name: "contact_type",
										type: "selectField",
										formItemProps:{
											label : this.props.intl.formatMessage({id:"general.type"}),
											labelCol: CompanyLocationInfoFormItemlabelCol,
											wrapperCol: CompanyLocationInfoFormItemWrapperCol
										},
										fieldProps:{
											placeholder: this.props.intl.formatMessage({id:"general.type"}),
											options: ContactTypeOptions,
											mode: "multiple",
										},
										wrapperCol: CompanyLocationInfoWrapperCol
									},
									{
										name: "contact_name",
										type: "textField",
										formItemProps:{
											label : this.props.intl.formatMessage({id:"general.name"}),
											labelCol: CompanyLocationInfoFormItemlabelCol,
											wrapperCol: CompanyLocationInfoFormItemWrapperCol
										},
										fieldProps:{
											placeholder: this.props.intl.formatMessage({id:"general.name"}),
										},
										wrapperCol: CompanyLocationInfoWrapperCol
									},
									{
										name: "contact_address",
										type: "addressField",
										formItemProps:{
											// rules:[{ required: true }],
											label : this.props.intl.formatMessage({id:"general.address"}),
											labelCol: CompanyLocationInfoFormItemlabelCol,
											wrapperCol: CompanyLocationInfoFormItemWrapperCol
										},
										fieldProps:{
											placeholder: this.props.intl.formatMessage({id:"general.address"}),
										},
										wrapperCol: CompanyLocationInfoWrapperCol
									},
									{
										name: "contact_phone",
										type: "phoneField",
										formItemProps:{
											label : this.props.intl.formatMessage({id:"general.phone_number"}),
											labelCol: CompanyLocationInfoFormItemlabelCol,
											wrapperCol: CompanyLocationInfoFormItemWrapperCol
										},
										fieldProps:{
											placeholder: this.props.intl.formatMessage({id:"general.phone_number"}),
										},
										wrapperCol: CompanyLocationInfoWrapperCol
									},
									{
										name: "contact_email",
										type: "textField",
										formItemProps:{
											label : this.props.intl.formatMessage({id:"general.email"}),
											labelCol: CompanyLocationInfoFormItemlabelCol,
											wrapperCol: CompanyLocationInfoFormItemWrapperCol
										},
										fieldProps:{
											placeholder: this.props.intl.formatMessage({id:"general.email"}),
										},
										wrapperCol: CompanyLocationInfoWrapperCol
									},
								]
						  },
					]
				},
			]
		}

		this.setState({formInputs: formInputs})

	}
	
	onSubmit = (values) => {
		const itemSetsFields = values.itemSetsFields

		const profile = { 
							name: values.profile_name, 
							address: values.profile_address,
							code: values.code,
							tags: values.tags,
							private_notes: values.private_notes,
							public_notes: values.public_notes,
							contact_information: getContactInformation(values, itemSetsFields)
						}

		const CompanyLocationData = {	
								account: {
									id: this.props.companyId,
								},
								visibility: values.visibility,
								profile: profile,
								relationship_type: values.relationship_type,
								saved: true,
								week_access: getWeekAccess(values, itemSetsFields),
							 }	

		const newCompanyLocation = new CompanyLocation(undefined, CompanyLocationData)
    	this.Loading(true)
		return addCompanyLocation(newCompanyLocation).then(res => {
			notifySuccess("notification.success.new_company_location", this.props.intl)
			this.onDone()
			this.Loading(false)
		}).catch(e => {
			notifyError("notification.fail.new_company_location", this.props.intl)
			this.Loading(false)
		})
	}

	render() {
		const {formInputs} = this.state;

		if (formInputs){
			return (
				<FormBox
					title={this.props.intl.formatMessage({id: 'general.actions.find_company_locations'})}
					formInputs={formInputs}
					onSubmit={this.onSubmit}
				/>
			)
		}else{
			return ("")
		}

	}
}

const mapStateToProps = state => {
	return {
		firebase: state.FB.firebase,
		companyId: state.FB.company.companyId
	}
}

NewCompanyLocation.contextTypes = {
	intl: PropTypes.object.isRequired,
};

export default compose(
	connect(mapStateToProps, {}),
	firebaseConnect()
)(injectIntl(NewCompanyLocation))