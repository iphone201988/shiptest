import {UNKNOWN_KEY, UNKNOWN_NAME} from "./general";

export const UNKNOWN_VALUE = {
  name: UNKNOWN_NAME,
  description: UNKNOWN_NAME,
  color: 'red',
}

export const SHIPPING_SERVICES = {
  'forklift':{
    'name': 'shipment.service.forklift.name',
    'description': 'shipment.services.forklift.description'
  },
  'inside_pickup': {
    'name': 'shipment.service.inside_pickup.name',
    'description': 'shipment.service.inside_pickup.description',
  },
  'liftgate': {
    'name': 'shipment.service.liftgate.name',
    'description': 'shipment.service.liftgate.description',
  },
  'residential_pickup': {
    'name': 'shipment.service.residential_pickup.name',
    'description': 'shipment.service.residential_pickup.description'
  },
  'tarping': {
    'name': 'shipment.service.residential_pickup.name',
    'description': 'shipment.service.residential_pickup.description'
  }
}


export const PICKUP_SERVICES = {
  'inside_pickup': {
    'name': 'shipment.service.inside_pickup.name',
    'description': 'shipment.service.inside_pickup.description',
  },
  'liftgate': {
    'name': 'shipment.service.liftgate.name',
    'description': 'shipment.service.liftgate.description',
  },
  'forklift':{
    'name': 'shipment.service.forklift.name',
    'description': 'shipment.services.forklift.description'
  },
  'residential_pickup': {
    'name': 'shipment.service.residential_pickup.name',
    'description': 'shipment.service.residential_pickup.description'
  }
}


export const DELIVERY_SERVICES = {
  'inside_delivery': {
    'name': 'shipment.service.inside_delivery.name',
    'description': 'shipment.service.inside_delivery.description',
  },
  'liftgate':{
    'name': 'shipment.service.liftgate.name',
    'description': 'shipment.service.liftgate.description'
  },
  'forklift':{
    'name': 'shipment.service.forklift.name',
    'description': 'freight_services.forklift.description'
  },
  'residential_delivery': {
    'name': 'shipment.service.residential_delivery.name',
    'description': 'shipment.service.residential_delivery.description'
  }
}


export const FREIGHT_TYPES = {
  'FTL': {
    'name': 'freight.type.FTL.name',
    'description': 'freight.type.FTL.description'
  },
 // 'LTL': {
 //    'name': 'freight.type.LTL.name',
 //    'description': 'freight.type.LTL.description'
 //  }
}

export const HANDLING_UNITS = {
  'commodity_type':{
    'name':'commodity.type.name',
  },
  destination_location:{
   'name':'commodity.destination.location.name'
  },
  origin_location:{
    'name':'commodity.origin.location.name'
  }
}

export const PACKAGING_TYPES = {
  'not_specified': {
    'name': 'shipment.packaging.not_specified.name',
    'description': 'shipment.packaging.not_specified.description',
    'image': ''
  },
  'pallet': {
    'name': 'shipment.packaging.pallet.name',
    'description': 'shipment.packaging.pallet.description',
    'image': ''
  },
  'crate': {
    'name': 'shipment.packaging.crate.name',
    'description': 'shipment.packaging.crate.description',
    'image': ''
  },
  'box': {
    'name': 'shipment.packaging.box.name',
    'description': 'shipment.packaging.box.description',
    'image': ''
  }
}

export const TRAILER_TYPES = {
  'straight': {'name': 'trailer.type.straight.name'},
  'dry_van': {'name': 'trailer.type.dry_van.name'},
  'flatbed': {'name': 'trailer.type.flatbed.name'},
  'reefer': {'name': 'trailer.type.reefer.name'},
  'container_flatbed': {'name': 'trailer.type.container_flatbed.name'},
  'container_chassis': {'name': 'trailer.type.container_chassis.name'},
  'lowboy': {'name': 'trailer.type.lowboy.name'},
}

export const H3_RADIUS_SIZES = {
  // '1': {'name': '400Km'},
  // '2': {'name': '160Km'},
  '3': {'name': '60Km'},
  // '4': {'name': '20Km'},
  // '5': {'name': '8Km'},
  // '6': {'name': '3Km'},
  // '7': {'name': '1Km'},
}

export const GEOHASH_RADIUS_SIZES = {
  '400': {'name': '400Km'},
  '160': {'name': '160Km'},
  '60': {'name': '60Km'},
  '20': {'name': '20Km'},
  '8': {'name': '8Km'},
  '3': {'name': '3Km'},
  '1': {'name': '1Km'},
}

export const DISTANCE_OPTIONS = {
  'd0': {'name': '0Km'},
  'd1': {'name': '0 to 100Km'},
  'd2': {'name': '100 to 200Km'},
  'd3': {'name': '200 to 500Km'},
  'd4': {'name': '500 to 1000Km'},
  'd5': {'name': '1000 to 2000Km'},
  'd6': {'name': '2000 to 5000Km'},
  'd7': {'name': 'More than 5000Km'},
}

