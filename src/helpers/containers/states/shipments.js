import {setLocationFilterConditions} from "./location"

export const setShipmentLocationFilterConditions = (queryFilterConditions, resultsFilterConditions, formValues) => {

    const {originLocation, originLocationRadius, destinationLocation, destinationLocationRadius} = formValues || {}

    if (originLocation && originLocationRadius){
        setLocationFilterConditions(queryFilterConditions, resultsFilterConditions, formValues.originLocation, formValues.originLocationRadius,  "origin.", "h3_query" )
    }
    if (destinationLocation && destinationLocationRadius){
        setLocationFilterConditions(queryFilterConditions, resultsFilterConditions, formValues.destinationLocation, formValues.destinationLocationRadius,  "destination.", "geo_query" )
    }

    return {filterConditions: queryFilterConditions, resultsFilterConditions: resultsFilterConditions}

}
