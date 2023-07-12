import {callFunction} from "./functions_base";

export const addDevice = (data) => {
    return callFunction("manageResource", {resourceType: 'device', action: 'addDevice', data:data})
}

export const getProviderDevices = (data) => {
    return callFunction("manageResource", {resourceType: 'device', action: 'getProviderDevices', data:data})
}

export const importProviderDevices = (data) => {
    return callFunction("manageResource", {resourceType: 'device', action: 'importProviderDevices', data:data})
}

export const updateDeviceProfile = (data) => {
    return callFunction("manageResource", {resourceType: 'device', action: 'updateDeviceProfile', data:data})
}

export const deleteDevice = (data) => {
    return callFunction("manageResource", {resourceType: 'device', action: 'deleteDevice', data:data})
}

export const trackDeviceData = (data) => {
    return callFunction("manageResource", {resourceType: 'device', action: 'trackDeviceData', data:data})
}

export const trackDevicesData = (data) => {
    return callFunction("manageResource", {resourceType: 'device', action: 'trackDevicesData', data:data})
}

export const associateDevice = (data) => {
    return callFunction("manageResource", {resourceType: 'device', action: 'associateDevice', data:data})
}
