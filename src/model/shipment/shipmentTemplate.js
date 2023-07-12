import {QuoteOfferRef} from "./quote_offer";
import {BaseShipment} from "./baseShipment";
import {SHIPMENT_STATE} from "constants/options/shipping";
import FirestoreCollection, {FireQuery} from "helpers/firebase/firestore/firestore_collection";

export default class ShipmentTemplate extends BaseShipment{

  static collection = new FirestoreCollection("Shipments", ShipmentTemplate,
      [new FireQuery('type', '==', SHIPMENT_STATE.shipment_template.key)])

  constructor(id, data, options={}){
    data = data || {}
    super(id, data, options)
    this.type = SHIPMENT_STATE.shipment_template.key
    this.quote_offers = Array.isArray(data.quote_offers) ?
      (data.quote_offers).map(qo => new QuoteOfferRef(qo)) : []
  }
}

