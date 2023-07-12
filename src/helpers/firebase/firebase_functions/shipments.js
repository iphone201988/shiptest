import {callFunction} from "./functions_base";

export const trackShipment = (data) => {
    return callFunction("manageResource", {resourceType: 'shipment', action: 'trackShipment', data:data})
}

export const cancelShipment= (data) => {
    return callFunction("manageResource", {resourceType: 'shipment', action: 'cancelShipment', data:data})

}

export const updateShipmentStatus= (data) => {
    return callFunction("manageResource", {resourceType: 'shipment', action: 'updateShipmentStatus', data:data})

}

export const assignShipmentTransportResources = (data) => {
    return callFunction("manageResource", {resourceType: 'shipment', action: 'assignShipmentTransportResources', data:data})
}

export const addShipmentTemplate = (data) => {
    return callFunction("manageResource", {resourceType: 'shipment', action: 'createShipmentTemplate', data:data})

}

export const cancelShipmentTemplate = (data) => {
    return callFunction("manageResource", {resourceType: 'shipment', action: 'cancelShipmentTemplate', data:data})
}