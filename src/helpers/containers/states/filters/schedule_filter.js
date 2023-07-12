import { setShipmentLocationFilterConditions } from "../shipments";
import { getFilterConditions } from '../../../getFilterConditions'
import { FireQuery } from "helpers/firebase/firestore/firestore_collection";
import { DateFilter } from "helpers/firebase/firestore/results_filter"
import { QUOTE_OFFER_STATUS, QUOTE_REQUEST_STATUS } from "constants/options/shipping";

export const setScheduleFilter = (formValues, companyId, type) => {

  const queryFilterConditions = []
  const resultsFilterConditions = []
  let itemType = undefined

  const { title, description, Trailers, Vehicles, users, status, Visibility, location, LocationRadius } = formValues

  queryFilterConditions.push(new FireQuery('company_account.id', '==', companyId))

  if (formValues.status) {
    console.log('i am status', formValues.status)
    queryFilterConditions.push(new FireQuery('info.event_status', '==', status))
  }

  if (type === 'shipment') {
    queryFilterConditions.push(new FireQuery('company_account.id', '==', companyId))
    // if (getFilterConditions(title)) {
    //   queryFilterConditions.push(new FireQuery('info.title', '==', title))
    // }
  //   if (getFilterConditions(description)) {
  //     queryFilterConditions.push(new FireQuery('info.description', '==', description))
  //   }
    // if (getFilterConditions(users)) {
    //   console.log('i am users', users)
    //   queryFilterConditions.push(new FireQuery('assignments.users', '==', users))
    // }
  //   if (getFilterConditions(Vehicles)) {
  //     console.log('i am vehicles', Vehicles)
  //     queryFilterConditions.push(new FireQuery('assignments.vehicles', '==', Vehicles))
  //   }
  //   if (getFilterConditions(Trailers)) {
  //     console.log('i am trailers', Trailers)
  //     queryFilterConditions.push(new FireQuery('assignments.trailers', '==', Trailers))
  //   }
    if (getFilterConditions(status)) {
      console.log('i am status', status)
      queryFilterConditions.push(new FireQuery('info.event_status', '==', status))
    }
  //   if (getFilterConditions(Visibility)) {
  //     console.log('i am visibility', Visibility)
  //     queryFilterConditions.push(new FireQuery('info.visibility', '==', Visibility))
  //   }
  //   if (getFilterConditions(location)) {
  //     console.log('i am location', location)
  //     queryFilterConditions.push(new FireQuery('info.location', '==', location))
  //   }
  //   if (getFilterConditions(LocationRadius)) {
  //     console.log('i am location radius',LocationRadius)
  //     queryFilterConditions.push(new FireQuery('info.radius', '==', LocationRadius))
  //   }

  }

  // if (type === 'resources') {
    
  //   if (getFilterConditions(title)) {
  //     queryFilterConditions.push(new FireQuery('title', '==', title))
  //   }
  //   if (getFilterConditions(description)) {
  //     queryFilterConditions.push(new FireQuery('title', '==', title))
  //   }
  //   if (getFilterConditions(users)) {
  //     console.log('i am users', Vehicles)
  //     queryFilterConditions.push(new FireQuery('users', '==', users))
  //   }
  //   if (getFilterConditions(Vehicles)) {
  //     console.log('i am vehicles', Vehicles)
  //     queryFilterConditions.push(new FireQuery('vehicles', '==', Vehicles))
  //   }
  //   if (getFilterConditions(Trailers)) {
  //     console.log('i am trailers', Trailers)
  //     queryFilterConditions.push(new FireQuery('trailers', '==', Trailers))
  //   }
  //   if (getFilterConditions(status)) {
  //     console.log('i am status', status)
  //     queryFilterConditions.push(new FireQuery('status', '==', status))
  //   }
  //   if (getFilterConditions(Visibility)) {
  //     console.log('i am visibility', Visibility)
  //     queryFilterConditions.push(new FireQuery('visibility', '==', Visibility))
  //   }
  //   if (getFilterConditions(location)) {
  //     console.log('i am visibility', location)
  //     queryFilterConditions.push(new FireQuery('location', '==', location))
  //   }
  //   if (getFilterConditions(LocationRadius)) {
  //     console.log('i am location radius',LocationRadius)
  //     queryFilterConditions.push(new FireQuery('radius', '==', LocationRadius))
  //   }
    
  // }

  console.log('i am queryFilterConditions', queryFilterConditions);
  console.log('i am resultsFilterCondition', resultsFilterConditions);

  return {queryFilterConditions: queryFilterConditions, resultsFilterConditions: resultsFilterConditions}

}