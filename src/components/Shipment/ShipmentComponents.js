import React from "react";
import { getLocalTimeFromEpoch } from "helpers/data/format";
import { dateFormat, dateTimeFormat, timeFormat } from "constants/variables";
import { DurationTimeString, secondsToTimeDict } from "helpers/data/datetime";
import Steps from '../uielements/steps';
import IntlMessages from "components/utility/intlMessages";
import ReactDOM from 'react-dom'
import { Col, Row } from 'antd/es/grid/';
import { DescriptionItem } from "helpers/views/elements";
import { Capitalize } from "helpers/data/string";
import {
	shipment_handling_units,
	get_freight_type,
	get_packaging_type,
	get_trailer_length,
	get_trailer_type
} from "constants/options/shipping";
import ShipmentDeliveryCell from "./ShipmentShowMore"
//eslint-disable-next-line
import Box from "components/utility/box";
import Map from "../HereMaps/base_map"
import { ShipmentLocation } from "model/shipment/baseShipment";
//eslint-disable-next-line
import SonarSignal from "../Sonar/sonar_signal";

var convert = require('convert-units')
const Step = Steps.Step;

export function DeliveryTimeDisplay(shipment_location, { showTime = true, showRange = true,
	before_text = '', middle_text = '-', after_text = '' } = {}) {

	try {
		const timezone = shipment_location.location.utc_offset
		// let earliest_time_epoch
		// let latest_time_epoch

		const earliest_time_epoch = (shipment_location.access_time.earliest_time || {})
		const latest_time_epoch = (shipment_location.access_time.latest_time || {})

		// if (type && type === "origin" && shipment_location.access_time !== undefined) {
		// 	 earliest_time_epoch =  (shipment_location.access_time.earliest_time || {})
		// 	 latest_time_epoch = (shipment_location.access_time.latest_time || {})
		//
		// } else if (type && type === "destination" && shipment_location.eta_time !== undefined) {
		// 	 earliest_time_epoch =  (shipment_location.eta_time.earliest_time || {})
		// 	 latest_time_epoch = (shipment_location.eta_time.latest_time || {})
		// }
		const earliest_datetime = getLocalTimeFromEpoch(earliest_time_epoch, timezone)
		const latest_datetime = getLocalTimeFromEpoch(latest_time_epoch, timezone)
		const earliest_date_str = earliest_datetime.format(dateFormat)
		const latest_date_str = earliest_datetime.format(dateFormat)
		// showRange = earliest_date_str === latest_date_str ? false: showRange  timeFormat
		const earliest_datetime_str = showTime ? earliest_datetime.format(dateTimeFormat) : earliest_date_str
		const latest_datetime_str = showTime ?
			earliest_date_str === latest_date_str ? latest_datetime.format(timeFormat) : latest_datetime.format(dateTimeFormat)
			: latest_date_str

		return showRange ? `${before_text} ${earliest_datetime_str || ""} ${middle_text} ${latest_datetime_str || ""} ${after_text}` :
			`${before_text} ${earliest_datetime_str}  ${after_text}`
	} catch (e) {
		console.error(e)
		return ""
	}
}

export function printHandlingUnitSummary(Item, mode, LanguageFormatMessage) {

	let prefix = ""

	if (mode === "pickup") {
		prefix = "shipment.pickup.title"
	} else if (mode === "drop") {
		prefix = "shipment.drop.title"
	} else {
		prefix = "shipment.pickup.title"
	}
	const weight_str = `${Item.quantity * Item.weight}`
	const prefix_str = `${Capitalize(LanguageFormatMessage({ id: prefix }))}`

	return (<Row>
		<DescriptionItem title={prefix_str}
			content={`${Item.quantity} ${LanguageFormatMessage(
				{ id: get_packaging_type(Item.packaging_type).name })}: ${weight_str} lbs`}
		/>
	</Row>)
}

