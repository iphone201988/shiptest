import {Location} from '../../location/location.js'
import CoreModel from "../../core/core";
import {getPaymentMethodClass, PaymentMethod} from "./payment_method";
import FirestoreCollection from "helpers/firebase/firestore/firestore_collection";

export class ContactProfile{

	constructor(data){
		data = data || {}
		this.salutation = data.salutation || ""
		this.FullName = data.FullName || ""
		this.email = data.email || ""
		this.phone = data.phone || ""
		this.billingAddress = new Location(data.billingAddress)

	}
}

export default class BillingProfile extends CoreModel{

	static collection = new FirestoreCollection("BillingProfiles", BillingProfile,[])

	constructor(id, data) {
		data = data || {}
		super(id)
		this.label = data.label
		this.contactProfile = new ContactProfile(data.contactProfile)
		this.company = data.company || ""
		this.paymentMethod = getPaymentMethodClass(data.payment_method)
		this.currency = data.currency || ""
	}
}
