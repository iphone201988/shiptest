import Event from "./event";
import FirestoreCollection, {FireQuery} from "helpers/firebase/firestore/firestore_collection";
import {Location} from "../location/location";



export class ResourceAssignments {
  constructor(data){
    //this.shipment = data.shipment
    this.users = data.users
    this.vehicles = data.vehicles
    this.trailers = data.trailers
    //this.assets = data.assets
  }
}


export class ScheduleEventInfoData {
  constructor(data) {
    this.title = data.title
    this.description = data.description
    this.start_time = data.start_time
    this.end_time = data.end_time
    this.location = new Location(data.location)
    this.event_status = data.event_status
    this.visibility = data.visibility
  }
}

export default class ScheduleEvent extends Event {
  static collection = new FirestoreCollection("Events", ScheduleEvent);

  constructor(id = undefined, data) {
    data.type = data.type ? data.type : "resource_schedule" //make this a const variable
    super(id, data)
    try {
      this.carrier = data.carrier ? data.carrier : undefined
      this.info = new ScheduleEventInfoData(data.info);
      this.assignments = new ResourceAssignments(data.assignments);
    } catch (e) {
      console.log('caught', e.message)
      this.invalid = true
    }
  }

  isValid = () => {
    return !this.invalid
  }
}


