import Rate from "./rate";
import CoreModel from "../core/core";
import {Location, LocationType, Position} from "../location/location";
import {TimeStamp} from "helpers/data/format";
import WaypointsSequences from "helpers/here/rest/WaypointsSequences";
import {Interconnection, ItinerarySequence, Waypoint} from "./shipmentSequences";
import HandleUnit from "./handlingUnit";
import FirestoreCollection, {FireQuery} from "helpers/firebase/firestore/firestore_collection";

export var nanoid = require('nanoid');

export class TimeRange{

	constructor(data){
		this.earliest_time = TimeStamp(data.earliest_time)
		this.latest_time = TimeStamp(data.latest_time)
	}
}

export class ShipmentTimeTrack  {

	constructor(data) {
		this.arrival_time = TimeStamp(data.arrival_time)
		this.load_start_time = TimeStamp(data.load_start_time)
		this.load_end_time = TimeStamp(data.load_start_time)
	}
}

export class ShipmentLocation {
	constructor(data){
		data = data || {}
		this.id = data.id || nanoid(5)
		this.location_type = LocationType(data.location_type)
		this.location = new Location(data.location)
		this.is_start = data.is_start || false
		this.is_end = !data.is_start ? data.is_end || false : false
		this.pickups = data.pickups || []
		this.drops = data.drops || []
		// this.pickups_details = data.pickups || []
		// this.drops_details = data.drops || []
		// this.before = data.before || []
		this.address_info = data.address_info
		// this.earliest_access_time = TimeStamp(data.earliest_access_time)
		// this.latest_access_time = TimeStamp(data.latest_access_time)
		// this.earliest_estimated_arrival_time = TimeStamp(data.earliest_estimated_arrival_time)
		// this.latest_estimated_arrival_time = TimeStamp(data.latest_estimated_arrival_time)
		// this.arrival_time = TimeStamp(data.arrival_time)
		// this.start_loading_time = TimeStamp(data.start_loading_time)
		// this.end_loading_time = TimeStamp(data.end_loading_time)
		// this.departure_time = TimeStamp(data.departure_time)

		//TODO:  this check is done to satisfy the old data type
		if (data.access_time){
			this.access_time = {earliest_time: TimeStamp(data.access_time.earliest_time), latest_time: TimeStamp(data.access_time.latest_time)}
			// this.access_time = new TimeRange(data.access_time)
		}
		// else{
		// 	this.access_time = {earliest_time: TimeStamp(data.earliest_access_time), latest_time: TimeStamp(data.latest_access_time)}
		// }

		if (data.eta_time){
			// this.eta_time = new TimeRange(data.eta_time)
			this.eta_time = {earliest_time: TimeStamp(data.eta_time.earliest_time), latest_time: TimeStamp(data.eta_time.latest_time)}
		}

		if (data.time_track){
			// this.time_track = new ShipmentTimeTrack(data.time_track)
			this.time_track = {arrival_time: TimeStamp(data.arrival_time), load_start_time: TimeStamp(data.start_loading_time), load_end_time: TimeStamp(data.end_loading_time)}
		}
	}
	setLocation = (location) => {
		this.location = new Location(location)
	}
}

export class RouteSummary{

	constructor(data) {
		this.route_distance = data.route_distance || 0
	}
}

export class LegTiming {

	constructor(data){
		this.duration = data.time || 0
		this.rest_time = data.rest || 0
		this.waiting_time = data.waiting_time || 0
	}
}

export class LegSummary {

	constructor(data) {
		this.route_summary = new RouteSummary(data.route || {})
		this.estimated_timing = new LegTiming(data.estimated_timing)
		this.track_timing = new LegTiming(data.track_timing)
	}
}

export class ShipmentLeg{

	constructor(data) {
		this.id = data.id
		this.shipment_leg_id = data.shipment_leg_id
		this.origin = new ShipmentLocation(data.origin);
		this.destination = new ShipmentLocation(data.destination);
		this.summary = new LegSummary(data.summary || {})
	}
}

export class ItinerarySummary {

	constructor(data) {
		this.distance = data.distance || 0
		this.timing = data.timing || 0
	}
}

export class ItineraryLegs{

	constructor(data) {
		this.first_leg = new ShipmentLeg(data.first_leg)
		this.intermediate_legs = (this.intermediate_legs || []).map(intermediate_leg => new ShipmentLeg(intermediate_leg || []))
		this.last_leg =  data.last_leg ? new ShipmentLeg(data.last_leg || {}) : undefined
	}
}

