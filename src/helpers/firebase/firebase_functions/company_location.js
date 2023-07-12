import {callFunction} from "./functions_base";


export const addCompanyLocation = (data) => {
    return callFunction("manageResource", {resourceType: 'company_location', action: 'addCompanyLocation', data:data})
}

export const updateCompanyLocation = (data) => {
    return callFunction("manageResource", {resourceType: 'company_location', action: 'updateCompanyLocation', data:data})
}

export const deleteCompanyLocation = (data) => {
    return callFunction("manageResource", {resourceType: 'company_location', action: 'deleteCompanyLocation', data:data})
}

