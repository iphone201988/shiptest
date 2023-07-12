import Asset from "./asset";
import FirestoreCollection, {FireQuery} from "helpers/firebase/firestore/firestore_collection";
import {ASSET_TYPE} from "constants/options/assets";

export class TrailerProfile{
	constructor(data){
		this.name = data.name || ""
		this.trailer_type = data.trailer_type
		this.year = data.year || ""
		this.make = data.make || ""
		this.model = data.model || ""
		this.vin = data.vin || ""
		this.license_plate_state = data.license_plate_state || ""
		this.license_plate_number = data.license_plate_number || ""
		this.length = data.length || 0
		this.width = data.width || 0
		this.height = data.height || 0
		this.weight_capacity = data.weight_capacity || 1
		// this.rear_door_width= data.rear_door_width
		// this.rear_door_height= data.rear_door_height
		// this.capacity= data.capacity
		// this.max_weight= data.max_weight
		this.axles= data.axles || 2
		this.color= data.color || ""

	}
}

export default class Trailer extends Asset {

	static collection = new FirestoreCollection("Assets", Trailer,
		[new FireQuery('asset_type', '==', ASSET_TYPE.trailer.key)])

	constructor(id=undefined, data){
		super(id, data)
		this.asset_type = ASSET_TYPE.trailer.key
		try{
			this.profile = data.profile ? new TrailerProfile(data.profile) : {}
		}catch (e) {
			this.invalid = true
		}
	}
}
