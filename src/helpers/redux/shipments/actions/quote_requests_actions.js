import * as firebase from "firebase";
import {ADD_QUOTE_REQUEST, CANCEL_QUOTE_REQUEST, FETCH_QUOTE_REQUEST, FETCH_QUOTE_REQUESTS} from './types';
import QuoteRequest from "model/shipment/quote_request";
import {ObjectToJSON} from "../../../data/format";
import {handleHttpError} from "../../../error/errors";

export const fetchQuoteRequests = (conditions, realtime=true) => async dispatch => {
    QuoteRequest.collection.query(conditions,
        (results) => {dispatch({type: FETCH_QUOTE_REQUESTS, payload: results})}, realtime)
};

export const fetchQuoteRequest = (id, realtime=true) => async dispatch => {
    QuoteRequest.collection.get(id,
        (results) => {dispatch({type: FETCH_QUOTE_REQUEST, payload: results})}, realtime)
};


export const addQuoteRequest = (data) => async dispatch => {
    try{
        const addQuoteRequest = firebase.functions().httpsCallable('createQuoteRequest');
        const result = await addQuoteRequest(ObjectToJSON(data))
        dispatch({type: ADD_QUOTE_REQUEST, payload: result.data});
    } catch(error) {
        handleHttpError(error,  {throwError: true, logError:true})
    }
}

export const cancelQuoteRequest = (data) => async dispatch => {
    try{
        const cancelQuoteRequest = firebase.functions().httpsCallable('cancelQuoteRequest');
        const result = await cancelQuoteRequest(ObjectToJSON(data))
        dispatch({type: CANCEL_QUOTE_REQUEST, payload: result.data});
    } catch(error) {
        handleHttpError(error,  {throwError: true, logError:true})
    }
}