export const TRAILER_LENGTH = {
  '53':  {'name': 'trailer.length.53.name'},
}

export const QUOTE_REQUEST_STATUS_OPENED = 'open'
export const QUOTE_REQUEST_STATUS_OFFER_ACCEPTED = 'offer_accepted'
export const QUOTE_REQUEST_STATUS_REQUEST_CANCELLED = 'cancelled'

export const QUOTE_REQUEST_STATUS = {
  open: {
    key: "open",
    name: 'quote.status.open.name',
    description: 'quote.status.open.description',
    color: "green",
  },
  offer_accepted: {
    key: "offer_accepted",
    name: 'quote.status.offer_accepted.name',
    description: 'quote.status.offer_accepted.description',
    color: "green",
  },
  cancelled: {
    key: "cancelled",
    name: 'quote.status.request_cancelled.name',
    description: 'quote.status.request_cancelled.description',
    color: "red",
  },
  unknown:{
    key: "unknown",
    name: "general.unknown",
    description:"general.unknown",
    color: "gold",
  }
}

export const QUOTE_OFFER_STATUS_PENDING = 'pending'
export const QUOTE_OFFER_STATUS_ACCEPTED = 'accepted'
export const QUOTE_OFFER_STATUS_REJECTED = 'rejected'
export const QUOTE_OFFER_STATUS_CARRIER_CANCELLED = 'cancelled_by_carrier'
export const QUOTE_OFFER_STATUS_SHIPPER_CANCELLED = 'cancelled_by_shipper'
export const QUOTE_OFFER_STATUS_COUNTER_OFFER_PENDING = 'counter_offer_pending'
export const QUOTE_OFFER_STATUS_COUNTER_OFFER_ACCEPTED = 'counter_offer_accepted'
export const QUOTE_OFFER_STATUS_COUNTER_OFFER_REJECTED = 'counter_offer_rejected'

export const QUOTE_OFFER_STATUS = {
  pending: {
     key: "pending",
    'name': 'quote.status.offer_pending.name',
    'description': 'quote_offer.status.offer_pending.description',
    color: "gold",
  },
  accepted: {
    key: "accepted",
    'name': 'quote.status.offer_accepted.name',
    'description': 'quote.status.offer_accepted.description',
    color: "green",
  },
  rejected: {
    key: "rejected",
    'name': 'quote.status.offer_rejected.name',
    'description': 'quote.status.request_cancelled.description',
    color: "red",
  },
  cancelled_by_carrier: {
    key: "cancelled_by_carrier",
    'name': 'quote.status.counter_offer_pending.name',
    'description': 'quote.status.counter_offer_pending.description',
    color: "red",
  },
  cancelled_by_shipper: {
    key: "cancelled_by_shipper",
    'name': 'quote.status.counter_offer_accepted.name',
    'description': 'quote.status.counter_offer_accepted.description',
    color: "red",
  },
  counter_offer_pending: {
    key: "counter_offer_pending",
    'name': 'quote.status.counter_offer_rejected.name',
    'description': 'quote.status.counter_offer_rejected.description',
    color: "gold",
  },
  counter_offer_accepted: {
    key: "counter_offer_accepted",
    'name': 'quote.status.offer_cancelled.name',
    'description': 'quote_offer.status.offer_cancelled.description',
    color: "green",
  },
  counter_offer_rejected: {
    key: "counter_offer_rejected",
    'name': '"quote.status.offer_rejected.name"',
    'description': 'quote_offer.status.offer_rejected.description',
    color: "red",
  },
  unknown:{
    key: "unknown",
    'name': UNKNOWN_NAME,
    'description': UNKNOWN_NAME,
    color: "gold",
  }
}

export const QUOTE_OFFER_STATUS_HISTORY = {
  accepted: {
    key: "accepted",
    'name': 'quote.status.offer_accepted.name',
    'description': 'quote.status.offer_accepted.description',
    color: "green",
  },
  rejected: {
    key: "rejected",
    'name': 'quote.status.offer_rejected.name',
    'description': 'quote.status.request_cancelled.description',
    color: "red",
  },
  cancelled_by_carrier: {
    key: "cancelled_by_carrier",
    'name': 'quote.status.counter_offer_pending.name',
    'description': 'quote.status.counter_offer_pending.description',
    color: "red",
  },
  cancelled_by_shipper: {
    key: "cancelled_by_shipper",
    'name': 'quote.status.counter_offer_accepted.name',
    'description': 'quote.status.counter_offer_accepted.description',
    color: "red",
  },
  counter_offer_accepted: {
    key: "counter_offer_accepted",
    'name': 'quote.status.offer_cancelled.name',
    'description': 'quote_offer.status.offer_cancelled.description',
    color: "green",
  },
  counter_offer_rejected: {
    key: "counter_offer_rejected",
    'name': "quote.status.offer_rejected.name",
    'description': 'quote_offer.status.offer_rejected.description',
    color: "red",
  },
  unknown:{
    key: "unknown",
    'name': UNKNOWN_NAME,
    'description': UNKNOWN_NAME,
    color: "gold",
  }
}

