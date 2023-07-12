import firebase from "firebase";
import { FireQuery } from "helpers/firebase/firestore/firestore_collection";


export default function setTabsFilter(view) {


  const queryFilterConditions = []
    const resultsFilterConditions = []
 
  if (view === "active") {
    queryFilterConditions.push(new FireQuery('account_status', '==', "active"))
  } 
  // else {
  //   queryFilterConditions.push(new FireQuery('account_status', '!=', 'active'))
  // }

  return {queryFilterConditions: queryFilterConditions, resultsFilterConditions: resultsFilterConditions}

}