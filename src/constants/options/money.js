import {UNKNOWN_KEY, UNKNOWN_NAME} from "./general";

export const CURRENCIES_CODES = {
  'CAD': {
    'name': 'currency.code.cad.name',
    'description': 'currency.code.cad.description'
  },
  'USD': {
    'name': 'currency.code.usd.name',
    'description': 'currency.code.usd.description'
  }
}

export function get_currency(key){
  return CURRENCIES_CODES[key || default_currency()]
}

export function default_currency(){
  return 'CAD'
}

export const PAYMENT_TYPES = {
  bank: {
    key: "bank",
    'name': 'payment.type_bank',
    'description': 'payment.ach.description'},
  unknown:{
    'name': UNKNOWN_NAME,
    'description': UNKNOWN_NAME
  }
}

export const PAYMENT_ACTIONS =  {
  'make_payment': {
    name: "payment.make_payment",
    description: "payment.make_payment.description"
  },
  'receive_payment': {
    name: "payment.receive_payment",
    description: "payment.receive_payment.description"
  },
}

export function payment_method(key){
  return PAYMENT_TYPES[key || UNKNOWN_KEY] || PAYMENT_TYPES.unknown
}