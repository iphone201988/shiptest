import { FireQuery } from "helpers/firebase/firestore/firestore_collection";
import { getFilterConditions } from '../../../getFilterConditions'

export const setIntegrationFilter = (formValues, companyId) => {

    const { filter_status, provider } = formValues

    const queryFilterConditions=[]
    const resultsFilterConditions = []

    queryFilterConditions.push(new FireQuery('company_account.id', '==', companyId))

    if (getFilterConditions(filter_status)) {
        queryFilterConditions.push(new FireQuery('status', '==', filter_status))
    }
    if (getFilterConditions(provider)) {
        queryFilterConditions.push(new FireQuery('provider', '==', provider))
    }

    return {queryFilterConditions: queryFilterConditions, resultsFilterConditions: resultsFilterConditions}
}
