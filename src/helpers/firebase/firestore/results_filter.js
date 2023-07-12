import {getBoundingBox} from "../../geolocation/geohash";
import {getNestedProp} from "../../data/object";

export function applyResultsFilters(resultFilters, results) {

    (resultFilters || []).forEach(resultFilter => {
        results = resultFilter.apply(results)
    })
    return results
}

export class ResultsFilter {

    conditions = (value) => {
        return true
    }

    apply = (results) => {
        return (results || []).filter(value => this.conditions(value))
    }
}

export class ResultGeoRadiusFilter extends ResultsFilter {

    constructor(field, position, radius) {
        super()
        try {
            const bbox = getBoundingBox(position.geopoint.latitude, position.geopoint.longitude, radius)
            this.field = `${field}.geopoint`
            this.min_coords = {latitude: bbox[1], longitude: bbox[0]}
            this.max_coords = {latitude: bbox[3], longitude: bbox[2]}
        } catch (e) {
            console.error("Invalid ResultGeoRangeFilter: " + e.message)
        }

    }

    conditions = (value) => {
        try {
            value = getNestedProp(value, this.field)
            return value.latitude >= this.min_coords.latitude && value.longitude >= this.min_coords.longitude &&
                value.latitude <= this.max_coords.latitude && value.longitude <= this.max_coords.longitude
        } catch (e) {
            return true
        }


    }
}

export class DistanceFilter extends ResultsFilter {

    constructor(value){
        super()
        this.lower = value[0]*1000
        this.upper = value[1]*1000
    }

    conditions = (value) => {
        return value.itinerary_sequence.distance >= this.lower && value.itinerary_sequence.distance <= this.upper 
    }
}

export class DateFilter extends ResultsFilter {

    constructor(value){
        super()
        this.lower = Date.parse(value[0])/1000
        this.upper = Date.parse(value[1])/1000
    }

    conditions = (value) => {
        return value.origin.access_time.earliest_time >= this.lower && value.origin.access_time.earliest_time <= this.upper 
    }
}

export class QuoteOfferFilter extends ResultsFilter {

    constructor(value){
        super()
        this.value = value
    }

    conditions = (value) => {
        return value.quote_offers.length >= this.value
    }
}

export class MultipleRolesSelectFilter extends ResultsFilter {

    constructor(value){
        super()
        this.value = value
    }

    conditions = (value) => {
        let filtered = false
        if(value !== undefined) {
            this.value.forEach(element => value.role_types.forEach(role => {
                if (role === element) {
                    filtered = true
                }
            }))
        }
        return filtered
    }
}
