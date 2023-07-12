import { FireQuery } from "helpers/firebase/firestore/firestore_collection";
import { getFilterConditions } from '../../../getFilterConditions'
import { MultipleRolesSelectFilter } from "helpers/firebase/firestore/results_filter"

export const setUserFilter = (formValues, view, companyId, type) => {
    
    const { user_first_name, user_last_name, user_email, user_status, user_roles } = formValues
    
    const queryFilterConditions = []
    const resultsFilterConditions = []
    const itemType = type ;
    
    
    if (view === "active"){
        queryFilterConditions.push(new FireQuery('account_status', '==', "active"))
    }
    
    if (view === "all") {
        if (getFilterConditions(user_status) ) {
            queryFilterConditions.push(new FireQuery('account_status', '==', user_status))
        }
    }

    if(itemType !== "admin_user") {
        queryFilterConditions.push(new FireQuery('company_account.id', '==', companyId))
    }
    if (getFilterConditions(user_first_name)) {
        queryFilterConditions.push(new FireQuery('profile.first_name', '==', user_first_name))
    }
    if (getFilterConditions(user_last_name)) {
        queryFilterConditions.push(new FireQuery('profile.last_name', '==', user_last_name))
    }
    if (getFilterConditions(user_email)) {
        queryFilterConditions.push(new FireQuery('profile.email', '==', user_email))
    }
    if (getFilterConditions(user_roles)) {
        resultsFilterConditions.push(new MultipleRolesSelectFilter(user_roles))
    }

    return {queryFilterConditions: queryFilterConditions, resultsFilterConditions: resultsFilterConditions, itemType: itemType}
}


export const userFilter = (form_values={}) => {

    const { user_first_name, user_last_name, user_email, user_status, user_roles } = form_values ;

    const queryFilterConditions = []
    const resultsFilterConditions = []

    if (getFilterConditions(user_first_name)) {
        queryFilterConditions.push(new FireQuery('profile.first_name', '==', user_first_name))
    }
    if (getFilterConditions(user_last_name)) {
        queryFilterConditions.push(new FireQuery('profile.last_name', '==', user_last_name))
    }
    if (getFilterConditions(user_email)) {
        queryFilterConditions.push(new FireQuery('profile.email', '==', user_email))
    }
    if (getFilterConditions(user_roles)) {
        resultsFilterConditions.push(new MultipleRolesSelectFilter(user_roles))
    }

    

    return {queryFilterConditions: queryFilterConditions, resultsFilterConditions: resultsFilterConditions }
}