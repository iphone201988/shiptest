import { TimeRange } from "model/shipment/baseShipment";
import {GeoQuery, H3Query} from "helpers/firebase/firestore/firestore_collection";
import {momentToDayMinutes} from "./../../data/datetime"

export const onLocationChange = (container, location) => {
    container.setState({ location: location})
}

export const onLocationRadiusChange = (container, radius) => {
    container.setState({ onLocationRadiusChange: radius})
}


export const getLocationFilterConditions = (location, locationRadius, field='', type="h3_query") => {
    if (location && locationRadius){
        if (type === "h3_query") {
            return new H3Query(`${field}.displayPosition.h3_geohash`, location.displayPosition, locationRadius)
        } else if (type === "geo_query") {
            return new GeoQuery(`${field}.displayPosition`, location.displayPosition, locationRadius)
        }
    }
}



export const setLocationFilterConditions = (queryFilterConditions, resultsFilterConditions, location, locationRadius, field='', type="geo_query") => {

    if (location && locationRadius){
        if (type === "h3_query") {
            queryFilterConditions.push(new H3Query(`${field}.displayPosition.h3_geohash`, location.displayPosition, locationRadius))
        } else if (type === "geo_query") {
            queryFilterConditions.push(new GeoQuery(`${field}.displayPosition`, location.displayPosition, locationRadius))
        }
    }

    return {queryFilterConditions: queryFilterConditions, resultsFilterConditions: resultsFilterConditions}
}

function dayMinutesRange(momentRange)
{
    if(momentRange){
        return ({
           earliest_time: momentToDayMinutes(`${momentRange[0]}`), 
           latest_time: momentToDayMinutes(`${momentRange[1]}`)
        })
    }
    return {} ;
}

export const getWeekAccess = (week_access) => {
    const new_week_access = {
        monday: week_access.monday[0]? [dayMinutesRange(week_access.monday)] : [],
        tuesday: week_access.tuesday[0]? [dayMinutesRange(week_access.tuesday)] : [] , 
        wednesday:week_access.wednesday[0]? [dayMinutesRange(week_access.wednesday)]:[],
        thrusday:week_access.thrusday[0]?[dayMinutesRange(week_access.thrusday)]:[],
        friday: week_access.friday[0]?[dayMinutesRange(week_access.friday)]:[] ,
        saturday: week_access.saturday[0]?[dayMinutesRange(week_access.saturday)]:[] ,
        sunday:week_access.sunday[0]?[dayMinutesRange(week_access.sunday)]:[],
    }
    return new_week_access ;
}

export const getContactInformation = (values, itemSetsFields, prev_contact_information) => {

    let contact_information = []

    if (prev_contact_information) {
        contact_information = [...prev_contact_information]
    }
    Object.values((itemSetsFields.groups || {}).contact_information|| {}).forEach((contactInfo, i) =>
        {
            contact_information.push({
                address: values[contactInfo.contact_address],
                email: values[contactInfo.contact_email],
                phone: values[contactInfo.contact_phone],
                name: values[contactInfo.contact_name],
                type: values[contactInfo.contact_type]
            })
        })

    return contact_information
}

