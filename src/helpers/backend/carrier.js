import BackendHelper from './index'
import {ShipHaulBackendURL, ShipHaulSAPIBackendURL} from 'settings/endpoints'
import {ShipHaulAPIBackendURL} from 'settings/endpoints'
import {CARRIER_APP} from "constants/application";

const queryString = require('qs');

export default class CarrierRequest{

  static async getCurrentCarrier(){
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", "carrier/",
        {require_authorization:true, app:"carrier"})
  }

  static async registerCarrier(registrationData){
    return await BackendHelper.fetchBackend(ShipHaulAPIBackendURL, "PUT", "carrier/register/",
        {data: registrationData})
  }

  static async getCarrierProfile(){
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", "carrier/profile/",
        {require_authorization:true, app:CARRIER_APP})
  }

  static async updateCarrierProfile(profileData){
    return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "POST", "carrier/profile/",
        {require_authorization:true, app:"carrier", data: profileData})
  }

  static async getCarrierAuthorities(){
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", "carrier_authorities/",
        {require_authorization:false, app:"carrier"})
  }

  static async getCarrierUsers(options){

    const query_str = queryString.stringify(options, { indices: false })
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", `carrier/users/?${query_str}`,
        {require_authorization:true, app: CARRIER_APP})
  }

  static async createCarrierUser(userData) {
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "PUT", "/carrier/user/",
        {require_authorization: true, app: CARRIER_APP, data: userData})
  }

  static async updateCarrierUser(user_id, userData) {
    const query_str = queryString.stringify({user_id: user_id}, { indices: false })
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "POST", `/carrier/user/?${query_str}`,
        {require_authorization: true, app: CARRIER_APP, data: userData})
  }

  static async deleteCarrierUser(user_id) {
    const query_str = queryString.stringify({user_id: user_id}, { indices: false })
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "DELETE", `/carrier/user/?${query_str}`,
        {require_authorization: true, app: CARRIER_APP})
  }

  static async createVehicle(VehicleData){
    return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "PUT", "/carrier/vehicle",
        {require_authorization: true, app: CARRIER_APP, data: VehicleData})
  }

  static async getCarrierVehicles(options){
    const query_str = queryString.stringify(options, { indices: false })
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", `/carrier/vehicles?${query_str}`,
        {require_authorization: true, app: CARRIER_APP,})
  }


}

