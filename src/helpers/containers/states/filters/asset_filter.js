import { FireQuery } from "helpers/firebase/firestore/firestore_collection";
import { getFilterConditions } from '../../../getFilterConditions'

export const setAssetFilter = (formValues, assetType, companyId) => {

    const queryFilterConditions =  []
    const resultsFilterConditions = []
    const { asset_name, trailer_types, filter_status, truck_classes, asset_VIN, active } = formValues

    queryFilterConditions.push(new FireQuery('company_account.id', '==', companyId))
    
    if (assetType === "vehicle") {
      if (getFilterConditions(truck_classes)) {
        queryFilterConditions.push(new FireQuery('profile.class', '==', truck_classes))
      }
    }

    if (assetType === "trailer"){
      if (getFilterConditions(trailer_types)) {
        queryFilterConditions.push(new FireQuery('profile.trailer_type', '==', trailer_types))
      }
    } 
        
    if (getFilterConditions(filter_status)) {
        queryFilterConditions.push(new FireQuery('status', '==', filter_status))
    }

    if (getFilterConditions(asset_name)) {
      queryFilterConditions.push(new FireQuery('profile.name', '==', asset_name))
    }

    if (getFilterConditions(asset_VIN)) {
      queryFilterConditions.push(new FireQuery('profile.vin', '==', asset_VIN))
    }

    if (getFilterConditions(active)) {
      queryFilterConditions.push(new FireQuery('active', '==', active))
    }

    return {queryFilterConditions: queryFilterConditions, resultsFilterConditions: resultsFilterConditions}
}
