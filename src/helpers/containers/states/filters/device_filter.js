import { FireQuery } from "helpers/firebase/firestore/firestore_collection";
import { getFilterConditions } from '../../../getFilterConditions'

export const setDeviceFilter = (formValues, companyId, view) => {

    const { filter_status, device_name, filter_provider } = formValues

    const queryFilterConditions =  []
    const resultsFilterConditions = []
    const itemType = "device"

    queryFilterConditions.push(new FireQuery('company_account.id', '==', companyId))
    
    if (getFilterConditions(filter_status)) {
      queryFilterConditions.push(new FireQuery('status', '==', filter_status))
    }
    if (getFilterConditions(device_name)) {
      queryFilterConditions.push(new FireQuery('profile.name', '==', device_name))
    }
    if(getFilterConditions(filter_provider)) {
      queryFilterConditions.push(new FireQuery('profile.provider.provider', '==', filter_provider))
    }
    if(getFilterConditions(view)) {
      if(view === 'active_devices'){
        queryFilterConditions.push(new FireQuery('status', '==', 'available'))
      }

      if(view === 'inactive_devices'){
        queryFilterConditions.push(new FireQuery('status', '==', 'unavailable'))
      }

    }

    return {queryFilterConditions: queryFilterConditions, resultsFilterConditions: resultsFilterConditions, itemType:itemType}
}


