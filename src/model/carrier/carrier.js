import {Location} from '../location/location.js'
import CarrierAuthorityId from "./authority/carrier"
import CompanyAccount from "../company/company";
import FirestoreCollection, {FireQuery} from "helpers/firebase/firestore/firestore_collection";


export class CarrierProfile{

  constructor(profileData){
    profileData = profileData || {}
    this.name = profileData.name || ""
    this.address = new Location(profileData.address || {})
    this.email = profileData.email || ""
    this.phone = profileData.phone || ""
    this.website = profileData.website || ""
    this.carrier_authority_ids = Array.isArray(profileData.carrier_authority_ids) ?
      profileData.carrier_authority_ids.map(carrier_authority_id => new CarrierAuthorityId(carrier_authority_id)
    ) : []
  }
}


export default class Carrier extends CompanyAccount{

  static collection = new FirestoreCollection("Companies", Carrier,
    [new FireQuery('domain', '==', "carrier")])

  constructor(id, data={}) {
    data = data || {}
    super(id, data)
    this.profile = new CarrierProfile(data.profile)
  }
}