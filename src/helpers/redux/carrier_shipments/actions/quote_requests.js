import {FETCH_QUOTE_REQUESTS} from './types';
import QuoteRequest from "model/shipment/quote_request";
import {mapQuerySnapshotToModel} from "helpers/firebase/firestore_model";

export const fetchQuoteRequests = (conditions) => async dispatch => {

    try{
        const Ref = QuoteRequest.collection.queryRef(conditions)
        Ref.onSnapshot((querySnapshot) => {
            const results = mapQuerySnapshotToModel(querySnapshot, QuoteRequest)
            dispatch({type: FETCH_QUOTE_REQUESTS, payload: results});
        }, function(error) {console.log("Error getting documents: ", error);});
    }
    catch (e) {
        console.error(e.message)
    }
};

