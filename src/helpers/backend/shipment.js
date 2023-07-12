import BackendHelper from "./index";
import {ShipHaulBackendURL, ShipHaulSAPIBackendURL} from 'settings/endpoints'

const queryString = require('qs');

export default class ShipmentRequest {

  static async createQuoteRequest(quote) {
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "PUT", "/quote_request/",
        {require_authorization: true, app: "shipper", data: quote.compact()})
  }

  static async updateQuoteRequest(quote_id , quote_data) {
    const query_str = queryString.stringify({quote_id: quote_id}, { indices: false })
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "POST", `/quote_request/?${query_str}`,
        {require_authorization: true, app: "shipper", data: quote_data.compact()})
  }

  static async cancelQuoteRequest(quote_id) {
    const query_str = queryString.stringify({quote_id: quote_id}, { indices: false })
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "POST", `/quote_request/?${query_str}`,
        {require_authorization: true, app: "shipper", data: {}})
  }

  static async getQuoteRequest(options, app) {
    const query_str = queryString.stringify(options, { indices: false })
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", `/quote_request/?${query_str}`,
        {require_authorization: true, app: app})
  }

  static async getShipperQuoteRequests(options) {
    const query_str = queryString.stringify(options, { indices: false })
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", `shipper_quote_requests/?${query_str}`,
        {require_authorization: true, app: "shipper"})
  }

  static async getCarrierQuoteRequests(options) {
    const query_str = queryString.stringify(options, { indices: false })
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", `carrier_quote_requests/?${query_str}`,
        {require_authorization: true, app: "carrier"})
  }

  static async createQuoteOffer(quote, auth) {
    return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "PUT", `carrier/quote_offer/`,
        {auth: auth, require_authorization: true, app: "carrier", data: quote.compact()})
  }

  static async getShipperQuoteOffers(options) {
    const query_str = queryString.stringify(options, { indices: false })
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", `shipper_quote_offers/?${query_str}`,
        {require_authorization: true, app: "shipper"})
  }

  static async getCarrierQuoteOffers(options) {
    const query_str = queryString.stringify(options, { indices: false })
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", `carrier_quote_offers/?${query_str}`,
        {require_authorization: true, app: "carrier"})
  }

  static async acceptQuoteOffer(quote_id, billing_profile_id, auth){
    const data = {billing_profile_id: billing_profile_id, quote_offer_id: quote_id}
    return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "POST", `shipper/quote_offer/accept/`,
        {auth: auth, require_authorization: true, app: "shipper", data: data})
  }

  static async createShipment(shipment, app) {
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "PUT", "/shipment/",
        {require_authorization: true, app: app, data: shipment})
  }

  static async getShipments(options, app) {
    const query_str = queryString.stringify(options)
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", `/shipments/?${query_str}`,
        {require_authorization: true, app: app})
  }

  static async getShipperShipments(options, app) {
    const query_str = queryString.stringify(options)
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", `/shipper/shipments/?${query_str}`,
        {require_authorization: true, app: "shipper"})
  }

  static async getCarrierShipments(options) {
    const query_str = queryString.stringify(options)
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", `/carrier/shipments/?${query_str}`,
        {require_authorization: true, app: "carrier"})
  }

  static async getShipment(shipmentId, app) {
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", `/shipment/${shipmentId}`,
        {require_authorization: true, app: app})
  }

  static async assignShipmentDrivers(shipment_id, drivers_assignments, auth){
    let data = {shipment_id: shipment_id, drivers_assignments:drivers_assignments }
    return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "POST", `/shipment/driver/`,
        {auth: auth, require_authorization: true, app: "carrier", data: data})
  }

  static async getLocationTypes() {
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", "/location/types/")
  }

  static async getFreightTypes() {
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", "/freight/types/")
  }

  static async getFreightClasses() {
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", "/freight/classes/")
  }

  static async getPackagingTypes() {
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", "/packaging/types/")
  }

  static async getUnits() {
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", "/units/")
  }

  static async getDeliveryServices() {
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", "/services/delivery/")
  }

  static async getPickupServices() {
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", "/services/pickup/")
  }

  static async getTrailerTypes() {
    return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", "/trailer/types/")
  }

}