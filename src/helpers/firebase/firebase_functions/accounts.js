import {callFunction} from "./functions_base";

export const registerAccount = (data) => {
    return callFunction("manageResource", {resourceType: 'registration', action: 'registerAccount', data:data})
}

