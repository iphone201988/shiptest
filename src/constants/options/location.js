import {UNKNOWN_NAME} from "./general";
import {IntlLabel} from "helpers/data/string";

export const COMPANY_LOCATION_TYPES = {
	'business_with_dock_lift': {
		'name': 'location.type.business_with_dock_lift.name',
		'description': 'location.type.business_with_dock_lift.description'
	},
	'business_without_dock_lift': {
		'name': 'location.type.business_without_dock_lift.name',
		'description': 'location.type.business_without_dock_lift.description'
	},
	'construction_site': {
		'name': 'location.type.construction_site.name',
	
	
		'description': 'location.type.construction_site.description'
	},
	'military_base': {
		'name': 'location.type.military_base.name',
		'description': 'location.type.military_base.description'
	},
	'port': {
		'name': 'location.type.port.name',
		'description': 'location.type.port.description'
	},
	// 'storage_company_location': {
	//   'name': 'location.type.storage_company_location.name',
	//   'description': 'location.type.storage_company_location.description'
	// },
}

export const CONTACT_TYPE = {
	'billing': {
		'name': 'general.billing',
	},
	'shipping': {
		'name': 'general.shipping',
	}
}

export const RELATIONSHIP_TYPE = {
	'customer': {
		'name': 'general.customer',
		'color': 'blue'
		// 'description': 'location.type.business_with_dock_lift.description'
	},
	'own_company': {
		'name': 'general.own_company',
		'color': 'green'
		// 'description': 'location.type.business_without_dock_lift.description'
	},
	'supplier': {
		'name': 'general.supplier',
		'color': 'gold'
		// 'description': 'location.type.construction_site.description'
	},
}
 // TODO: LOCATION_TYPE would be replaced by LOCATION_CATEGORY

export const LocationCategory = (data) => {
	return {
		place_cat_id : data.place_cat_id,
		name: data.name
	}
}

export const LOCATION_CATEGORY = {
	airport_cargo: LocationCategory({place_cat_id: '400-4200-0052', 'name': 'airport_cargo'}),
	seaport: LocationCategory({place_cat_id: '400-4200-0051', 'name': 'seaport'}),
	store: LocationCategory({'name': 'store'}),
	rail_yard: LocationCategory({place_cat_id: '400-4200-0050', 'name': 'rail_yard'}),
	warehouse: LocationCategory({'name': 'warehouse'}),
	military_base: LocationCategory({'name': 'military_base'}),
	construction_site: LocationCategory({'name': 'construction_site'}),
	weight_station: LocationCategory({'name': 'weight_station', place_cat_id: '400-4200-0048'}),
	unknown: "unknown"
}

export function LocationCategoryIntlLabel(key, postfix="name"){
	return IntlLabel(key, LOCATION_CATEGORY.keys(), "location.category", postfix, UNKNOWN_NAME)
}

export const VISIBILITY_OPTIONS =  {
	'public': {
	  name: "general.public",
	},
	'private': {
	  name: "general.private",
	},
  }


export const WEEK_DAYS = {
	"monday": {
		"name": "Monday",
	},
	"tuesday": {
		"name": "Tuesday",
	},
	"wednesday": {
		"name": "Wednesday",
	},
	"thursday": {
		"name": "Thursday",
	},
	"friday": {
		"name": "Friday",
	},
	"saturday": {
		"name": "Saturday",
	},
	"sunday": {
		"name": "Sunday",
	},
}

