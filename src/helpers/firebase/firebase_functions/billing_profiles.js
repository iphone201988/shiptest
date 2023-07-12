import {callFunction} from "./functions_base";

export const addBillingProfile = (data) => {
    return callFunction("manageResource", {resourceType: 'billing_profile', action: 'addBillingProfile', data:data})
}

export const deleteBillingProfile = (data) => {
    return callFunction("manageResource", {resourceType: 'billing_profile', action: 'deleteBillingProfile', data:data})

}

export const updateBillingProfile = (data) => {
    return callFunction("manageResource", {resourceType: 'billing_profile', action: 'updateBillingProfile', data:data})

}

export const getVopayURL = (data) => {
    //TODO: to  remove
    return callFunction("getVopayURL", data)
}