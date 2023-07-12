import { setShipmentLocationFilterConditions } from "../shipments";
import { FireQuery } from "helpers/firebase/firestore/firestore_collection";

export const setLocationFilter = (formValues, companyId) => {

    const queryFilterConditions =  []
    const resultsFilterConditions = []
    let itemType = "carrier_company_location"

    queryFilterConditions.push(new FireQuery('account.id', '==', companyId))
    setShipmentLocationFilterConditions(queryFilterConditions, resultsFilterConditions, formValues)

    return {queryFilterConditions: queryFilterConditions, resultsFilterConditions: resultsFilterConditions, itemType: itemType}
    
}
