import { FireQuery } from "helpers/firebase/firestore/firestore_collection";
import { getFilterConditions } from '../../../getFilterConditions' 

export const setCompanyFilter = (form_values={}) => {
  
  const {company_status, company_name} = form_values ;

  const queryFilterConditions = []
  const resultsFilterConditions = []

  // if (view === "active") {
  //   queryFilterConditions.push(new FireQuery('account_status', '==', "active"))
  // } 
  
  // if (view !== "active") {
  //   queryFilterConditions.push(new FireQuery('account_status', '!=', 'active'))
  // }

  if(getFilterConditions(company_name)){
    queryFilterConditions.push(new FireQuery('profile.name', '==', company_name))
  }

  if(getFilterConditions(company_status)){
    queryFilterConditions.push(new FireQuery('account_status', '==', company_status))
  }

  return {queryFilterConditions: queryFilterConditions, resultsFilterConditions: resultsFilterConditions}

}