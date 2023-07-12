import {callFunction} from "./functions_base";

export const addAsset = (data) => {
    return callFunction("manageResource", {resourceType: 'asset', action: 'addAsset', data:data})
}

export const deleteAsset = (data) => {
    return callFunction("manageResource", {resourceType: 'asset', action: 'deleteAsset', data:data})
}

export const updateAssetProfile = (data) => {
    return callFunction("manageResource", {resourceType: 'asset', action: 'updateAssetProfile', data:data})
}

export const updateAssetStatus = (data) => {
    return callFunction("manageResource", {resourceType: 'asset', action: 'updateAssetStatus', data:data})
}

export const updateAssetActive = (data) => {
    return callFunction("manageResource", {resourceType: 'asset', action: 'updateAssetState', data:data})
}