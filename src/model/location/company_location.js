import CoreModel from "../core/core";
import FirestoreCollection from "helpers/firebase/firestore/firestore_collection";
import { Location } from '../location/location.js'

export default class CompanyLocation extends CoreModel {

	static collection = new FirestoreCollection("CompanyLocations", CompanyLocation, [])
	
	constructor(id, data) {
		super(id)
		// console.log('i am data from company_location', data);
		this.data = data || {}
		this.type = "company_location"
		this.account = data.account || {}
		this.company_name = data.company_name || ""
		this.company = data.company || {}
		this.visibility = data.visibility || "private"
		this.company_location = {}
		this.profile = {
			name: data.profile.name || "",
			address: new Location(data.profile.address),
			code: data.profile.code || "",
			tags: data.profile.tags || "",
			private_notes: data.profile.private_notes || "",
			public_notes: data.profile.public_notes || "",
			contact_information: data.profile.contact_information.map(info => {
				return {
					name: info.name,
					phone: info.phone,
					email: info.email,
					type: info.type,
					address: new Location(info.address)
				}
			})
			// contact_information: data.profile.contact_information  
		}
		this.relationship_type = data.relationship_type || ""
		this.week_access = data.week_access || {}
		this.saved = data.saved || false

	}

	isValid = () => {
		//TODO: Implement isValid
		return true
	}

}

