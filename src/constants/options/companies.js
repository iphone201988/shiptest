import {UNKNOWN_VALUE} from "./shipping";

export const COMPANIES_STATUS = {
  pending: {key: "pending", 'name': 'user.status.pending.name',
    'description': 'user.status.pending.description', 'color': 'gold'},
  active: {key: "active", 'name': 'user.status.active.name',
    'description': 'user.status.active.description', 'color': 'green'},
  inactive: {key: "inactive", 'name': 'user.status.inactive.name',
    'description': 'user.status.inactive.description', 'color': 'gold'},
  suspended: {key: "suspended", 'name': 'user.status.suspended.name',
    'description': 'user.status.suspended.description', 'color': 'red'}
}


export function companies_account_status(key) {
  return COMPANIES_STATUS[key] || UNKNOWN_VALUE
}