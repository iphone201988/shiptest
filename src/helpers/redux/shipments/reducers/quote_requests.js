import {FETCH_QUOTE_REQUESTS, FETCH_QUOTE_REQUEST} from '../actions/types';

export default (state = {}, action) => {
  switch(action.type) {
    case FETCH_QUOTE_REQUESTS:
      return {...state, quoteRequests: action.payload}
    case FETCH_QUOTE_REQUEST:
      return {...state, quoteRequest: action.payload}
    default:
      return state;
  }
};