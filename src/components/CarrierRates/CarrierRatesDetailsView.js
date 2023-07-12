import React from "react";
import {injectIntl, intlShape} from "react-intl";
import Rate from "model/rate/carrier_transport_rate";
import {getSpan} from "constants/layout/grids";
import FormBox from "containers/base/form_box";
import {notifyError, notifySuccess} from "components/notification";
import {updateRate} from "helpers/firebase/firebase_functions/rates";

class RateDetails extends React.Component {

	constructor(props){
		const INITIAL_QUOTE = {
			rate: props.rate || null,
			formInputs: undefined
		}

		super(props);
		this.state = { 
			...INITIAL_QUOTE,
			RolesOptions: []
		};
	}

	componentDidMount(){
		if (this.props.rate instanceof Rate ){
			this.setState({rate: this.props.rate}, this.setOptions)
		}
	}

	componentDidUpdate(prevProps) {

		if ((this.props.rate instanceof Rate ) && (prevProps.rate !== this.props.rate)) {
			this.setState({rate: this.props.rate}, this.setOptions)
		}
	}

	setOptions = () => {
		this.setFormInputs()
	}

	onSubmit = (values) =>{

		let { rate_origin, rate_destination, rate_fuel_rate_baseline, rate_fuel_rate_economy, rate_linehaul_rate, rate_min_linehaul_rate } = values
		const rate = this.state.rate

		const newRate = {
			...rate,
			rateId: rate.id,
			origin: {
				...rate.origin,
				rate_origin,
				displayPosition: {
					geopoint: rate.origin.displayPosition.geopoint,
					h3_geohash: rate.origin.displayPosition.h3_geohash
				}
			},
			destination: {
				...rate.destination,
				rate_destination,
				displayPosition: {
					geopoint: rate.destination.displayPosition.geopoint,
					h3_geohash: rate.destination.displayPosition.h3_geohash
				}
			},
			rate_info: {
				...rate.rate_info,
				fuel_rate: {
					...rate.fuel_rate,
					baseline: rate_fuel_rate_baseline,
					economy: rate_fuel_rate_economy
				},
				linehaul_rate: {
					...rate.linehaul_rate,
					linehaul: rate_linehaul_rate,
					min_linehaul: rate_min_linehaul_rate
				}
			}
		}

		return updateRate(newRate).then(res => {
			this.onCloseDetail()
			notifySuccess("notification.success.update_rate", this.props.intl)
			}).catch(e => {
				notifyError("notification.fail.update_rate", this.props.intl)
			})
	};

	setFormInputs = () =>{

		const { rate } =  this.state

		const RateDetailFormItemLabelCol = {
		xs: {span: 15},
		sm: {span: 13},
		md: {span: 11},
		lg: {span: 9},
	}
	
		const RateDetailFormItemWrapperCol = {
		xs: {span: 10},
		sm: {span: 12},
		md: {span: 14},
		lg: {span: 16},
	}
	
		const RateDetailWrapperCol = {
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
				key: "rate_detail",
				title: this.props.intl.formatMessage({id:"general.rate_detail"}),
				type: "detail",
				groups: [
					{
					name: "rate_detail",
					wrapperCol:{...getSpan(24)},
					groupWrapper:{
						type: "box",
					},
					items: [
                                {
                                    name: "rate_origin",
                                    type: "addressField",
                                    formItemProps:{
                                        label : this.props.intl.formatMessage({id:"general.origin_location"}),
                                        labelCol: RateDetailFormItemLabelCol,
                                        wrapperCol: RateDetailFormItemWrapperCol,
                                        initialValue: rate.origin,
                                    },
                                    fieldProps:{
                                    },
                                    wrapperCol: RateDetailWrapperCol
                                },
                                {
                                    name: "rate_destination",
                                    type: "addressField",
                                    formItemProps:{
                                        label : this.props.intl.formatMessage({id:"general.destination_location"}),
                                        labelCol: RateDetailFormItemLabelCol,
                                        wrapperCol: RateDetailFormItemWrapperCol,
                                        initialValue: rate.destination,
                                    },
                                    fieldProps:{
                                    },
                                    wrapperCol: RateDetailWrapperCol
                                },
								{
								  name: "rate_fuel_rate_baseline",
								  type: "numberField",
								  formItemProps:{
									  label : this.props.intl.formatMessage({id:"carrier.rates.fuel_baseline"}),
									  labelCol: RateDetailFormItemLabelCol,
									  wrapperCol: RateDetailFormItemWrapperCol,
									  initialValue: rate.rate_info.fuel_rate.baseline,
								  },
								  fieldProps:{
								  },
								  wrapperCol: RateDetailWrapperCol
								},
								{
								  name: "rate_fuel_rate_economy",
								  type: "numberField",
								  formItemProps:{
									  label : this.props.intl.formatMessage({id:"carrier.rates.fuel_economy"}),
									  labelCol: RateDetailFormItemLabelCol,
									  wrapperCol: RateDetailFormItemWrapperCol,
									  initialValue: rate.rate_info.fuel_rate.economy
								  },
								  fieldProps:{
								  },
								  wrapperCol: RateDetailWrapperCol
								},
								{
									name: "rate_linehaul_rate",
									type: "numberField",
									formItemProps:{
										label : this.props.intl.formatMessage({id:"carrier.rates.linehaul"}),
										labelCol: RateDetailFormItemLabelCol,
										wrapperCol: RateDetailFormItemWrapperCol,
										initialValue: rate.rate_info.linehaul_rate.linehaul
									},
									fieldProps:{
									},
									wrapperCol: RateDetailWrapperCol
								},
								{
									name: "rate_min_linehaul_rate",
									type: "numberField",
									formItemProps:{
										label : this.props.intl.formatMessage({id:"carrier.rates.min_linehaul"}),
										labelCol: RateDetailFormItemLabelCol,
										wrapperCol: RateDetailFormItemWrapperCol,
										initialValue: rate.rate_info.linehaul_rate.min_linehaul
									},
									fieldProps:{
									},
									wrapperCol: RateDetailWrapperCol
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

		const { rate, formInputs } = this.state

		if (rate === null){
			return (<div></div>)
		}

		return (
			<div>
			{formInputs ?
				<FormBox
					title={"RateDetails"}
					formInputs={formInputs}
					onSubmit={this.onSubmit}
					onCloseDetail={this.onCloseDetail}
				/>: ""}
			</div>
			
		)
	}
}

RateDetails.propTypes = {
	intl: intlShape.isRequired
}

export default injectIntl(RateDetails)
