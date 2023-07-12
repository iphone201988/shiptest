import {callFunction} from "./functions_base";

export const addQuoteRequest = (data) => {
    return callFunction("manageResource", {resourceType: 'shipment', action: 'createQuoteRequest', data:data})
}

export const cancelQuoteRequest = (data) => {
    return callFunction("manageResource", {resourceType: 'shipment', action: 'cancelQuoteRequest', data:data})
}
