import CoreModel from "../core/core";
import FirestoreCollection, { FireQuery, FireIdQuery } from "../../helpers/firebase/firestore/firestore_collection";
import { BaseShipment } from "../shipment/baseShipment";
import Shipment from "../shipment/shipment";
import firebase from "firebase";
const db = firebase.firestore()



export default class Invoice extends CoreModel {

	static collection = new FirestoreCollection("Invoices", Invoice, [])

	constructor(id, data) {
		data = data || {}
		super(id)
		// this.company_account = new CompanyAccountAssociation(data.company_account || {})
		// this.billing_profile = data.billing_profile
		// this.profile = data.profile || {}
		this.amount = data.amount || {}
		this.discount = new ItemDiscountData(data.amount) || {}
		this.invoice_line_items = new InvoiceLineItemData(data.invoice_line_items) || {}
		this.taxes = new TaxData(data.taxes) || {}
		this.dates = data.dates || {}
		this.invoice_status = data.invoice_status || {}
		this.issuer_account = data.issuer_account || {}
		this.payments = data.payments || []
		this.payouts = data.payouts || []
		this.recipient_account = data.recipient_account || {}
		this.shipment_info = data.shipment_info || {}
		this.type = data.type || ''
		this.invoice_number = data.invoice_number || ''
		this.created = data.created || ''

		this.shipmentDetail = data.shipment_info?.id ? db.collection('Shipments').doc(data.shipment_info?.id).get().then((snapshot) => {
			console.log(snapshot.data(), "98765")
			const data = snapshot.data()

			this.shipmentDetails = new Shipment(data.shipment_info?.id, snapshot.data())

		}).catch((e) => console.log(e)) : " "
	}
}

// FireIdQuery
export class ItemDiscountData {
	constructor(data) {
		data = data || {}

		this.amount = data?.amount?.amount || ''
		this.name = data?.discount?.name || ''
		this.description = data?.discount?.description || ''
		this.rate = data?.discount?.rate || ''
		this.discount_id = data?.discount?.id || ''
	}
}

export class InvoiceLineItemData {
	constructor(data) {
		data = data || {}

		this.name = data?.amount?.invoice_line_items?.name || ''
		this.quantity = data?.amount?.invoice_line_items?.quantity || ''
		this.description = data?.amount?.invoice_line_items?.description || ''
		this.rate = data?.amount?.invoice_line_items?.rate || ''
		this.taxes = data?.amount?.invoice_line_items?.taxes || []
		this.item_discounts = new ItemDiscountData(data.amount) || {}
		this.amount_excluding_tax = data?.amount?.invoice_line_items?.amount_excluding_tax || ''
		this.amount_including_tax = data?.amount?.invoice_line_items?.amount_including_tax || ''
		this.type = data?.amount?.invoice_line_items?.type
	}
}



export class TaxData {
	constructor(data) {
		data = data || {}

		this.amount_to_tax = data?.amount?.taxes?.amount_to_tax || ''
		this.amount_with_tax = data?.amount?.taxes?.amount_with_tax || ''
		this.tax_rate = data?.amount?.taxes?.tax_rate || ''
		this.name = data?.amount?.taxes?.name || ''
		this.description = data?.amount?.taxes?.description || ''
		this.tax_amount = data?.amount?.taxes?.tax_amount || ''
	}
}


// xport class InvoiceLineItemData extends DataClass{    name: string;
//     description: string;
//     rate: number;
//     quantity: number;
//     taxes: TaxData[];
//     item_discounts: ItemDiscountData[];
//     amount_excluding_tax: number;
//     amount_including_tax: number;
//     type: string;

// const getRouteLocations = () =>{
// 	if (! data.expanded ){
// 		this.expand()
// 	}
// 	const routeLocations = []
// 	const interconnections = (data.itinerary_sequence || {}).interconnections || []
// 	if (interconnections.length > 0){
// 		interconnections.map((interconnection, index) => {
// 			if (index == 0 ){
// 				routeLocations[0] = interconnection.start_location
// 				routeLocations[1] = interconnection.end_location
// 			}else{
// 				routeLocations.push(interconnection.end_location)
// 			}
// 		})
// 		return routeLocations
// 	} else{
// 		return this.destinations()
// 	}
// }


