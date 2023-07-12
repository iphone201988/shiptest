import Drawer from 'antd/es/drawer'

import React from "react";
import {injectIntl, intlShape} from "react-intl";

import {PICKUP_SERVICES, DELIVERY_SERVICES, TRAILER_TYPES, TRAILER_LENGTH} from "constants/options/shipping";

import Loader from "components/utility/loader";
import QuoteRequest from "model/shipment/quote_request";

import {renderShipmentItinerary} from "components/Shipment/ShipmentComponents";
import Card from "../Uielements/Card/card.style";
import {notifyError, notifySuccess} from "components/notification";
import {CURRENCIES_CODES} from "constants/options/money";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import {FilterDict, optionObjectToOptionsLabelValue} from "helpers/data/mapper";
import {BoxWrapper} from "components/utility/box.style";
import FormBox from "../base/form_box";
import QuoteOffer from "model/shipment/quote_offer";
import {createQuoteOffer} from "helpers/firebase/firebase_functions/quote_offers";


class newQuoteOfferDrawer extends React.PureComponent {

	constructor(props){
		super(props);
		this.INITIAL_STATE = {
			formInputs: undefined, 
			CarrierRate: null,
			TrailerTypesOptions: [],
			TrailerTypes: [],
			TrailerType: null,
			TrailerLengthOptions: [],
			TrailerLengths: [],
			TrailerLength: null,
			CurrencyCode: "CAD",
			visible: false,
			quote: props.quote || null,
			PICKUP_SERVICES: PICKUP_SERVICES,
			DELIVERY_SERVICES: DELIVERY_SERVICES,
			loading: false,
			initialized: false
		}
		this.state = { ...this.INITIAL_STATE };
	}

	componentDidMount(){

		if (this.props.visible){
			this.setState({visible: this.props.visible})
		}
		if (this.props.quote){
			this.setQuoteStates(this.props.quote)
		}
	}

	componentDidUpdate(prevProps) {

		if (this.props.quote instanceof QuoteRequest ) {

			if (prevProps.visible !== this.props.visible){
				this.setState({visible: this.props.visible})
			}
			if (prevProps.quote !== this.props.quote){
				this.setQuoteStates(this.props.quote)
			}
		}
	}

	setQuoteStates = (quote) => {
		if (quote){
			this.setState({
				quote: quote,
				TrailerTypes: quote.trailer_types || [],
				TrailerType: (quote.trailer_types || []).length > 0 ? quote.trailer_types[0] : undefined,
				TrailerLengths: quote.trailer_length  || [],
				TrailerLength: (quote.trailer_lengths || []).length > 0 ? quote.trailer_lengths[0] : undefined
			}, (this.setOptions))
		}
	}
	
	KeyValListToOptions = (KeyValList) => {
		return KeyValList.map(kv => {return {label: this.props.intl.formatMessage({id: kv.value.name || "" }), value: kv.key}})
	}
	
	setOptions = () => {
		const {TrailerTypes, TrailerLengths} = this.state

		const TrailerTypesDict = FilterDict(TRAILER_TYPES, TrailerTypes)
		const TrailerLengthDict = FilterDict(TRAILER_LENGTH, TrailerLengths)

		this.setState({
			TrailerTypesOptions: optionObjectToOptionsLabelValue(TrailerTypesDict, this.props.intl),
			TrailerLengthOptions: optionObjectToOptionsLabelValue(TrailerLengthDict, this.props.intl),
			CurrencyOptions: optionObjectToOptionsLabelValue(CURRENCIES_CODES, this.props.intl),
			initialized: true
		}, this.setFormInputs)
	}

	handleReset = () => {
		this.setState(this.INITIAL_STATE)
	}

	onDone(){
		if (this.props.onDone){
			this.handleReset()
			this.props.onDone()
		}
	}

	Loading = (loading) => {
		this.setState({loading: loading})
	}

