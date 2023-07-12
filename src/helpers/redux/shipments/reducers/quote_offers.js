import {FETCH_QUOTE_OFFERS} from '../actions/types';

export default (state = {}, action) => {
  switch(action.type) {
    case FETCH_QUOTE_OFFERS:
      return {...state, quoteOffers: action.payload}
    default:
      return state;
  }
};