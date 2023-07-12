import {callFunction} from "./functions_base";


export const addIntegration = (data) => {
    return callFunction("manageResource", {resourceType: 'integration', action: 'addIntegration', data:data})
}

export const getIntegrationEntities = (data) => {
    return callFunction("manageResource", {resourceType: 'integration', action: 'getIntegrationEntities', data:data})
}

export function importIntegrationEntities(data) {
    return callFunction("manageResource", {resourceType: 'integration', action: 'importIntegrationEntities', data:data})
}

export const updateIntegration = (data) => {
    return callFunction("manageResource", {resourceType: 'integration', action: 'updateIntegration', data:data})
}

export const updateIntegrationCredential = (data) => {
    return callFunction("manageResource", {resourceType: 'integration', action: 'updateIntegrationCredentials', data:data})
}

