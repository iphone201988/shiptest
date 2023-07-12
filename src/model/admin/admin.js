import {Location} from '../location/location.js'
import CoreModel from "../core/core";


export class AdminProfile{

  constructor(profileData){
    profileData = profileData || {}
    this.name = profileData.name || ""
    this.address = new Location(profileData.address || {})
    this.email = profileData.email || ""
    this.phone = profileData.phone || ""
    this.website = profileData.website || ""
    // this.carrier_authority_ids = Array.isArray(profileData.carrier_authority_ids) ?
    //   profileData.carrier_authority_ids.map(carrier_authority_id => new AdminAuthorityId(carrier_authority_id)
    // ) : []
  }
}

export default class Admin extends CoreModel{
  constructor(id, data={}) {
    data = data || {}
    super(id)
    if (data) {
      this.admin_id = id
      this.profile
        = new AdminProfile(data = data.profile)
      this.account_status = data.account_status
      this.freight_types = data.freight_types
    }
  }
}