export class Itinerary {
	constructor(data) {
		this.legs = new ItineraryLegs(data.legs)
		this.summary = new ItinerarySummary(data.summary || {})
	}
}

class TrackingData  {
	constructor(data) {
		data = data || {}
		this.position = new Position(data.position || {})
		this.eta = TimeStamp(data.eta || 0)
		this.id = data.id || ""
	}
}


export class BaseShipment extends CoreModel  {

	constructor(id, data, {expand=true} = {}) {
		data = data || {}

		super(id, "Shipments")
		if (data){

			if (data.destinations){
				// TODO: temporarly -- remove this section
				if (!data.origin){
					data.origin = data.destinations[0]
				}
				if (!data.destination){
					data.destination = data.destinations[data.destinations.length-1]
				}
			}
			try{
				this.id = data.id
				this.type = data.type
				this.active = data.active || false
				this.action_type = data.action_type || ""
				this.status = data.status
				this.freight_type = data.freight_type
				this.trailer_type = data.trailer_type
				this.trailer_length = data.trailer_length
				this.trailer_lengths = data.trailer_lengths
				this.trailer_types = Array.isArray(data.trailer_types) ? data.trailer_types : [data.trailer_types || ""]
				this.handling_units = data.handling_units || []
				this.origin = (data.origin instanceof ShipmentLocation)  ? data.origin  : new ShipmentLocation(data.origin)
				this.destination =  (data.destination instanceof ShipmentLocation)  ? data.destination  : new ShipmentLocation(data.destination)
				this.stops = (data.stops || data.destinations || []).map(location => new ShipmentLocation(location))
				this.destinations_mapping = this.setDestinationsMapping()
				this.shipment_services = data.shipment_services || []
				this.shipper = data.shipper
				this.carrier = data.carrier
				this.weight = data.weight
				this.rate = new Rate(data.rate)
				this.itinerary_sequence = new ItinerarySequence(data.itinerary_sequence)
				this.billing_profile = data.billing_profile
				this.locations=[]
				this.tracking_data= new TrackingData(data.tracking_data || {})
				this.expanded = false
				if (expand && data){this.expand()}
			}catch (e) {
				this.invalid = true
			}

		}else{
			this.invalid = true
		}
	}

	setDestinationsMapping = () =>{
		const id_index = {}
		this.destinations().map((stop, index) => {id_index[stop.id] = index})

		return {
			id_index: id_index
		}
	}

	isValid = () =>{
		return !(this.invalid === true)
	}


	// compact =() =>{
	// 	// TODO:  create another function to convert to JSON  and keep Compact as  BaseShipment without locations
	// 	this.locations = []
	// 	return JSON.parse(JSON.stringify(this))
	// }

	compact = () =>{
		this.reduceLocationPickupsAndDrops()
		this.reduceItineraryLocations()
	}

	expand = () => {
		/*
		 Expand the shipment Objects such to convert the ids into objects such as the Location Pickups and drops
		 and the locations in the itinerary objects
		* */

		// const destinations = []
		try{
			if (! this.expanded){
				this.setLocationPickupsAndDrops()
				this.setItineraryLocations()
				this.expanded = true
			}
		}catch (e) {
			console.log(e)
		}
	}

	setNewItinerary = (itinerary_sequence) => {
		// setting the itinerary sequence objects and reordering the stops, destination  and the locations eta times object according to the new itinerary

		this.itinerary_sequence = itinerary_sequence
		const locations = this.getRouteLocations()
		// this.stops = locations.slice(1)
    this.destination = locations[locations.length - 1]
		this.setLocationTimes()
	}

	StartLocation = () => {
		return this.origin
	}

	EndLocation = () => {
		return this.destination
	}

	StopLocations = () => {
		return this.stops || []
	}

	destinations = () => {
		let destinations = []
		destinations.push(this.StartLocation())
		destinations = destinations.concat(this.StopLocations())
		// destinations.push(this.EndLocation())
		return destinations
	}

	getRouteLocations = () =>{
		if (! this.expanded ){
			this.expand()
		}
		const routeLocations = []
		const interconnections = (this.itinerary_sequence || {}).interconnections || []
		if (interconnections.length > 0){
			interconnections.map((interconnection, index) => {
				if (index == 0 ){
					routeLocations[0] = interconnection.start_location
					routeLocations[1] = interconnection.end_location
				}else{
					routeLocations.push(interconnection.end_location)
				}
			})
			return routeLocations
		} else{
			return this.destinations()
		}
	}

