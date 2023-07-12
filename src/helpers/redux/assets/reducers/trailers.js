import {FETCH_TRAILERS} from '../actions/types';

export default (state = {}, action) => {
    switch(action.type) {
        case FETCH_TRAILERS:
            return action.payload || null;
        default:
            return state;
    }
};