import {PAYMENT_METHODS} from "constants/options/money"
import CoreModel from "../core/core";
import FirestoreCollection from "../../helpers/firebase/firestore/firestore_collection";
import {CompanyAccountAssociation} from "../company/company";
import {BusinessProfile, ContactProfile, PaymentActions} from "./billing_profile";

// export class PaymentMethod {
// 	constructor(data) {
// 		data = data || {}
// 		this.type =  data.type
// 		this.account_name = data.account_name || ""
// 		this.token = data.token || ""
// 		this.status = data.status
// 	}
// }
//
// export function paymentMethod(data){
//
// 	if (data.type === PAYMENT_METHODS.ach.key){
// 		return new FullACHInfo(data)
// 	}else{
// 		return {}
// 	}
// }
//
// export class CreditCardInfo extends PaymentMethod {
// 	constructor(data){
// 		super(data)
// 		this.type = "credit_card"
// 		this.card_type = data.card_type
// 		this.expiration_month = data.expiration_month
// 		this.expiration_year = data.expiration_year
// 	}
// }
//
// export class FullCreditCardInfo extends CreditCardInfo{
// 	constructor(data){
// 		super(data)
// 		this.number = data.number
// 		this.csv = data.csv
// 	}
// }
//
// export class ACHInfo extends PaymentMethod {
// 	constructor(data){
// 		super(data)
// 		this.type = PAYMENT_METHODS.ach.key
// 	}
// }
//
// export class FullACHInfo extends ACHInfo {
// 	constructor(data){
// 		super(data)
// 		this.type = PAYMENT_METHODS.ach.key
// 		this.account_number = data.account_number
// 		this.routing_number = data.routing_number
// 	}
// }
//

export default class PaymentMethod extends CoreModel{

	static collection = new FirestoreCollection("PaymentMethods", PaymentMethod,[])

	constructor(id, data) {
		data = data || {}
		super(id)
		this.company_account = new CompanyAccountAssociation(data.company_account || {})
		this.billing_profile = data.billing_profile
		this.profile = data.profile || {}
	}
}

