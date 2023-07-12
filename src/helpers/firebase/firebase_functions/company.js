import {callFunction} from "./functions_base";

export const updateCompany = (data) => {
  return callFunction("manageResource", {resourceType: 'company', action: 'updateCompany', data:data})
}