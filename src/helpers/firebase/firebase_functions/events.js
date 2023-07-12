import { callFunction } from "./functions_base";

export const addEvent = (data) => {
  return callFunction("manageResource", {resourceType: 'event', action: 'addEvent', data:data})
}

export const deleteEvent = (data) => {
  return callFunction("manageResource", {resourceType: 'event', action: 'deleteEvent', data:data})
}

export const updateEvent = (data) => {
  return callFunction("manageResource", {resourceType: 'event', action: 'updateEvent', data:data})
}

