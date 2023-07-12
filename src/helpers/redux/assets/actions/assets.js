import {FETCH_ACTIVE_VEHICLES, FETCH_ACTIVE_TRAILERS} from './types';
import {FireQuery} from "helpers/firebase/firestore/firestore_collection";
import {fetchCollection} from "helpers/redux/helpers/actions/data_subscriptions";
import Vehicle from "model/asset/vehicle";
import Trailer from "model/asset/trailer";

export const fetchActiveVehicles = (companyId, dispatch) => {
    const conditions = [
        new FireQuery("company_account.id", "==", companyId),
        new FireQuery("active", "==", true),
    ]
    fetchCollection(FETCH_ACTIVE_VEHICLES, Vehicle, conditions, dispatch)
}

export const fetchActiveTrailers = (companyId, dispatch) => {
    const conditions = [
        new FireQuery("company_account.id", "==", companyId),
        new FireQuery("active", "==", true),
    ]
    fetchCollection(FETCH_ACTIVE_TRAILERS, Trailer, conditions, dispatch)
}
