import {callFunction} from "./functions_base";

export const createPaymentMethodSetupIntent = (data) => {
  return callFunction("manageResource", {resourceType: 'payment_method', action: 'createPaymentMethodSetupIntent', data:data})
}

export const cancelPaymentMethodSetupIntent = (data) => {
  return callFunction("manageResource", {resourceType: 'payment_method', action: 'cancelSetupIntent', data:data})
}

export const setupPaymentMethodSession = (data) => {
  return callFunction("manageResource", {resourceType: 'payment_method', action: 'setupPaymentMethodSession', data:data})
}

export const deletePaymentMethod = (data) => {
  return callFunction("manageResource", {resourceType: 'payment_method', action: 'deletePaymentMethod', data:data})
}

