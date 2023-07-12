import {callFunction} from "./functions_base";

export const createQuoteOffer = (data) => {
    return callFunction("manageResource", {resourceType: 'shipment', action: 'createQuoteOffer', data:data})
}

export const acceptQuoteOffer = (data) => {
    return callFunction("manageResource", {resourceType: 'shipment', action: 'acceptQuoteOffer', data:data})
}