	getDestination = (id) =>{
		try{
		return Object.assign({}, this.destinations().filter(location => location.id === id)[0]);
		}catch (e) {
			return undefined
		}
	}

	static getWeight(handling_units){
		return Object.values(handling_units).map(hu => (hu.weight || 0) * (hu.quantity || 0)).reduce((a,b) => a + b, 0)
	}

	updateWeight(){
		this.weight =  this.getWeight(this.handling_units)
	}

	setLocationPickupsAndDrops = (compact=false) => {
		const locationPickups = {}
		const locationDrops = {}
		this.handling_units.forEach(hu => {
			if ((hu.origin_location || {}).id){
				if (Array.isArray(locationPickups[hu.origin_location.id])){
					locationPickups[hu.origin_location.id].push(new HandleUnit(hu, {compact:compact}))
				}else{
					locationPickups[hu.origin_location.id] = [new HandleUnit(hu, {compact:compact})]
				}
			}
			if ((hu.destination_location || {}).id){
				if (Array.isArray(locationDrops[hu.destination_location.id])){
					locationDrops[hu.destination_location.id].push(new HandleUnit(hu, {compact:compact}))
				}else{
					locationDrops[hu.destination_location.id] = [new HandleUnit(hu, {compact:compact})]
				}
			}
		})
		this.destinations().forEach(destination => {
			destination.pickups = locationPickups[(destination.location || {}).id] || []
			destination.drops = locationDrops[(destination.location || {}).id] || []
		})
	}

	setItineraryLocations = () => {

		this.itinerary_sequence.interconnections.map(interconnection =>{
			const destinations = this.destinations()
			const start_location_id = interconnection.start_location.id
			const end_location_id = interconnection.end_location.id
			interconnection.start_location = destinations[this.destinations_mapping.id_index[start_location_id]]
			interconnection.end_location = destinations[this.destinations_mapping.id_index[end_location_id]]
		})
	}

	reduceLocationPickupsAndDrops = () =>{
		this.destinations().forEach(destination => {
			destination.pickups = destination.pickups.map(pickup => {return {id: pickup.id}})
			destination.drops = destination.drops.map(drop => {return {id: drop.id}})
		}
		)
	}

	reduceItineraryLocations = () =>{
		this.itinerary_sequence.interconnections.map(interconnection =>{
			try{
				interconnection.start_location = {id:interconnection.start_location.id}
				interconnection.end_location = {id:interconnection.end_location.id}
			}catch (e) {
				console.error(e)
			}

		})
	}

	setLocationTimes = () => {
		//init array for stop times
		console.log('checking this', this)
		this.origin.eta_time = this.origin.access_time
		let earliest_stop_times = [this.origin.access_time.earliest_time];
		let latest_stop_times = [this.origin.access_time.latest_time];
		const add = (a, b) => {
			return a + b
		}
		//loops through getRouteLocation stops and adds the itinerary sequence times
    const routeLocations = this.getRouteLocations()
		for (let i = 0; i < routeLocations.length - 1; i++) {
			earliest_stop_times.push(this.itinerary_sequence.interconnections[i].timing.time + this.itinerary_sequence.interconnections[i].timing.rest)
			latest_stop_times.push(this.itinerary_sequence.interconnections[i].timing.time + this.itinerary_sequence.interconnections[i].timing.rest)
			//the indexes are moved up since itinerary_sequence does not have an interconnection for the origin
			//sets access time and eta time the same, but will change access time later.
			routeLocations[i+1].access_time = { earliest_time: earliest_stop_times.reduce(add), latest_time: latest_stop_times.reduce(add) }
			routeLocations[i+1].eta_time = {earliest_time: earliest_stop_times.reduce(add), latest_time: latest_stop_times.reduce(add) }
			//at the end of the loop sets the destination times
			if (i === (this.stops.length - 1)) {
				this.destination.access_time.earliest_time = earliest_stop_times.reduce(add)
				this.destination.access_time.latest_time = latest_stop_times.reduce(add)
				this.destination.eta_time = { earliest_time: earliest_stop_times.reduce(add), latest_time: latest_stop_times.reduce(add) }
			}
		}
	}


}
