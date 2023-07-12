import React from "react";
import {Component} from "react";
import {injectIntl, intlShape} from "react-intl";
import {Row, Col } from "antd";
import {get_freight_type, get_packaging_type, get_trailer_type} from "constants/options/shipping";
import {DescriptionItem} from "helpers/views/elements";

import {renderShipmentItinerary} from "./ShipmentComponents";
import Loader from "components/utility/loader";


class QuoteRequestReview extends Component {

	constructor(props){
		const INITIAL_VALUES = {
			QuoteRequest: undefined
		}
		super(props);
		this.state = { ...INITIAL_VALUES };
	}

	printItemSummary(Item, mode){

		let weight_str_id =  ""
		// const weight = Item.getWeight()

		if (mode === "pickup"){
			weight_str_id = "shipment.pickup.weight"
		}else if (mode === "drop"){
			weight_str_id = "shipment.drop.weight"
		}else{
			weight_str_id = "shipment.load.weight"
		}
		const weight_str = `${this.props.intl.formatMessage({id: weight_str_id})}: ${Item.getWeight()}`

		return (
			<DescriptionItem title={this.props.intl.formatMessage({id: "shipment.items.title"})}
			content={`${Item.quantity} ${this.props.intl.formatMessage({id: get_packaging_type(Item.packaging_type).name})}: ${weight_str}`}
			/>
			)
	}

	renderItinerarySteps = (shipment) => {
		return
	}


	render(){
		const {QuoteRequest} = this.props

		let content = ""
		if (!(QuoteRequest || {}).itinerary_sequence){
			content = <Loader></Loader>
		}else{

			const FreightType = QuoteRequest.freight_type ? this.props.intl.formatMessage({id: get_freight_type(QuoteRequest.freight_type).name}) : ""
			const TrailerTypes = Array.isArray(QuoteRequest.trailer_type) ? QuoteRequest.trailer_type.map(trailer_type => {
				return this.props.intl.formatMessage({id: get_trailer_type(trailer_type).name || ""})
			}) : []

			content = <div>
					<Row>
						<Col>
							<span>{FreightType}</span>
						</Col>
						<Col>
							<span>
										{Array.isArray(TrailerTypes) ?
											TrailerTypes.join(" or ") : ""
										}</span>
						</Col>
					</Row>
				{renderShipmentItinerary(QuoteRequest, this.props.intl.formatMessage)}

				</div>

		}
		return <div>{content}</div>
	}
}

QuoteRequestReview.propTypes = {
	intl: intlShape.isRequired
}

export default injectIntl(QuoteRequestReview)