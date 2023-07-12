import {callFunction} from "./functions_base";

export const addUser = (data) => {
    return callFunction("manageResource", {resourceType: 'user', action: 'addUser', data:data})
}

export const addAdminUser = (data) => {
    return callFunction("manageResource", {resourceType: 'user', action: 'addAdminUser', data:data})
}

export const disableUser = (data) => {
    return callFunction("manageResource", {resourceType: 'user', action: 'disableUser', data:data})
}

export const updateUser = (data) => {
    return callFunction("manageResource", {resourceType: 'user', action: 'updateUser', data:data})
}

export const verifyEmail = (data) => {
    return callFunction("manageResource", {resourceType: 'user', action: 'verifyUserEmail', data:data})
}

export const forgotUserPassword = (data) => {
    return callFunction("manageResource", {resourceType: 'user', action: 'forgotUserPassword', data:data})
}

export const assignUserResources = (data) => {
    return callFunction("manageResource", {resourceType: 'user', action: 'assignUserResources', data:data})
}
