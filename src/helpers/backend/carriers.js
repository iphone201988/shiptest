import BackendHelper from './index'
import {ShipHaulBackendURL, ShipHaulAPIBackendURL, ShipHaulSAPIBackendURL} from 'settings/endpoints'
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

  static async updateCarrierProfile(profileData, auth){
    return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "POST", "carrier/profile/",
        {auth:auth, app:"carrier", data: profileData})
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

  static async createCarrierUser(userData, auth) {
    return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "PUT", "/carrier/user/",
        {auth: auth, require_authorization: true, app: CARRIER_APP, data: userData})
  }

  static async updateCarrierUser(userId, userData, auth) {

    const query_str = queryString.stringify({user: userId}, { indices: false })
    return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "POST", `/carrier/user/?${query_str}`,
        {auth:auth, require_authorization: true, app: CARRIER_APP, data: userData})
  }

  static async deleteCarrierUser(user, auth) {
    const query_str = queryString.stringify({user: user}, { indices: false })
    return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "DELETE", `/carrier/user/?${query_str}`,
        {auth:auth, require_authorization: true, app: CARRIER_APP})
  }

  static async createVehicle(VehicleData, auth){
    return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "PUT", "/carrier/vehicle/",
        {auth:auth, require_authorization: true, app: CARRIER_APP, data: VehicleData})
  }

  static async createCarrierAsset(AssetData, auth){
    return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "PUT", "/carrier/asset/",
      {auth:auth, require_authorization: true, app: CARRIER_APP, data: AssetData})
  }

  static async updateCarrierAssetStatus(AssetData, auth){
    return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "POST", "/carrier/asset/status",
      {auth:auth, require_authorization: true, app: CARRIER_APP, data: AssetData})
  }

  static async updateCarrierAsset(assetId, AssetData, auth){
    const query_str = queryString.stringify({asset_id: assetId}, { indices: false })
    return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "POST", `/carrier/asset/?${query_str}`,
      {auth:auth, require_authorization: true, app: CARRIER_APP, data: AssetData})
  }

  static async deleteCarrierAsset(assetId, auth) {
    const query_str = queryString.stringify({asset_id: assetId}, { indices: false })
    return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "DELETE", `/carrier/asset/?${query_str}`,
      {auth:auth, require_authorization: true, app: CARRIER_APP})
  }

  static async getCarrierVehicles(options){
    const query_str = queryString.stringify(options, { indices: false })
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", `/carrier/vehicles?${query_str}`,
        {require_authorization: true, app: CARRIER_APP,})
  }

  static async createCarrierDevice(deviceData, auth){
    return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "PUT", "/carrier/device/",
      {auth:auth, require_authorization: true, app: CARRIER_APP, data: deviceData})
  }


}

