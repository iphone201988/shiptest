import {FETCH_ACTiVE_DEVICES} from '../actions/types';

export default (state={}, action) => {
  switch(action.type) {
    case FETCH_ACTiVE_DEVICES:
      return { ...state, activeDevices: action.payload !== undefined  ? action.payload : {}}
      
      default:
        return state ;
  }
} ;