import {FETCH_LOCATIONS, ADD_LOCATION, DELETE_LOCATION} from './types';
import CompanyLocation from "model/location/company_location";
import * as firebase from "firebase";
import {ObjectToJSON} from "../../../data/format";
import {handleHttpError} from "../../../error/errors";
import {mapQuerySnapshotToModel} from "helpers/firebase/firestore_model";

export const fetchLocations = (conditions) => async dispatch => {

    try{
        const Ref = CompanyLocation.collection.queryRef(conditions)
        Ref.onSnapshot((querySnapshot) => {
                const results = mapQuerySnapshotToModel(querySnapshot, CompanyLocation)
                dispatch({type: FETCH_LOCATIONS, payload: results});
            }, function(error) {console.log("Error getting documents: ", error);});
    }
    catch (e) {
        console.error(e.message)
    }
};

export const addCompanyLocation = (locationData) => async dispatch => {

    try{
        const addCompanyLocation = firebase.functions().httpsCallable('addCompanyLocation');
        const result = await addCompanyLocation(ObjectToJSON(locationData))
        dispatch({type: ADD_LOCATION, payload: result.data});
    } catch(error) {
        handleHttpError(error,  {throwError: true, logError:true})
    }
}

export const deleteCompanyLocation = (locationId) => async dispatch => {

    try{
        const deleteCompanyLocation = firebase.functions().httpsCallable('deleteCompanyLocation');
        const result = await deleteCompanyLocation({locationId: locationId})
        dispatch({type: DELETE_LOCATION, payload: result.data});
    } catch(error) {
        handleHttpError(error,  {throwError: true, logError:true})
    }
}