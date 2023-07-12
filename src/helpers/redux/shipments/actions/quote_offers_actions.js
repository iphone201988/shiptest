import * as firebase from "firebase";
import {ObjectToJSON} from "../../../data/format";
import {handleHttpError} from "../../../error/errors";
import {CREATE_QUOTE_OFFER, FETCH_QUOTE_OFFERS, FETCH_QUOTE_REQUESTS} from "./types";
import QuoteOffer from "model/shipment/quote_offer";



export const createQuoteOffer = (data) => async dispatch => {
    try{
        const createQuoteOffer = firebase.functions().httpsCallable('createQuoteOffer');
        const result = await createQuoteOffer(ObjectToJSON(data))
        dispatch({type: CREATE_QUOTE_OFFER, payload: result.data});
    } catch(error) {
        handleHttpError(error,  {throwError: true, logError:true})
    }
}

export const fetchQuoteOffers = (conditions, realtime=true) => async dispatch => {
    QuoteOffer.collection.query(conditions,
        (results) => {dispatch({type: FETCH_QUOTE_OFFERS, payload: results})}, realtime)
};



