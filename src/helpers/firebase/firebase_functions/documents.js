import {callFunction} from "./functions_base";

export const addDocument = (data) => {
    return callFunction("manageResource", {resourceType: 'document', action: 'addDocument', data:data})
}

export const updateDocument = (data) => {
    return callFunction("manageResource", {resourceType: 'document', action: 'updateDocument', data:data})
}

export const updateVehicleRegistrationDocument = (data) => {
    return callFunction("updateVehicleRegistrationDocument",  {id: data.id, data: data})
}

