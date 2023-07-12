import {BaseShipment} from "./baseShipment";
import {SHIPMENT_STATE} from "constants/options/shipping";
import FirestoreCollection, {FireQuery} from "helpers/firebase/firestore/firestore_collection";

export default class QuoteOffer extends BaseShipment{

  static collection = new FirestoreCollection("Shipments", QuoteOffer,
      [new FireQuery('type', '==', SHIPMENT_STATE.quote_offer.key)])

  constructor(id, data){
    data = data || {}
    super(id, data)
    this.type = SHIPMENT_STATE.quote_offer.key
    this.quote_request = data.quote_request || ""

  }

  a = () => {

  }

}

export class QuoteOfferRef {
  constructor(data){
    this.carrier = data.carrier
    this.quote_offer =  data.quote_offer
  }
}