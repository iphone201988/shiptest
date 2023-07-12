import {FETCH_ACTIVE_VEHICLES, FETCH_VEHICLES} from '../actions/types';

export default (state = {}, action) => {
    switch(action.type) {
        case FETCH_VEHICLES:
            return action.payload || null;
        case FETCH_ACTIVE_VEHICLES:
            return {...state, activeVehicles: action.payload != undefined  ? action.payload : {}}
        default:
            return state;
    }
};