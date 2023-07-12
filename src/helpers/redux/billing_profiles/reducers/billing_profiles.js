import {FETCH_ACTIVE_BILLING_PROFILES} from '../actions/types';

export default (state = {}, action) => {
  switch(action.type) {
    case FETCH_ACTIVE_BILLING_PROFILES:
      return {...state, activeBillingProfiles: action.payload !== undefined  ? action.payload : []}
    default:
      return state;
  }
};