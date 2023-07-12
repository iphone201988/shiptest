import { setShipmentLocationFilterConditions } from "../shipments";
import { getFilterConditions } from '../../../getFilterConditions'
import { FireQuery } from "helpers/firebase/firestore/firestore_collection";
import { DateFilter } from "helpers/firebase/firestore/results_filter"
import { QUOTE_OFFER_STATUS, QUOTE_REQUEST_STATUS } from "constants/options/shipping";

export const setShipmentFilter = (formValues, view, companyId, type, domain) => {

    const queryFilterConditions = []
    const resultsFilterConditions = []
    let itemType = undefined

    const {  trailer_types, distance, filter_status, pickup_date, offers, company_name } = formValues

    // const start = formValues.eventDateTimeRange[0]._d;
    // const end = formValues.eventDateTimeRange[1]._d;
    // console.log('start...',start,'end',end);

    if (domain === "carrier")
     {
        if (type === "quote_request")
         {
            if (view === "loads")
             {
                queryFilterConditions.push(new FireQuery('status', '==', QUOTE_REQUEST_STATUS.open.key))
                itemType = "carrier_quote_request"
            } else if (view === "offers") {
                queryFilterConditions.push(new FireQuery('carrier', '==', companyId))
                queryFilterConditions.push(new FireQuery('status', '==', QUOTE_OFFER_STATUS.pending.key))
                itemType = "carrier_quote_offer"
            } else if (view === "history") {
                queryFilterConditions.push(new FireQuery('carrier', '==', companyId))
                queryFilterConditions.push(new FireQuery('active', '==', false))

                itemType = "carrier_quote_request"
                if (getFilterConditions(filter_status)) {
                    queryFilterConditions.push(new FireQuery('status', '==', filter_status))
                }
                else {
                    // queryFilterConditions.push(new FireQuery('status', '==', QUOTE_OFFER_STATUS.accepted.key))
                }
            }
        } 
        if (type === "shipment" ) 
        {
            queryFilterConditions.push(new FireQuery('carrier', '==', companyId))
            itemType = "carrier_shipment"

            if (view === "active") 
            {
                queryFilterConditions.push(new FireQuery('active', '==', true))
            } 
           if (view === "history") 
            {
                queryFilterConditions.push(new FireQuery('active', '==', false))
            }
            
            
        }
    } 
    else if (domain === "shipping") 
    {
        queryFilterConditions.push(new FireQuery('shipper', '==', companyId))
        if (type === "quote_request") {
            itemType = "shipper_quote_request"
            if (view === "active") 
            {
                queryFilterConditions.push(new FireQuery('active', '==', true))
            } 
            else if (view === "history") 
            {
                queryFilterConditions.push(new FireQuery('active', '==', false))
            }
        } 
        if (type === "shipment" ) 
        {
            itemType = "shipper_shipment"
            if (view === "active") 
            {
                queryFilterConditions.push(new FireQuery('active', '==', true))
            } 
            else if (view === "history") 
            {
                queryFilterConditions.push(new FireQuery('active', '==', false))
            }
            
            
        }
    }

    if (getFilterConditions(filter_status)) {
        queryFilterConditions.push(new FireQuery('status', '==', filter_status))
    }

    if (getFilterConditions(trailer_types)) {
        queryFilterConditions.push(new FireQuery('trail_type', '==', trailer_types))
    }
    if (getFilterConditions(pickup_date)) {
        resultsFilterConditions.push(new DateFilter(pickup_date))
    }
    if (getFilterConditions(distance)) {
        queryFilterConditions.push(new FireQuery('itinerary_sequence.distance_group', '==', distance))
    }
    // if (getFilterConditions(offers)) {
    //     resultsFilterConditions.push(new QuoteOfferFilter(offers))
    // }

    setShipmentLocationFilterConditions(queryFilterConditions, resultsFilterConditions, formValues)

    return {
        queryFilterConditions: queryFilterConditions, resultsFilterConditions: resultsFilterConditions,
        itemType: itemType
    }

}
