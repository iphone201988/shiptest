import {Location} from '../location/location.js'
import CoreModel from "../core/core";
import FirestoreCollection from "helpers/firebase/firestore/firestore_collection";
import {CompanyAccountAssociation} from "../company/company";

export class BankPaymentProfileData {

	constructor(data) {
		this.token = data.token || ""
		this.masked_account = data.masked_account || ""
		this.bank_name = data.bank_name || ""
		this.bank_number = data.bank_number || ""
		this.full_name = data.full_name || ""
	}
}

const paymentProfile = (data) =>{

	if (data.type === "bank"){
		return new BankPaymentProfileData(data.payment_profile)
	}else{
		return {}
	}

}

export class ContactProfile{

	constructor(data){
		data = data || {}
		// this.salutation = data.salutation || ""
		this.first_name = data.first_name || ""
		this.last_name = data.last_name || ""
		this.full_name = data.full_name || `${this.first_name} ${this.last_name}`
		this.email = data.email || ""
		this.phone = data.phone || ""
	}
}

export class BusinessProfile{
	constructor(data){
		data = data || {}
		this.business_name = data.business_name || ""
		this.billing_address = new Location(data.billing_address || {})
		this.business_registration_number = data.business_registration_number || ""
		this.business_structure = data.business_structure || ""
	}
}

export class PaymentActions{

    constructor(data) {
        this.make_payment = data.make_payment || false
        this.receive_payment = data.receive_payment || false
  }
}

export default class BillingProfile extends CoreModel{

	static collection = new FirestoreCollection("BillingProfiles", BillingProfile,[])

	constructor(id, data) {
		data = data || {}
		super(id)
		this.label = data.label || ""
		this.business_profile = new BusinessProfile(data.business_profile || {})
		this.contact_profile = new ContactProfile(data.contact_profile || {})
		this.company_account = new CompanyAccountAssociation(data.company_account || {})
		this.payment_actions = new PaymentActions(data.payment_actions || {})
		this.currency = data.currency || ""
		this.type = data.type || ""
		this.associations = data.associations || {}
	}
}



