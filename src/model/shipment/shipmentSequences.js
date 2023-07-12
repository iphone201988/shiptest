import WaypointsSequences from "helpers/here/rest/WaypointsSequences";
import CarrierUserProfile from "./../carrier/carrier"
import TrailerProfile from "./../asset/trailer"
import VehicleProfile from "./../asset/vehicle"
export var nanoid = require('nanoid');

export class InterconnectionTiming{
	constructor(data){
		data = data || {}
		this.time = data.time || 0
		this.rest = data.rest || 0
		this.waiting = data.waiting || 0
	}
}

export class Interconnection {
	constructor(data) {
		data = data || {}
		this.id = data.id || nanoid(5)
		this.start_location = data.start_location || {id: data.start_waypoint}
		this.end_location = data.end_location || {id: data.end_waypoint}
		this.distance = data.distance
		this.timing = new InterconnectionTiming(data.timing)
	}
}

export class Waypoint {
	constructor(data) {
		data = data || {}
		this.id = data.id
		this.latitude = data.latitude
		this.longitude = data.longitude
		this.sequence = data.sequence
		this.estimatedArrival = data.estimatedArrival
		this.estimatedDeparture = data.estimatedDeparture
		this.fulfilledConstraints = data.fulfilledConstraints || []
	}
}

export class ItinerarySequence {
	constructor(data) {
		data = data || {}
		this.interconnections = Array.isArray(data.interconnections) ?
			data.interconnections.map(interconnection => new Interconnection(interconnection)) : []
		this.driver_assignments = data.driver_assignments || {}
		this.drivers = data.drivers || []
		this.waypoints = data.waypoints || []
		this.distance = data.distance || 0
		this.time = data.time || 0
	}

	static getItinerarySequence(start_location, stop_locations, end_location=undefined) {
		
		return WaypointsSequences.findSequences({}, start_location, stop_locations, end_location)
			.then(results => {
					const interconnections = results[0].interconnections.map(interconnection => new Interconnection(
						{
							start_location: {id: interconnection.fromWaypoint},
							end_location: {id: interconnection.toWaypoint},
							distance: interconnection.distance,
							timing: {time: interconnection.time, rest: interconnection.rest, waiting:interconnection.waiting},
						}
					))

					// const waypoints = results[0].waypoints.map(waypoint => new Waypoint({
					// 	id: waypoint.id,
					// 	latitude: waypoint.lat,
					// 	longitude: waypoint.lng,
					// 	sequence: waypoint.sequence,
					// 	estimatedArrival: waypoint.estimatedArrival,
					// 	estimatedDeparture: waypoint.estimatedDeparture,
					// 	fulfilledConstraints: waypoint.fulfilledConstraints || []
					// }))

					return new ItinerarySequence({
						interconnections: interconnections,
						distance: results[0].distance, time: results[0].time
					})
			}
			).catch(e=>{
				console.error(e.message)
			})
	}
}

// function WayPointConstraintsData(shipment_location) {
// 	const constraints = {}
// 	constraints["pickup"] = Array.isArray(shipment_location.pickups) ?
// 		shipment_location.pickups.map(pickup => {
// 			return {id: pickup}
// 		}) : []
// 	constraints["drop"] = Array.isArray(shipment_location.drop) ? shipment_location.drop : []
// }

// function WayPointData(shipment_location) {
// 	const coordinates = shipment_location.geopoint.displayPosition.getCoordinates()
// 	const constraint_data = WayPointConstraintsData(shipment_location)
// 	return {
// 		id: shipment_location.id, latitude: coordinates.latitude,
// 		longitude: coordinates.longitude, constraints: constraint_data
// 	}
// }

export class TransportResource {

	constructor(data){
			data = data || {}
			this.id = data.id
			this.type = data.type
			if (this.type === 'vehicle'){
					this.profile = new VehicleProfile(data.profile)
			}else if(this.type === 'trailer'){
					this.profile = new TrailerProfile(data.profile)
			}else if(this.type === 'driver'){
					this.profile = new CarrierUserProfile(data.profile)
			}
	}
}

export class ResourceAssignment {

	constructor(data){
			data = data || {}
			this.interconnection_id = data.interconnection_id
			this.resource = new TransportResource(data.resource || {})
	}
}