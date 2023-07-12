import CoreModel from "../core/core";
import FirestoreCollection, {FireQuery} from "helpers/firebase/firestore/firestore_collection";
import Asset from "../asset/asset";

export default class ResourceAssignment extends CoreModel {

	static collection = new FirestoreCollection("ResourceAssignments", ResourceAssignment, [])

  constructor(data){
    super()
    if (data.shipment){
        this.shipment = new Resource(data.shipment)
    }else if (data.user){
        this.users = data.users.map(user => new Resource(user))
    }else if (data.assets){
        this.assets = data.assets.map(assets => new Resource(assets))
    }

  }

}

export class Resource extends Asset {

  constructor(data){
    super()
    this.id = data.id
    this.type = data.type
    if (this.type in ['user']){
        this.profile = new UserProfileData(data.profile)
    }else if (this.type in ["shipment"]){
        this.profile = new ShipmentProfile(data.profile)
    }else if (this.type in ["vehicle"]){
        this.profile = new VehicleProfileData(data.profile)
    }else if (this.type in ["trailer"]) {
        this.profile = new TrailerProfileData(data.profile)
    }
  }
}

export class ShipmentProfile extends CoreModel {

  constructor(data){
    super()
    this.origin = new ShipmentLocation(data.origin)
    this.destination = new ShipmentLocation(data.destination)
    this.stops = data.stops.map((stop) => new ShipmentLocation(stop))
    this.trailer_type = data.trailer_type
    this.trailer_length = data.trailer_length
  }

}