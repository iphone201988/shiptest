import {hereAPI} from './hereApi'
import moment from 'moment';
import {hereConfig} from '../config'
import {ShipmentLocation} from "model/shipment/baseShipment";

var nanoid = require('nanoid');


class WayPoint{

  constructor(shipment_location, addConstraints=false, WayPointDestinationMap={}){
    this.id = shipment_location.id || nanoid(5)
    const geo_location = shipment_location.location.displayPosition

    if (geo_location.geopoint && geo_location.geopoint.latitude && geo_location.geopoint.longitude){
      this.coordinates = geo_location.geopoint
    }else if (geo_location.latitude && geo_location.longitude){
      this.coordinates = {latitude: geo_location.latitude , longitude: geo_location.longitude}
    } else {
      throw new Error("Waypoint Missing getCoordinates")
    }
    this.coordinates_str = `${this.coordinates.latitude},${this.coordinates.longitude}`

    this.constraints = addConstraints ? this.SequencesWaypointConstraintsStr(shipment_location, WayPointDestinationMap):  ""
  }

  SequencesWaypointConstraintsStr(shipment_location, WayPointDestinationMap={}) {

    let constraints = []
    // constraints = constraints.concat((shipment_location.pickups || []).map(pickup => {return `pickup:${pickup}`}))
    // constraints = constraints.concat((shipment_location.drops || []).map(drop => {return `drop:${drop},value:10000`}))
    let befores = [];

    (shipment_location.before || []).forEach(before => {
      const index = WayPointDestinationMap[before]
      if (index !== undefined){befores.push(`destination${index}`)}
    })

    if (befores.length > 0){
      constraints = constraints.concat(`before:${befores.join(",")}`)
    }

    return constraints.join(";")
  }

  ConstraintsDataToConstraintString(constraints){
    return ""
  }

  toString(){
    const constraints = this.constraints ? ";" + this.constraints : ""
    return `${this.id};${this.coordinates_str}${constraints}`
  }

}


class WaypointsSequences extends hereAPI{

  jsonResponse(){
  }

  addDefaultParams(params) {

    if (!params.mode){
      const TYPES = ["fastest", "shortest"]
      const type = params.type in TYPES ? params.type : "fastest"
      const transportation = "truck"
      params.mode = `${type};${transportation};traffic:disabled`
    }
    params.height = params.height ? params.height :  4.15
    params.width = params.width ? params.width : 2.6
    params.length = params.length ? params.length : 23
    params.hasTrailer = params.hasTrailer ? params.hasTrailer : true
    params.length = params.length ? params.length : 16
    params.width = params.width ? params.width : 2.6
    params.limitedWeight = params.limitedWeight ? params.limitedWeight : 53
    params.restTimes = params.restTimes ? params.restTimes  : "durations:14400,300,46800,28800;serviceTimes:rest"
    params.trailerWeight = params.trailerWeight ? params.trailerWeight  : 19.95
    params.speedProfile="fast"
    params.driverCost=23
    params.vehicleCost=0.23
  }

  url(endpoint, params){

    let path = ""
    if (endpoint === "findsequence"){path = "findsequence.json"}
    else if (endpoint === "findpickups"){path = "findpickups.json"}
    else {throw new Error("WaypointsSequences invalid endpoint")}

    const qs_params = this.query_str(params)

    return `${this.apiUrls.waypoint_sequences}${path}${qs_params}`
  }

  WaypointTodestinationIndexMap(destinations){
    let destinationMap = {}
    destinations.forEach((destination, index) => {
      destinationMap[destination.id] = index
    })
    return destinationMap
  }

  addWaypointsParam(params, start, destinations, end=undefined){
    params.start = (new WayPoint(start)).toString()
    if (end instanceof ShipmentLocation){
      params.end = (new WayPoint(end)).toString()
    }
    const WayPointDestinationMap = this.WaypointTodestinationIndexMap(destinations)
    destinations.forEach((destination, index) => {
      params["destination"+(index)] = (new WayPoint(destination, true, WayPointDestinationMap)).toString()
    })
  }

  async findSequences(params, start, stops, end=undefined){

    try{
      this.addDefaultParams(params)
      let earliest_time = moment.unix(start.access_time.earliest_time).utc();

      params["departure"] = earliest_time.format()

      this.addWaypointsParam(params, start, stops, end)
      const url = this.url("findsequence", params)
      return this.fetch(url, {method: "GET"}).then(response => response.results)
    } catch (e) {
      console.error(e)
      throw e
    }


  }

  findPickups(params, start, stops, end=undefined) {

    this.addDefaultParams(params)
    this.addWaypointsParam(params, start, stops, end)
    const url = this.url("findpickups", params)

    return this.fetch(url, {method: "GET"}).then(response => response.results)
  }
}

export default new WaypointsSequences(hereConfig)