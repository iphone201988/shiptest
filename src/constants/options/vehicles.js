
export const VEHICLE_MAKES = {
	"American Lafrance": {
		"name": "American LaFrance",
	},
	"Autocar": {
		"name": "Autocar",
	},
	"Bering": {
		"name": "Bering",
	},
	"Chevrolet": {
		"name": "Chevrolet",
	},
	"Dodge": {
		"name": "Dodge",
	},
	"Ford": {
		"name": "Ford",
	},
	"Freightliner": {
		"name": "Freightliner",
	},
	"GMC": {
		"name": "GMC",
	},
	"Hino": {
		"name": "Hino",
	},
	"International": {
		"name": "International",
	},
	"Isuzu": {
		"name": "Isuzu",
	},
	"Kenworth": {
		"name": "Kenworth",
	},
	"Mack": {
		"name": "Mack",
	},
	"Marmon": {
		"name": "Marmon",
	},
	"Mercedes": {
		"name": "Mercedes",
	},
	"Mitsubishi": {
		"name": "Mitsubishi",
	},
	"Nissan": {
		"name": "Nissan",
	},
	"Volvo": {
		"name": "Volvo",
	},
	"Western Star": {
		"name": "Western Star",
	}
}

export const TRUCK_CLASSES = {
	class_1: {name: "carrier.vehicle.class_1.name"},
	class_2: {name: "carrier.vehicle.class_2.name"},
	class_3: {name: "carrier.vehicle.class_3.name"},
	class_4: {name: "carrier.vehicle.class_4.name"},
	class_5: {name: "carrier.vehicle.class_5.name"},
	class_6: {name: "carrier.vehicle.class_6.name"},
	class_7: {name: "carrier.vehicle.class_7.name"},
	class_8: {name: "carrier.vehicle.class_8.name"},
	unknown: {name: "general.unknown"},
}

export const TRAILER_TYPES = {
	straight: {key: "straight", name:"trailer.type.straight.name", color:"blue"},
	dry_van: {key: "dry_van", name:"trailer.type.dry_van.name", color:"blue"},
	flatbed: {key: "flatbed", name:"trailer.type.flatbed.name", color:"blue"},
	reefer: {key: "reefer", name:"trailer.type.reefer.name", color:"blue"},
	unknown: {key: "unknown", name:"general.unknown", color:"red"},
}

export const TRAILER_MAKES = {
	"Chassis King": {
		"name": "Chassis King",
	},
	"Contral-Evaco": {
		"name": "Contral-Evaco",
	},
	"Doonan Trailers": {
		"name": "Doonan Trailers",
	},
	" Doepker": {
		"name": "Doepker",
		"WMI":"2DE"
	},
	"Dorsey Trailer": {
		"name": "Dorsey Trailer",
		"WMI":"4TB"
	},
	"Eager Beaver Trailers": {
		"name": "Eager Beaver Trailers",
	},
	"East Manufacturing": {
		"name": "East Manufacturing",
	},
	"Ferree Trailers": {
		"name": "Ferree Trailers",
	},
	"Felling Trailers": {
		"name": "Felling Trailers",
	},
	"Fontaine Trailers": {
		"name": "Fontaine Trailers",
	},
	"Fruehauf": {
		"name": "Fruehauf",
	},
	"Great Dane": {
		"name": "Great Dane",
	},
	"Heil Trailers": {
		"name": "Heil Trailers",
	},
	"Hyundai Translead": {
		"name": "Hyundai Translead"
	},
	"J & J Trailers": {
		"name": "J & J Trailers",
	},
	"Kentucky Trailer": {
		"name": "Kentucky Trailer",
	},
	"Landoll Corp": {
		"name": " Landoll Corp",
	},
	"Landsport": {
		"name": "Landsport",
	},
	"Mac Trailers": {
		"name": "Mac Trailers",
	},
	"Manac": {
		"name": "Manac",
	},
	"Pitts Trailers": {
		"name": "Pitts Trailers",
	},
	"Stoughton Trailers": {
		"name": "Stoughton Trailers",
	},
	"Tarasport Trailers": {
		"name": "Tarasport Trailers",
	},
	"Timpte Inc": {
		"name": "Timpte Inc",
	},
	"Trail-eze Trailers": {
		"name": "Trail-eze Trailers",
	},
	"Transcraft": {
		"name": "Transcraft",
	},
	"Travis Body Trailer": {
		"name": "Travis Body & Trailer",
	},
	"Trinity Trailer": {
		"name": "Trinity Trailer",
	},
	"Utility Trailer": {
		"name": "Utility Trailer",
	},
	"Wabash National": {
		"name": "Wabash National",
	},
	"Warren": {
		"name": "Warren",
	},
	"Western Trailers": {
		"name": "Western Trailers",
	},
	"Wilson Trailer": {
		"name": "Wilson Trailer",
	},
	"XLSpecialized Trailers": {
		"name": "XLSpecialized Trailers",
	},
}

export const FUEL_TYPES = {
	diesel: {
		name: "carrier.vehicle.fuel.diesel"
	},
	gasoline: {name: "carrier.vehicle.fuel.gasoline"}
}

export function getTruckClass(key){
	return TRUCK_CLASSES[key] || TRUCK_CLASSES["unknown"]
}

export function getTrailerType(key){
	return TRAILER_TYPES[key] || TRAILER_TYPES["unknown"]
}