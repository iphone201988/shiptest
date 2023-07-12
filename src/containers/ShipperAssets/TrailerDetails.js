import React from "react";
import {injectIntl, intlShape} from "react-intl";
import {TRAILER_TYPES, VEHICLE_MAKES} from "constants/options/vehicles";
import {COLORS} from "constants/options/general";
import Trailer from "model/asset/trailer";
import {getSpan} from "constants/layout/grids";
import FormBox from "containers/base/form_box";
import {optionObjectToOptionsLabelValue} from "helpers/data/mapper";
import {updateAssetProfile} from "helpers/firebase/firebase_functions/assets";
import {notifyError, notifySuccess} from "components/notification";



class TrailerDetails extends React.Component {

	constructor(props){
		const INITIAL_QUOTE = {
			trailer: props.trailer || null,
			formInputs: undefined
		}

		super(props);
		this.state = { 
			...INITIAL_QUOTE,
			TrailerTypesOptions: []
		};
	}

	componentDidMount() {
		if (this.props.trailer instanceof Trailer ){
			this.setState({trailer: this.props.trailer}, this.setOptions)
		}

	}

	componentDidUpdate(prevProps) {

		if ((this.props.trailer instanceof Trailer ) && (prevProps.trailer !== this.props.trailer)) {
			this.setState({trailer: this.props.trailer}, this.setOptions)
		}
	}

	KeyValListToOptions = (KeyValList) => {
		return KeyValList.map(kv => {return {label: this.props.intl.formatMessage({id: kv.value.name}),value: kv.key}})
	}
	
	setOptions = () => {
		this.setState({
			VehicleMakesOptions: optionObjectToOptionsLabelValue(VEHICLE_MAKES, this.props.intl),
			TrailerTypesOptions: optionObjectToOptionsLabelValue(TRAILER_TYPES, this.props.intl),
			ColorsOptions: optionObjectToOptionsLabelValue(COLORS, this.props.intl)
		}, this.setFormInputs)
	}

	onSubmit = (values) =>{

		let { trailer_name, trailer_vin, trailer_color, trailer_license_plate_number, trailer_make, trailer_model, trailer_year, trailer_class } = values
		
		const newTrailerProfile = {
			...this.state.trailer.profile,
			name: trailer_name,
			vin: trailer_vin,
			color: trailer_color,
			license_plate_number: trailer_license_plate_number,
			make: trailer_make,
			model: trailer_model,
			year: trailer_year,
			class: trailer_class,
		}

		const updateTrailerData = {
			assetId: this.state.trailer.id,
			profile: newTrailerProfile
		}

		return updateAssetProfile(updateTrailerData).then(res => {
			notifySuccess("notification.success.update_asset", this.props.intl)
			this.onCloseDetail()
			}).catch(e => {
				notifyError("notification.fail.update_asset", this.props.intl)
			})

	};