export function renderShipmentDetails(shipment, LanguageFormatMessage) {

	const itinerary_sequence = shipment.itinerary_sequence
	// const destinations = shipment.getRouteLocations()
	const destinations = shipment?.getRouteLocations()

	if (Array.isArray(destinations)) {
		console.log("This is working***");
		const it_steps = []
		let start_cummul_weight = 0
		let end_cummul_weight = 0

		destinations.forEach((destination, index) => {
			start_cummul_weight = start_cummul_weight + destination.pickups.map(item => item.quantity * item.weight).reduce((a, b) => a + b, 0)
			end_cummul_weight = start_cummul_weight - destination.drops.map(item => item.quantity * item.weight).reduce((a, b) => a + b, 0)

			let expected_time
			if (destination.access_time !== undefined) {
				expected_time = `${DeliveryTimeDisplay(destination)}`
			}
			else if (destination.access_time !== undefined) {
				expected_time = `${DeliveryTimeDisplay(destination)}`
			}
			const pickup_description = Array.isArray(destination.pickups) ? (<div>{destination.pickups.map(item =>
				printHandlingUnitSummary(item, "pickup", LanguageFormatMessage))}</div>) : ""
			const drop_description = Array.isArray(destination.drops) ? (<div>{destination.drops.map(item =>
				printHandlingUnitSummary(item, "drop", LanguageFormatMessage))}</div>) : ""

			const end_cummul_weight_description = (<div><IntlMessages id={"shipment.load.weight"} /> {end_cummul_weight} lbs</div>)
			start_cummul_weight = end_cummul_weight

			const description = (<div> {expected_time}
				{pickup_description} {drop_description} {end_cummul_weight_description}
			</div>)

			it_steps.push((
				<Step title={`${destination.location.label}`} description={description}></Step>))
		}
		)

		const total_distance_str = itinerary_sequence.distance ? `${convert(itinerary_sequence.distance).from("m").to("km")} Km` : ""
		const total_duration_str = itinerary_sequence.time ?
			DurationTimeString(secondsToTimeDict(itinerary_sequence.time, true), LanguageFormatMessage) : ""

		const trip_description = (
			<Row>
				<Col span={12}>
					<DescriptionItem title={LanguageFormatMessage({ id: "general.distance" })}
						content={total_distance_str} style={{ fontWeight: "bold" }} />{' '}
				</Col>
				<Col span={12}>
					<DescriptionItem title={LanguageFormatMessage({ id: 'general.duration' })}
						content={total_duration_str} style={{ fontWeight: "bold" }} />
				</Col>
			</Row>
		)

		// const sonarSignal = destinations.length > 1 ? renderSonarSignal(destinations[0], destinations.slice(-1)[0]) : ""

		return (
			<div>
				<Steps direction="vertical" current={0}>{it_steps.map(it_step => { return it_step })}</Steps>
				{trip_description}
				{/*{sonarSignal}*/}
			</div>
		)
	} else {
		return ""
	}
}

// function renderSonarSignal(originLocation, destinationLocation){
// 	let originZip = ""
// 	let destinationZip = ""

// 	try{
// 		originZip = originLocation.location.address.postalCode
// 	}catch (e) {
// 	}

// 	try{
// 		destinationZip =  destinationLocation.location.address.postalCode
// 	}catch (e) {
// 	}
// 	return <Box><SonarSignal originZip={originZip} destinationZip={destinationZip}></SonarSignal></Box>
// }


export function renderShipmentItinerary(shipment, LanguageFormatMessage, printMap = false) {
	console.log('i am shipmnt', shipment);
	const shipmentDetails = renderShipmentDetails(shipment, LanguageFormatMessage)
	return (
		<Row style={{ width: '100%' }}>
			<Col xs={24} sm={24} md={12} lg={12} xl={12}>
				{shipmentDetails}
			</Col>
			<Col xs={24} sm={24} md={12} lg={12} xl={12}>
				<Map map_id={"here-maps"} shipment={shipment} width={"100%"} height={"400px"}></Map>
			</Col>
		</Row>
	)
}

export function PickupCellInfo(shipment) {
	if (shipment.origin instanceof ShipmentLocation) {
		const address = `${shipment.origin.location.shortLabel}`
		const time = DeliveryTimeDisplay(shipment.origin, { showTime: true, showRange: true })
		return (<div><div>{address}</div><div>{time}</div></div>)
	} else {
		return (<div></div>)
	}

}

