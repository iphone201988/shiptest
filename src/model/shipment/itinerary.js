import {Location} from "../location/location";
import {CarrierEquipment} from "../carrier/equipment/carrierEquipment";
import CoreModel from "../core/core";

export class ItineraryLeg extends CoreModel {

  constructor(id, data) {

    data = data || {}
    super(id)

    this.status = data.status
    try{
      this.origin = new Location(data.origin)
    }catch (e) {
      this.origin = undefined
    }
    try{
      this.destination = new Location(data.destination)
    }catch (e) {
      this.destination = undefined
    }

    this.pickup_planned_earliest_time = data.pickup_planned_earliest_time
    this.pickup_planned_latest_time = data.pickup_planned_latest_time
    this.pickup_arrival_time = data.pickup_arrival_time
    this.pickup_start_loading_time = data.pickup_start_loading_time
    this.pickup_done_loading_time = data.pickup_done_loading_time
    this.delivery_planned_earliest_time = data.delivery_planned_earliest_time
    this.delivery_planned_latest_time  = data.delivery_planned_latest_time
    this.delivery_arrival_time = data.delivery_arrival_time
    this.delivery_start_unloading_time = data.delivery_start_unloading_time
    this.delivery_done_unloading_time = data.delivery_done_unloading_time
    this.driver = data.driver
    try{
      this.carrier_equipments = data.carrier_equipments.map(equipment =>
          new CarrierEquipment(equipment))
    }catch (e) {
      this.carrier_equipments = []
    }

    this.shipment = data.shipment
    this.pickups = data.pickups
    this.deliveries = data.deliveries
  }

}

export default class Itinerary{

  constructor(itinerary){
    itinerary = itinerary || {}

    try{
      this.origin = new Location(itinerary.origin)
    }catch (e) {
      this.origin = undefined
    }
    try{
      this.destination = new Location(itinerary.destination)
    }catch (e) {
      this.destination = undefined
    }

    this.origin_type = itinerary.origin_type || ""
    this.destination_type = itinerary.destination_type || ""

    this.pickup_earliest_time = itinerary.pickup_earliest_time
    this.pickup_latest_time =  itinerary.pickup_latest_time
    this.delivery_earliest_time =  itinerary.delivery_earliest_time
    this.delivery_latest_time =  itinerary.delivery_latest_time

    this.pickup_date = itinerary.pickup_date
    this.delivery_date = itinerary.delivery_date


    try {
      this.legs = itinerary.legs.map(it_leg => new ItineraryLeg(it_leg))
    }catch(error){
      this.legs = []
    }
  }
}