	onSubmit = (values) => {
		try{
			const {quote} = this.state

			this.Loading(true)

			let quote_data = Object.assign({}, quote);
			quote_data.trailer_type = values.trailer_type
			quote_data.trailer = {type: values.trailer_type, length: values.trailer_length}
			// quote_data.rate = {carrier_rate: values.rate, currency_code: values.currency_code}
			quote_data.rate = {
				currency_code: values.currency_code,
				rate_items:[{
					name: "linehaul",
					description: "Linehaul Rate",
					rate: values.rate,
					quantity: values.quantity
				}]}
			const quote_offer = new QuoteOffer(quote.id, quote_data)
			quote_offer.compact()

			return createQuoteOffer(quote_offer).then(res => {
				notifySuccess("notification.success.new_quote_offer", this.props.intl)
				this.onClose()
				this.onDone()
				this.Loading(false)
			}).catch(e => {
				notifyError("notification.fail.new_quote_offer", this.props.intl)
				this.Loading(false)
			})
		} catch (e) {
			notifyError("notification.fail.new_quote_offer", this.props.intl)
			this.Loading(false)
		}


	}

	onClose = () => {
		this.setState({
			visible: false,
		});
		if (this.props.onClose){
			this.props.onClose()
		}
	};

	setFormInputs = () =>{
		const {TrailerTypesOptions, TrailerType, CurrencyOptions, CurrencyCode, TrailerLengthOptions, TrailerLength} = this.state

		const formInputs = {
			form_type: "regular",
			submit_label: this.props.intl.formatMessage({id:"general.submit"}),
			formProps:{
				layout: "horizontal"
			},
			sections: [
				{
					name: "name",
					size: "full",
					items: [
						{
							name: "trailer_type",
							type: "radioGroupField",
							formItemProps:{
								initialValue: TrailerType,
								hasFeedback: true,
								label : this.props.intl.formatMessage({id:"trailer.type"}),
								labelCol: {
									span: 2
								},
								wrapperCol: {
									span: 20
								},
							},
							fieldProps:{
								options: TrailerTypesOptions,
							},
						},
						{
							name: "trailer_length",
							type: "radioGroupField",
							formItemProps:{
								initialValue: TrailerLength,
								hasFeedback: true,
								label : this.props.intl.formatMessage({id:"trailer.length.title"}),
								labelCol: {
									span: 2
								},
								wrapperCol: {
									span: 20
								},
							},
							fieldProps:{
								options: TrailerLengthOptions,
							},
						},
						{
							name: "rate",
							type: "numberField",
							formItemProps:{
								rules:[
									{
										required: true
									}
								],
								label : this.props.intl.formatMessage({id:"shipment.rate.title"}),
								labelCol: {
									span: 2
								},
								wrapperCol: {
									span: 22
								},
							},
							fieldProps:{
								placeholder: this.props.intl.formatMessage({id:"shipment.rate.title"}),
							},
						},
						{
							name: "currency_code",
							type: "selectField",
							formItemProps:{
								initialValue: CurrencyCode,
								rules:[
									{
										required: true,
										message: this.props.intl.formatMessage({id: 'currency.select.validation'}),
									}
								],
								label : this.props.intl.formatMessage({id:"currency.title"}),
								labelCol: {
									span: 2
								},
								wrapperCol: {
									span: 6
								},
							},
							fieldProps:{
								placeholder: this.props.intl.formatMessage({id:"currency.title"}),
								options: CurrencyOptions
							},
						}
						]
				}
				]
		}
		this.setState({formInputs: formInputs})
	}

	render(){
		const {quote, visible, loading, initialized, formInputs} = this.state

		if(loading || !initialized || !(quote instanceof QuoteRequest)){
			return <Loader></Loader>
		}

		return (
			<Drawer
				width="80%"
				placement="right"
				closable={true}
				onClose={this.onClose}
				visible={visible}
				destroyOnClose={true}
			>
				<Card title={this.props.intl.formatMessage({id: 'quote.carrier.make_quote_offer.title'})}>
					<BoxWrapper>
						{formInputs ?
							<FormBox
								title={this.props.intl.formatMessage({id: 'quote.carrier.make_quote_offer.title"'})}
								formInputs={formInputs}
								onSubmit={this.onSubmit}
							/>: ""}
					</BoxWrapper>
				</Card>
				<Card title={this.props.intl.formatMessage({id: 'shipment.itinerary.title'})}>
					{renderShipmentItinerary(quote, this.props.intl.formatMessage)}
				</Card>
			</Drawer>
		)
	}
}

const mapStateToProps = state => {
	return {}
}

newQuoteOfferDrawer.propTypes = {
	intl: intlShape.isRequired
}

export default compose(
	connect(mapStateToProps, {}),
	firebaseConnect()
)(injectIntl(newQuoteOfferDrawer))