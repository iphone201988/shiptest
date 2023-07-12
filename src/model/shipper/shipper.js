import {Location} from '../location/location.js'
import CoreModel from "../core/core";
import FirestoreCollection, {FireQuery} from "helpers/firebase/firestore/firestore_collection";
import CompanyAccount from "../company/company";


export class ShipperProfile{

  constructor(data){
    data = data || {}
    this.name = data.name || ""
    this.address = new Location(data.address || {})
    this.email = data.email || ""
    this.phone = data.phone || ""
    this.website = data.website || ""
    this.fax = data.fax || ""
  }
}

export default class Shipper extends CompanyAccount {

  static collection = new FirestoreCollection("Companies", Shipper,
    [new FireQuery('domain', '==', "shipping")])

  constructor(id, data) {
    data = data || {}
    super(id, data)
    this.profile= new ShipperProfile(data.profile )
  }
}