import {callFunction} from "./functions_base";

export const createInvoicesSetupIntent = (data) => {
  return callFunction("manageResource", {resourceType: 'Invoices', action: 'createInvoicesSetupIntent', data:data})
}

export const cancelInvoicesSetupIntent = (data) => {
  return callFunction("manageResource", {resourceType: 'Invoices', action: 'cancelSetupIntent', data:data})
}

export const setupInvoicesSession = () => {
  return callFunction("manageResource", {resourceType: 'Invoices', action: 'setupInvoicesSession', data:data})
}

export const deleteInvoices = (data) => {
  return callFunction("manageResource", {resourceType: 'Invoices', action: 'deleteInvoices', data:data})
}

