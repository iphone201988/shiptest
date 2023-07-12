import {callFunction} from "./functions_base";

export const addRate = (data) => {
    return callFunction("addRate", data)
}

export const updateRate = (data) => {
    return callFunction("updateRate", data)
}

export const deleteRate = (data) => {
    return callFunction("deleteRate", data)
}


