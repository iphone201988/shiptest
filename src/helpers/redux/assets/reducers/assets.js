import {FETCH_ACTIVE_VEHICLES, FETCH_ACTIVE_TRAILERS} from '../actions/types';

export default (state = {}, action) => {
  switch(action.type) {
    case FETCH_ACTIVE_VEHICLES:
      return {...state, activeVehicles: action.payload !== undefined  ? action.payload : {}}
    case FETCH_ACTIVE_TRAILERS:
      return {...state, activeTrailers: action.payload !== undefined  ? action.payload : {}}
    default:
      return state;
  }
};