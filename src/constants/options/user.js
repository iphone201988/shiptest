import {UNKNOWN_VALUE} from "./shipping";

export const ROLES =  {
  'role_admin': {
    name: "carrier.role.admin.name",
    description: "carrier.role.admin.description"
  },
  'role_manager': {
    name: "carrier.role.manager.name",
    description: "carrier.role.manager.description"
  },
  'role_dispatcher': {
    name: "carrier.role.dispatcher.name",
    description: "carrier.role.dispatcher.description"
  },
  'role_driver': {
    name: "carrier.role.driver.name",
    description: "carrier.role.driver.description"
  }
}

export const USER_STATUS = {
  pending: {key: "pending", 'name': 'user.status.pending.name',
    'description': 'user.status.pending.description', 'color': 'gold'},
  active: {key: "active", 'name': 'user.status.active.name',
    'description': 'user.status.active.description', 'color': 'green'},
  inactive: {key: "inactive", 'name': 'user.status.inactive.name',
    'description': 'user.status.inactive.description', 'color': 'gold'},
  suspended: {key: "suspended", 'name': 'user.status.suspended.name',
    'description': 'user.status.suspended.description', 'color': 'red'}
}


export function user_account_status(key) {
  return USER_STATUS[key] || UNKNOWN_VALUE
}

export const roleLabelValues = Object.keys(ROLES).map(key=>{return {value: key, label:ROLES[key].name}})
