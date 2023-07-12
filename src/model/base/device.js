import CoreModel from "../core/core";
import FirestoreCollection from "helpers/firebase/firestore/firestore_collection";

export class TrackingProfile{
	constructor(data){
		data = data || {}
		this.report_period = data.report_period || ""
	}
}

export class ProviderData{
    constructor(data) {
		data = data || {}
        this.provider = data.provider || ""
        this.device_id = data.device_id || ""
        this.device_identifier = data.device_identifier || ""
    }
}

export class CompanyAccount{
    constructor(data){
		data = data || {}
        this.id = data.id || ""
    }
}

export class DeviceProfile{
	constructor(data){
		data = data || {}
		this.name = data.name || ""
        this.model = data.model || ""
        this.brand = data.brand || ""
        this.vendor = data.vendor || ""
        this.provider = new ProviderData(data.provider)
	}
}

export class DeviceAssociations{
    constructor(data) {
		data = data || {}
        this.asset = data.asset || "";
    }
}

export default class Device extends CoreModel {

	static collection = new FirestoreCollection("Devices", Device,[])

	constructor(id, data){
		data = data || {}
		super(id)
		this.profile = new DeviceProfile(data.profile)
		// this.tracking_profile = new TrackingProfile(data.tracking_profile)
		this.associations = new DeviceAssociations(data.associations)
		this.company_account = new CompanyAccount(data.company)
		this.device_type = data.device_type || ""
		this.status = data.status || ""
		// this.track_data = data.track_data || {}
		// this.last_report_date = TimeStamp(data.last_report_date)
	}
}