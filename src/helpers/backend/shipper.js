import BackendHelper from './index'
import {
  ShipHaulBackendURL,
  ShipHaulAPIBackendURL,
  ShipHaulSAPIBackendURL
} from 'settings/endpoints'
import {SHIPPER_APP} from 'constants/application'

const queryString = require('qs');

export default class ShipperRequest{

  static async createQuoteRequest(quote, auth) {
    return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "PUT", "shipper/quote/",
      {auth: auth, require_authorization: true, app: "shipper", data: quote})
  }

  static async cancelQuoteRequest(quote_request_id, auth) {

    const query_str = queryString.stringify({quote_id: quote_request_id}, { indices: false })

    return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "DELETE", `shipper/quote/?${query_str}`,
      {auth: auth, require_authorization: true, app: "shipper"})
  }

  static async cancelShipment(shipment_id, auth) {

    const query_str = queryString.stringify({shipment_id: shipment_id}, { indices: false })
    return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "DELETE", `shipper/shipment/?${query_str}`,
      {auth: auth, require_authorization: true, app: "shipper"})
  }

  static async getCurrentShipper(){

    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", "shipper/",
        {require_authorization:true, app:SHIPPER_APP})
  }

  static async registerShipper(registrationData){
    return await BackendHelper.fetchBackend(ShipHaulAPIBackendURL, "PUT", "shipper/register/",
        {data: registrationData})
  }

  static async getShipperProfile(){
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", "shipper/profile/",
        {require_authorization:true, app:SHIPPER_APP})
  }

  static async updateShipperProfile(profileData){
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "POST", "shipper/profile/",
        {require_authorization:true, app:SHIPPER_APP, data: profileData})
  }

  static async getShipperUsers({filter={}}={}){
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", "shipper/users/",
        {require_authorization:true, app:SHIPPER_APP, data: filter})
  }

  static async createShipperUser(userData) {
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "PUT", "shipper/user/",
        {require_authorization: true, app: SHIPPER_APP, data: userData})
  }

  // static async addBillingProfile(BillingProfile) {
  //   return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "PUT", "shipper/billing_profile/",
  //       {require_authorization: true, app: SHIPPER_APP, data: BillingProfile})
  // }
  //
  // static async getBillingProfiles(options) {
  //   const query_str = queryString.stringify(options, { indices: false })
  //   return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "GET", `shipper/billing_profiles/?${query_str}`,
  //       {require_authorization: true, app: SHIPPER_APP})
  // }

}

