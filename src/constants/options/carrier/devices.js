import {UNKNOWN_KEY} from "../general";

export const DEVICE_STATUS_ONLINE = 'online'
export const DEVICE_STATUS_OFFLINE = 'offline'
export const DEVICE_STATUS_DEACTIVATED = 'deactivated'


export const DEVICE_STATUS = {
	online: {
		'name': 'device.status.online.name',
		'description': 'device.status.online.description',
		'color': 'green',
	},
	available: {
		'name': 'device.status.available.name',
		'description': 'device.status.available.description',
		'color': 'blue',
	},
	unavailable: {
		'name': 'device.status.unavailable.name',
		'description': 'device.status.unavailable.description',
		'color' : 'gold',
	},
	deactivated: {
		'name': 'device.status.in_transit.name',
		'description': 'device.status.in_transit.description',
		'color': 'red'
	}
}

export const NEXT_VALID_DEVICE_STATUS = {
	online: [DEVICE_STATUS_OFFLINE, DEVICE_STATUS_DEACTIVATED],
	offline: [DEVICE_STATUS_ONLINE, DEVICE_STATUS_DEACTIVATED],
	deactivated: [DEVICE_STATUS_OFFLINE],
}

export const DEVICE_STATUS_FORBIDDEN__MANUAL_CHANGE = [DEVICE_STATUS_ONLINE, DEVICE_STATUS_OFFLINE]

export function device_status(key){
	return DEVICE_STATUS[key || UNKNOWN_KEY] || DEVICE_STATUS.unknown
}

export function validNextDeviceStatus(currentStatus, nextStatus){

	return  currentStatus === nextStatus ||
		( !DEVICE_STATUS_FORBIDDEN__MANUAL_CHANGE.includes(nextStatus) &&
			(NEXT_VALID_DEVICE_STATUS[currentStatus] || []).includes(nextStatus))
}

export const USER_DEVICES = 'inactive_devices'
export const COMPANY_DEVICES = 'active_devices'
export const NEW_DEVICE = 'new_device'
export const TRACKING = 'tracking'