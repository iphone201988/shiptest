import {callFunction} from "./functions_base";

export const createNotification = (data) => {
    return callFunction("manageResource", {resourceType: 'notification', action: 'createNotification', data:data})

}

export const updateNotification = (data) => {
    return callFunction("manageResource", {resourceType: 'notification', action: 'updateNotification', data:data})
}