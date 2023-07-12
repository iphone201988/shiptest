import {FETCH_CARRIER_USERS, FETCH_ACTIVE_DRIVERS, FETCH_ACTIVE_CARRIER_USERS,} from './types';
import CarrierUser from "model/user/carrier_user";
import {mapQuerySnapshotToModel} from "helpers/firebase/firestore_model";
import {FireQuery} from "helpers/firebase/firestore/firestore_collection";
import {fetchCollection} from "helpers/redux/helpers/actions/data_subscriptions";

export const fetchCarrierUser = (conditions) => async dispatch => {

    try{
        const Ref = CarrierUser.collection.queryRef(conditions)
        Ref.onSnapshot((querySnapshot) => {
            const results = mapQuerySnapshotToModel(querySnapshot, CarrierUser)
            dispatch({type: FETCH_CARRIER_USERS, payload: results});
        }, function(error) {console.log("Error getting documents: ", error);});
    }
    catch (e) {
        console.error(e.message)
    }
};

export const fetchActiveCarrierUsers = (companyId, dispatch) => {
    const conditions = [
        new FireQuery("company_account.id", "==", companyId),
        new FireQuery("account_status", "==", 'active'),
    ]
    fetchCollection(FETCH_ACTIVE_CARRIER_USERS, CarrierUser, conditions, dispatch)
}

export const fetchActiveDrivers = (companyId, dispatch) => {
    const conditions = [
      new FireQuery("company_account.id", "==", companyId),
        new FireQuery("account_status", "==", 'active'),
        new FireQuery('role_types', 'array-contains', "role_driver")
    ]
    fetchCollection(FETCH_ACTIVE_DRIVERS, CarrierUser, conditions, dispatch)
}

