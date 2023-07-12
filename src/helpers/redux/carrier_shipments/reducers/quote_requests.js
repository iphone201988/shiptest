import {FETCH_QUOTE_REQUESTS} from '../actions/types';

export default (state = {}, action) => {
  switch(action.type) {
    case FETCH_QUOTE_REQUESTS:
      return action.payload || null;
    default:
      return state;
  }
  return state
};