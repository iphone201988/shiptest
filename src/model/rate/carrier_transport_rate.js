import CoreModel from "../core/core";
import {Location} from "../location/location";
import FirestoreCollection, {FireQuery} from "helpers/firebase/firestore/firestore_collection";
import {RATE_TYPE} from "constants/options/rates";

export class FuelRate{
    constructor(data){
        this.baseline = data.baseline
        this.economy = data.economy
    }
}

export class LinehaulRate {
    constructor(data){
        this.min_linehaul = data.min_linehaul
        this.linehaul =  data.linehaul
        this.is_dynamic =  Boolean(data.is_dynamic) || false
    }
}

export class RateInfo {
    constructor(data){
        this.fuel_rate = data.fuel_rate ? new FuelRate(data.fuel_rate) : {}
        this.linehaul_rate = data.linehaul_rate ? new LinehaulRate(data.linehaul_rate || {}) : {}
    }
}

export default class CarrierTransportRate extends CoreModel {

    static collection = new FirestoreCollection("Rates", CarrierTransportRate, [new FireQuery('rate_type', '==', RATE_TYPE.carrier_transport_rate)])

    constructor(id, data, {expand = true} = {}) {
        data = data || {}
        super(id, data)
        if (data) {
            this.rate_type = RATE_TYPE.carrier_transport_rate
            this.company = this.company || ""
            this.origin = data.origin ? new Location(data.origin || {}) : {}
            this.destination = data.destination ? new Location(data.destination || {}) : {}
            this.rate_info = data.rate_info ? new RateInfo(data.rate_info || {}) : {}
        }
    }
}