import {UNKNOWN_KEY} from "../general";

export const ASSET_STATUS_AVAILABLE = 'available'
export const ASSET_STATUS_UNAVAILABLE = 'unavailable'
export const ASSET_STATUS_IN_TRANSIT = 'in_transit'
export const ASSET_STATUS_DEACTIVATED = 'deactivated'
export const ASSET_STATUS_MAINTENANCE = 'maintenance'
export const ASSET_STATUS = {
	available: {
		'name': 'carrier.asset.status.available.name',
		'description': 'carrier.asset.status.available.description',
		'color': 'green',
	},
	unavailable: {
		'name': 'carrier.asset.status.unavailable.name',
		'description': 'carrier.asset.status.unavailable.description',
		'color': 'red',
	},
	in_transit: {
		'name': 'carrier.asset.status.in_transit.name',
		'description': 'carrier.asset.status.in_transit.description',
		'color': 'gold',
	},
	deactived: {
		'name': 'carrier.asset.status.deactivated.name',
		'description': 'carrier.asset.status.deactivated.description',
		'color': 'red',
	},
	maintenance: {
		'name': 'carrier.asset.status.maintenance.name',
		'description': 'carrier.asset.status.maintenance.description',
		'color': 'gold',
	}
}
export const NEXT_VALID_ASSET_STATUS = {
	available: [ASSET_STATUS_UNAVAILABLE, ASSET_STATUS_IN_TRANSIT, ASSET_STATUS_DEACTIVATED, ASSET_STATUS_MAINTENANCE],
	unavailable: [ASSET_STATUS_AVAILABLE, ASSET_STATUS_DEACTIVATED, ASSET_STATUS_MAINTENANCE],
	in_transit: [ASSET_STATUS_AVAILABLE, ASSET_STATUS_UNAVAILABLE, ASSET_STATUS_MAINTENANCE],
	deactived: [ASSET_STATUS_UNAVAILABLE, ASSET_STATUS_AVAILABLE, ASSET_STATUS_MAINTENANCE],
	maintenance: [ASSET_STATUS_AVAILABLE, ASSET_STATUS_UNAVAILABLE, ASSET_STATUS_DEACTIVATED]
}
export const ASSET_STATUS_FORBIDDEN__MANUAL_CHANGE = [ASSET_STATUS_IN_TRANSIT]

export function asset_status(key) {
	return ASSET_STATUS[key || UNKNOWN_KEY] || ASSET_STATUS.unknown
}

export function validNextAssetStatus(currentStatus, nextStatus) {

	return currentStatus === nextStatus ||
		(!ASSET_STATUS_FORBIDDEN__MANUAL_CHANGE.includes(nextStatus) &&
			(NEXT_VALID_ASSET_STATUS[currentStatus] || []).includes(nextStatus))
}

export const ASSET_TYPE_VEHICLE = "vehicle"
export const ASSET_TYPE_TRAILER = "trailer"

export const ASSET_TYPES = {

}

export function asset_active_status(key) {
	let activeKey = ""
	if(key === true) {
		activeKey = "available"
	} else {
		activeKey = "unavailable"
	}
	return ASSET_ACTIVE_STATUS[activeKey || UNKNOWN_KEY] || ASSET_ACTIVE_STATUS.unknown
}

export const ASSET_ACTIVE_STATUS = {
	available: {
		'name': 'carrier.asset.status.available.name',
		'description': 'carrier.asset.status.available.description',
		'color': 'green',
	},
	unavailable: {
		'name': 'carrier.asset.status.unavailable.name',
		'description': 'carrier.asset.status.unavailable.description',
		'color': 'red',
	},
	
}