export const SHIPMENT_STATUS_PENDING = 'pending'
export const SHIPMENT_STATUS_STARTED = 'started'
export const SHIPMENT_STATUS_PICKEDUP = 'pickedUp'
export const SHIPMENT_STATUS_DELIVERED = 'delivered'
export const SHIPMENT_STATUS_ONHOLD = 'onHold'
export const SHIPMENT_STATUS_CANCELLED = 'cancelled'
export const SHIPMENT_STATUS_ISSUE = 'issue'
export const SHIPMENT_STATUS_COMPLETED = 'completed'
// pending, started, ArrivedAtPickup, pickedUp, arrivedAtDelivery, delivered
export const SHIPMENT_STATUS = {
  pending: {
    key: "pending",
    'name': 'shipment.status.pending.name',
    'description': 'shipment.status.pending.description',
    color: "gold",
  },
  started: {
    key: "started",
    'name': 'shipment.status.started.name',
    'description': 'shipment.status.started.description',
    color: "green",
  },
  pickedUp: {
    key: "pickedUp",
    'name': 'shipment.status.pickedup.name',
    'description': 'shipment.status.pickedup.description',
    color: "green",
  },
  delivered: {
    key: "delivered",
    'name': 'shipment.status.delivered.name',
    'description': 'shipment.status.delivered.description',
    color: "green",
  },
  onHold: {
    key: "onHold",
    'name': 'shipment.status.onhold.name',
    'description': 'shipment.status.onhold.description',
    color: "gold",
  },
  cancelled: {
    key: "cancelled",
    'name': 'shipment.status.cancelled.name',
    'description': 'shipment.status.cancelled.description',
    color: "red",
  },
  issue: {
    key: "issue",
    'name': 'shipment.status.issue.name',
    'description': 'shipment.status.issue.description',
    color: "red",
  },
  completed: {
    key: "delivered",
    'name': 'shipment.status.delivered.name',
    'description': 'shipment.status.delivered.description',
    color: "green",
  },
  unknown:{
    key: "",
    'name': UNKNOWN_NAME,
    'description': UNKNOWN_NAME,
    color: "gold",
  }
}

export const SHIPMENT_ACTIVE_STATUS = [SHIPMENT_STATUS.pending.key, SHIPMENT_STATUS.started.key,
  SHIPMENT_STATUS.onHold.key ,SHIPMENT_STATUS.issue.key, SHIPMENT_STATUS.onHold.key]

export const SHIPMENT_HISTORY_STATUS = [SHIPMENT_STATUS.cancelled.key, SHIPMENT_STATUS.delivered.key]

export const SHIPMENT_STATE = {
  quote_request: {
    key: "quote_request",
    name: 'shipment.state.quote_request.name',
    description: 'shipment.state.quote_request.description',
  },
  quote_offer: {
    key: "quote_offer",
    name: 'shipment.state.quote_offer.name',
    description: 'shipment.state.quote_offer.description',
  },
  shipment: {
    key: "shipment",
    name: 'shipment.state.shipment.name',
    description: 'shipment.state.shipment.description',
  },
  unknown: {
    key: "unknown",
    name: 'general.unknown',
    description: 'general.unknown',
  },
  shipment_template: {
    key: "shipment_template",
    name: 'shipment.state.shipment_template.name',
    description: 'shipment.state.shipment_template.description'
  }
}

export const SHIPPER_SHIPMENTS_ACTIONS = {
  details: {
    key: "details",
    name: 'shipment.actions.details',
    description: 'shipment.state.quote_request.description',
  },
  cancel: {
    key: "cancel",
    name: 'shipment.actions.cancel',
    description: 'shipment.state.quote_offer.description',
  }
}


export function get_freight_type(key){
  return FREIGHT_TYPES[key] || UNKNOWN_VALUE
}

export function get_trailer_type(key){
  return TRAILER_TYPES[key] || UNKNOWN_VALUE
}

export function get_trailer_length(key){
  return TRAILER_LENGTH[key] || UNKNOWN_VALUE
}

export function get_packaging_type(key){
  return PACKAGING_TYPES[key] || UNKNOWN_VALUE
}

export function quote_request_status(key){
  return QUOTE_REQUEST_STATUS[key] || UNKNOWN_VALUE
}

export function quote_offer_status(key){
  return QUOTE_OFFER_STATUS[key || UNKNOWN_KEY] || UNKNOWN_VALUE
}

export function shipment_status(key){
  return SHIPMENT_STATUS[key || UNKNOWN_KEY] || UNKNOWN_VALUE
}

export function shipment_handling_units(key){
  return HANDLING_UNITS[key || UNKNOWN_KEY] || UNKNOWN_VALUE
}