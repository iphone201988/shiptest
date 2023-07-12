import React from "react";
import {injectIntl, intlShape} from "react-intl";
import {TRUCK_CLASSES, VEHICLE_MAKES, FUEL_TYPES} from "constants/options/vehicles";
import {COLORS} from "constants/options/general";
import Vehicle from "model/asset/vehicle";
import {getSpan} from "constants/layout/grids";
import FormBox from "containers/base/form_box";
import {optionObjectToOptionsLabelValue} from "helpers/data/mapper";
import {updateAssetProfile} from "helpers/firebase/firebase_functions/assets";
import {notifyError, notifySuccess} from "components/notification";


class VehicleDetails extends React.Component {

	constructor(props){
		const INITIAL_QUOTE = {
			vehicle: props.vehicle || null,
		}

		super(props);
		this.state = { 
			...INITIAL_QUOTE,
			TruckClassesOptions: [],
			VehicleMakesOptions: [],
			FuelTypeOptions: [],
			ColorsOptions: []
		};
	}

	componentDidMount() {
		if (this.props.vehicle) {
			this.setState({vehicle: this.props.vehicle}, this.setOptions);
		}
	}

	componentDidUpdate(prevProps) {
		if ((this.props.vehicle instanceof Vehicle ) && (prevProps.vehicle !== this.props.vehicle)) {
			this.setState({vehicle: this.props.vehicle}, this.setOptions);
		}
	}

	KeyValListToOptions = (KeyValList) => {
		return KeyValList.map(kv => {return {label: this.props.intl.formatMessage({id: kv.value.name}),value: kv.key}})
	}
	
	setOptions = () => {
		this.setState({
			VehicleMakesOptions: optionObjectToOptionsLabelValue(VEHICLE_MAKES, this.props.intl),
			TruckClassesOptions: optionObjectToOptionsLabelValue(TRUCK_CLASSES, this.props.intl),
			FuelTypeOptions: optionObjectToOptionsLabelValue(FUEL_TYPES, this.props.intl),
			ColorsOptions: optionObjectToOptionsLabelValue(COLORS, this.props.intl)
		}, this.setFormInputs)
	}

	onSubmit = (values) =>{

		let { vehicle_name, vehicle_vin, vehicle_color, vehicle_license_plate_number, vehicle_make, vehicle_model,
			vehicle_year, vehicle_class, vehicle_fuel_type } = values
		
		const newVehicleProfile = {
			...this.state.vehicle.profile,
			name: vehicle_name,
			vin: vehicle_vin,
			color: vehicle_color,
			license_plate_number: vehicle_license_plate_number,
			make: vehicle_make,
			model: vehicle_model,
			year: vehicle_year,
			class: vehicle_class,
			fuel_type: vehicle_fuel_type
		}

		const updateVehicleData = {
			assetId: this.state.vehicle.id,
			profile: newVehicleProfile
		}

		return updateAssetProfile(updateVehicleData).then(res => {
			notifySuccess("notification.success.update_asset", this.props.intl)
			this.onCloseDetail()
			}).catch(e => {
				notifyError("notification.fail.update_asset", this.props.intl)
			})

	};

	setFormInputs = () =>{

		const { vehicle, TruckClassesOptions, VehicleMakesOptions, FuelTypeOptions, ColorsOptions } =  this.state
		const profile = vehicle.profile

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
								  name: "vehicle_name",
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
								  name: "vehicle_vin",
								  type: "textField",
								  formItemProps:{
									  label : this.props.intl.formatMessage({id:"carrier.vehicle.vin"}),
									  labelCol: AssetDetailFormItemLabelCol,
									  wrapperCol: AssetDetailFormItemWrapperCol,
									  initialValue: profile.vin
								  },
								  fieldProps:{
								  },
								  wrapperCol: AssetDetailWrapperCol
								},
								{
									name: "vehicle_color",
									type: "selectField",
									formItemProps:{
										label : this.props.intl.formatMessage({id:"general.color"}),
										labelCol: AssetDetailFormItemLabelCol,
										wrapperCol: AssetDetailFormItemWrapperCol,
										initialValue: profile.color
									},
									fieldProps:{
										options: ColorsOptions,
									},
									wrapperCol: AssetDetailWrapperCol
								},
								{
									name: "vehicle_license_plate_number",
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
									name: "vehicle_make",
									type: "selectField",
									formItemProps:{
										label : this.props.intl.formatMessage({id:"carrier.vehicle.make"}),
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
									name: "vehicle_model",
									type: "textField",
									formItemProps:{
										label : this.props.intl.formatMessage({id:"carrier.vehicle.model"}),
										labelCol: AssetDetailFormItemLabelCol,
										wrapperCol: AssetDetailFormItemWrapperCol,
										initialValue: profile.model
									},
									fieldProps:{
									},
									wrapperCol: AssetDetailWrapperCol
								},
								{
									name: "vehicle_year",
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
									name: "vehicle_class",
									type: "selectField",
									formItemProps:{
										label : this.props.intl.formatMessage({id:"carrier.vehicle.class"}),
										labelCol: AssetDetailFormItemLabelCol,
										wrapperCol: AssetDetailFormItemWrapperCol,
										initialValue: profile.class
									},
									fieldProps:{
										options: TruckClassesOptions
									},
									wrapperCol: AssetDetailWrapperCol
								},
								{
									name: "vehicle_fuel_type",
									type: "selectField",
									formItemProps:{
										label : this.props.intl.formatMessage({id:"carrier.vehicle.specs.fuel_type"}),
										labelCol: AssetDetailFormItemLabelCol,
										wrapperCol: AssetDetailFormItemWrapperCol,
										initialValue: profile.fuel_type
									},
									fieldProps:{
										options: FuelTypeOptions
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

		const { formInputs } = this.state

		return (
			<div>
			{formInputs ?
				<FormBox
					title={"VehicleDetails"}
					formInputs={formInputs}
					onSubmit={this.onSubmit}
					onCloseDetail={this.onCloseDetail}
				/>: ""}
			</div>
			
		)
	}
}

VehicleDetails.propTypes = {
	intl: intlShape.isRequired
}

export default injectIntl(VehicleDetails)