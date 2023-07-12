import {callFunction} from "helpers/firebase/firebase_functions/functions_base";

export const addIntegration = (data) => {
    return callFunction("addIntegration", data)
}

export function importIntegrationEntities(data) {
    console.log('****', data);
   return callFunction("importIntegrationEntities", data)
}

