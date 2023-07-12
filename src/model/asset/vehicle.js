import Asset from "./asset";
import FirestoreCollection, {FireQuery} from "helpers/firebase/firestore/firestore_collection";
import {ASSET_TYPE} from "constants/options/assets";

export class VehicleProfile{
  constructor(data){
    this.name = data.name || ""
    this.color = data.color || ""
    this.vin = data.vin || ""
    this.make = data.make || ""
    this.model = data.model || ""
    this.year = data.year || ""
    this.class = data.class || ""
    this.license_plate_state = data.license_plate_state || ""
    this.license_plate_number = data.license_plate_number || ""
    this.fuel_type = data.fuel_type || ""
  }
}

export default class Vehicle extends Asset {

    static collection = new FirestoreCollection("Assets", Vehicle,
        [new FireQuery('asset_type', '==', ASSET_TYPE.vehicle.key)])

    constructor(id=undefined, data){
  	super(id, data)
    this.asset_type = ASSET_TYPE.vehicle.key
   try{
      this.profile = data.profile ? new VehicleProfile(data.profile) : {}
    }catch (e) {
     this.invalid = true
   }
  }
}