	setFormInputs = () =>{

		const { trailer, TrailerTypesOptions, ColorsOptions, VehicleMakesOptions } =  this.state
		const profile = trailer.profile

		const AssetDetailFormItemLabelCol = {
		xs: {span: 13},
		sm: {span: 11},
		md: {span: 9},
		lg: {span: 7},
	}
	
		const AssetDetailFormItemWrapperCol = {
		xs: {span: 10},
		sm: {span: 12},
		md: {span: 14},
		lg: {span: 16},
	}
	
		const AssetDetailWrapperCol = {
		xs: {span: 22},
		sm: {span: 16},
		md: {span: 10},
		lg: {span: 10},
	}
	
		
		const formInputs = {
			form_type: "regular",
			submit_label: this.props.intl.formatMessage({id:"general.update"}),
			formProps:{
				layout: "horizontal",
			},
	
			sections: [
				{
				key: "asset_detail",
				title: this.props.intl.formatMessage({id:"general.asset_detail"}),
				type: "detail",
				groups: [
					{
					name: "asset_detail",
					wrapperCol: {...getSpan(24)},
					groupWrapper:{
						type: "box",
					},
					items: [
								{
								  name: "trailer_name",
								  type: "textField",
								  formItemProps:{
									  label : this.props.intl.formatMessage({id:"general.name"}),
									  labelCol: AssetDetailFormItemLabelCol,
									  wrapperCol: AssetDetailFormItemWrapperCol,
									  initialValue: profile.name
								  },
								  fieldProps:{
								  },
								  wrapperCol: AssetDetailWrapperCol
								},
								{
								  name: "trailer_vin",
								  type: "textField",
								  formItemProps:{
									  label : this.props.intl.formatMessage({id:"carrier.trailer.vin"}),
									  labelCol: AssetDetailFormItemLabelCol,
									  wrapperCol: AssetDetailFormItemWrapperCol,
									  initialValue: profile.vin
								  },
								  fieldProps:{
								  },
								  wrapperCol: AssetDetailWrapperCol
								},
								{
									name: "trailer_color",
									type: "selectField",
									formItemProps:{
										label : this.props.intl.formatMessage({id:"general.color"}),
										labelCol: AssetDetailFormItemLabelCol,
										wrapperCol: AssetDetailFormItemWrapperCol,
										initialValue: profile.color
									},
									fieldProps:{
										options: ColorsOptions
									},
									wrapperCol: AssetDetailWrapperCol
								},
								{
									name: "trailer_license_plate_number",
									type: "textField",
									formItemProps:{
										label : this.props.intl.formatMessage({id:"carrier.vehicle.license_plate"}),
										labelCol: AssetDetailFormItemLabelCol,
										wrapperCol: AssetDetailFormItemWrapperCol,
										initialValue: profile.license_plate_number
									},
									fieldProps:{
									},
									wrapperCol: AssetDetailWrapperCol
								},
								{
									name: "trailer_make",
									type: "selectField",
									formItemProps:{
										label : this.props.intl.formatMessage({id:"carrier.trailer.make"}),
										labelCol: AssetDetailFormItemLabelCol,
										wrapperCol: AssetDetailFormItemWrapperCol,
										initialValue: profile.make
									},
									fieldProps:{
										options: VehicleMakesOptions
									},
									wrapperCol: AssetDetailWrapperCol
								},
								{
									name: "trailer_model",
									type: "textField",
									formItemProps:{
										label : this.props.intl.formatMessage({id:"carrier.trailer.model"}),
										labelCol: AssetDetailFormItemLabelCol,
										wrapperCol: AssetDetailFormItemWrapperCol,
										initialValue: profile.model
									},
									fieldProps:{
									},
									wrapperCol: AssetDetailWrapperCol
								},
								{
									name: "trailer_year",
									type: "textField",
									formItemProps:{
										label : this.props.intl.formatMessage({id:"general.year"}),
										labelCol: AssetDetailFormItemLabelCol,
										wrapperCol: AssetDetailFormItemWrapperCol,
										initialValue: profile.year
									},
									fieldProps:{
									},
									wrapperCol: AssetDetailWrapperCol
								},
								{
									name: "trailer_type",
									type: "selectField",
									formItemProps:{
										label : this.props.intl.formatMessage({id:"carrier.trailer.type"}),
										labelCol: AssetDetailFormItemLabelCol,
										wrapperCol: AssetDetailFormItemWrapperCol,
										initialValue: profile.trailer_type
									},
									fieldProps:{
										options:TrailerTypesOptions
									},
									wrapperCol: AssetDetailWrapperCol
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

		const { formInputs} = this.state

		return (
			<div>
			{formInputs ?
				<FormBox
					title={"TrailerDetails"}
					formInputs={formInputs}
					onSubmit={this.onSubmit}
					onCloseDetail={this.onCloseDetail}
				/>: ""}
			</div>
			
		)
	}
}

TrailerDetails.propTypes = {
	intl: intlShape.isRequired
}

export default injectIntl(TrailerDetails)