export function renderShipmentFreightMode(shipment, LanguageFormatMessage, { showFreightType = true,
	showTrailerType = true, showTrailerLength = true, showTrailerTypes = false } = {}) {
console.log(shipment,"LLLLLLL");
	const freight_type_str = showFreightType && shipment.freight_type ? LanguageFormatMessage({ id: get_freight_type(shipment.freight_type).name }) : ""
	const trailer_type_str = showTrailerType && Array.isArray(shipment.trailer_types) ?
	shipment.trailer_types.map(trailer_type => {
		return LanguageFormatMessage({ id: get_trailer_type(trailer_type).name || "" })
	})
		.join(` ${LanguageFormatMessage({ id: 'general.or' })} `) : ""
	const trailer_types_str = showTrailerTypes && Array.isArray(shipment.trailer_types) ?
		shipment.trailer_types.map(trailer_type => {
			return LanguageFormatMessage({ id: get_trailer_type(trailer_type).name || "" })
		})
			.join(` ${LanguageFormatMessage({ id: 'general.or' })} `) : ""
	const trailer_length_str = showTrailerLength ? LanguageFormatMessage({ id: get_trailer_length(shipment?.trailer_length).name }) : ""

	return <div>
		<Row>
			<Col xs={6} sm={8} md={8} lg={6} xl={6}>
				{freight_type_str ?
					<DescriptionItem title={LanguageFormatMessage({ id: 'freight.type.title' })}
						content={`${shipment.freight_type}`} DescriptionItem /> : ""
				}
			</Col>

			{showTrailerTypes ?
				<Col xs={12} sm={10} md={10} lg={6} xl={6}>
					{trailer_types_str ?
						<DescriptionItem title={LanguageFormatMessage({ id: 'trailer.title' })}
							content={`${trailer_types_str}`} DescriptionItem /> : ""
					}
				</Col> : ""}

			{/* {!showTrailerTypes && showTrailerType ?
				<Col xs={12} sm={10} md={10} lg={6} xl={6}>
					{trailer_type_str ?
						<DescriptionItem title={LanguageFormatMessage({ id: 'trailer.title' })}
							content={`${trailer_type_str}`} DescriptionItem /> : ""
					}
				</Col> : ""} */}

			<Col xs={6} sm={6} md={6} lg={6} xl={6}>
				{trailer_length_str ?
					<DescriptionItem title={LanguageFormatMessage({ id: 'trailer.length.title' })}
						content={`${trailer_length_str}`} DescriptionItem /> : ""
				}
			</Col>
		</Row>
	</div>
}

export function renderShipmentRate(rate, domain, LanguageFormatMessage, { print_tax = false } = {}) {

	const total = rate.total || ""
	const currency_code = rate.currency_code ? rate.currency_code : "CAD"

	return <div>
		<DescriptionItem title={LanguageFormatMessage({ id: 'shipment.rate.title' })}
			content={`${total} ${currency_code}`} DescriptionItem />
		{print_tax ? <DescriptionItem title={LanguageFormatMessage({ id: 'shipment.rate.taxes' })}
			content={`${rate.total_taxes} ${currency_code}`} DescriptionItem /> : ""}
	</div>
}

export function renderShipmentInvoice(shipment, LanguageFormatMessage,
	{ showFreightType = false, showHandlingUnits = false,
		showShipLocations = false, showTrailer = false } = {}) {
	// const frightType = showFreightType && shipment.freight_type ? LanguageFormatMessage({ id: get_freight_type(shipment.freight_type).name }) : ""
	// const handlingUnits = showHandlingUnits && shipment.handling_units ? LanguageFormatMessage({ id: shipment_handling_units(shipment.handling_units.origin_location).name }) : ""
	const frightType = shipment.shipment_info.freight_type || "";
	const handlingUnits = shipment.shipment_info.handling_units[0] || "";
	const trailer = shipment.shipment_info.trailer || "";
	// const shipmentlocations = shipment.shipment_info.shipment_locations[0].access_time

	// console.log(shipment.shipment_info.shipment_locations[0].access_time,"DDDDDDDD");
	return <div>
		{showFreightType ? <div>{frightType}</div> : " "}

		{showHandlingUnits ? <Row>
			<Col xs={6} sm={8} md={8} lg={6} xl={6}>
				<DescriptionItem title="Height"
					content={`${handlingUnits.height}`} DescriptionItem />
			</Col>
			<Col xs={12} sm={10} md={10} lg={6} xl={6}>
				<DescriptionItem title="Hazardous"
					content={`${handlingUnits.hazardous}`} DescriptionItem />
			</Col>
			<Col xs={12} sm={10} md={10} lg={6} xl={6}>
				<DescriptionItem title="Length"
					content={`${handlingUnits.length}`} DescriptionItem /></Col>
			<Col xs={6} sm={6} md={6} lg={6} xl={6}>
				<DescriptionItem title="Destination Location"
					content={`${handlingUnits.destination_location.id}`} DescriptionItem />
			</Col>
		</Row> : " "
		}
		{/* {showShipLocations ? <div>{shipmentlocations}</div> : " "} */}
		{showTrailer ? <DescriptionItem title="Trailer"
			content={`${trailer}`} DescriptionItem /> : " "}
	</div>

}

export function DeliveryCellInfo(shipment) {
	if (shipment.destination instanceof ShipmentLocation) {
		const address = `${shipment.destination.location.shortLabel}`
		const time = DeliveryTimeDisplay(shipment.destination, { showTime: false, showRange: false })
		let additionalStops = []

		if (shipment.itinerary_sequence.interconnections.length > 1) {
			for (const stop of shipment.itinerary_sequence.interconnections) {
				additionalStops.unshift(stop.end_location.location.shortLabel)
			}
		}
		return ((additionalStops.length > 1) ?
			<ShipmentDeliveryCell destinations={additionalStops} time={time} address={address} />
			:
			<div>{address} | {time}</div>)
	} else {
		return (<div></div>)
	}
}	
