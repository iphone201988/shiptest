import ShipmentRequest from "helpers/backend/shipment";
import {handle_backend_response} from "helpers/error/error_handler";
import Shipment from "model/shipment/shipment";
import {SimpleCollectionRequest} from "helpers/backend/request";
import QuoteRequest from "model/shipment/quote_request";
import QuoteOffer from "model/shipment/quote_offer";
import ShipperRequest from "helpers/backend/shipper";

export default class ShipmentService{

  static createQuoteRequest = (quote, auth) => {
    return ShipmentRequest.createQuoteRequest(quote, auth)
        .then(res => handle_backend_response(res))
        .catch(e=> console.log(e.message))
  }

  static updateQuoteRequest = (quote_id, quote_data) => {
    return ShipmentRequest.updateQuoteRequest(quote_id, quote_data)
        .then(res => handle_backend_response(res))
        .catch(e=> console.log(e.message))
  }

  static cancelQuoteRequest = (quote_id) => {
    return ShipperRequest.cancelQuoteRequest(quote_id)
        .then(res => handle_backend_response(res))
        .catch(e=> console.log(e.message))
  }

  static getShipperQuoteRequests = (options) => {
    return ShipmentRequest.getShipperQuoteRequests(options, "shipper")
        .then(res => handle_backend_response(res))
        .then(res => res.json())
        .then(quotes => quotes.map(data => new QuoteRequest(data)))
        .catch(e=> console.log(e.message))
  }

  static getCarrierQuoteRequests = (options) => {
    return ShipmentRequest.getCarrierQuoteRequests(options, "carrier")
        .then(res => handle_backend_response(res))
        .then(res => res.json())
        .then(quotes => quotes.map(data => new QuoteRequest(data)))
        .catch(e=> console.log(e.message))
  }

  static createQuoteOffer = (quote, auth) => {
    return ShipmentRequest.createQuoteOffer(quote, auth)
        .then(res => handle_backend_response(res))
        .catch(e=> {console.log(e.message); throw e})
  }

  static getShipperQuoteOffers(options) {
    return ShipmentRequest.getShipperQuoteOffers(options)
        .then(res => handle_backend_response(res))
        .then(res => res.json())
        .then(quotes => quotes.map(data => new QuoteOffer(data)))
        .catch(e=> console.log(e.message))
  }

  static getCarrierQuoteOffers(optionns) {
    return ShipmentRequest.getCarrierQuoteOffers(optionns)
        .then(res => handle_backend_response(res))
        .then(res => res.json())
        .then(quotes => quotes.map(data => new QuoteOffer(data)))
        .catch(e=> console.log(e.message))
  }

  static acceptQuoteOffer(quote_id, billing_profile_id, auth) {
    return ShipmentRequest.acceptQuoteOffer(quote_id, billing_profile_id, auth)
        .then(res => handle_backend_response(res))
        .catch(e=> {console.log(e.message); throw  e})
  }


  static createShipment = (shipment) => {
    return ShipmentRequest.createShipment(shipment, "shipper")
        .then(res => handle_backend_response(res))
        .then(res => res.json())
        .then(quotes => quotes.map(data => new Shipment(data)))
        .catch(e=> console.log(e.message))
  }

  static getShipments = (option, app) => {
    return ShipmentRequest.getShipments(option, app).then(res =>handle_backend_response(res))
        .then(res => res.json())
        .then(shipments_data => shipments_data.map(data => new Shipment(data)))
        .catch(e=> console.log(e.message))
  }

  static getShipperShipments = (option) => {
    return ShipmentRequest.getShipperShipments(option).then(res =>handle_backend_response(res))
        .then(res => res.json())
        .then(shipments_data => shipments_data.map(data => new Shipment(data)))
        .catch(e=> console.log(e.message))
  }

  static getCarrierShipments = (option) => {
    return ShipmentRequest.getCarrierShipments(option).then(res =>handle_backend_response(res))
        .then(res => res.json())
        .then(shipments_data => shipments_data.map(data => new Shipment(data)))
        .catch(e=> console.log(e.message))
  }

  static getShipment = (shipment_id) => {
    return ShipmentRequest.getShipment().then(res => handle_backend_response(res))
        .then(res => res.json())
        .then(shipments_data => shipments_data.map(data => new Shipment(data)))
        .catch(e=> console.log(e.message))
  }

  static assignShipmentDrivers = (shipment_id, drivers_assignments, auth)  => {
    return ShipmentRequest.assignShipmentDrivers(shipment_id, drivers_assignments, auth).then(res => handle_backend_response(res))
        .then(res => res.json())
        .catch(e=> {console.log(e.message); throw e;})
  }

  static getFreightTypes = ({keyValList=false}={}) => {
    return SimpleCollectionRequest(ShipmentRequest.getFreightTypes, {keyValList:keyValList})
  }

  static getFreightClasses = ({keyValList=false}={}) => {
    return SimpleCollectionRequest(ShipmentRequest.getFreightClasses, {keyValList:keyValList})
  }

  static getPackagingTypes = ({keyValList=false}={}) => {
    return SimpleCollectionRequest(ShipmentRequest.getPackagingTypes, {keyValList:keyValList})
  }

  static getTrailerTypes = ({keyValList=false}={}) => {
    return SimpleCollectionRequest(ShipmentRequest.getTrailerTypes, {keyValList:keyValList})
  }

  static getLocationTypes = ({keyValList=false}={}) => {
    return SimpleCollectionRequest(ShipmentRequest.getLocationTypes, {keyValList:keyValList})
  }

  static getDeliveryServices = ({keyValList=false}={}) => {
    return SimpleCollectionRequest(ShipmentRequest.getDeliveryServices, {keyValList:keyValList})
  }

  static getPickupServices = ({keyValList=false}={}) => {
    return SimpleCollectionRequest(ShipmentRequest.getPickupServices, {keyValList:keyValList})
  }

}
