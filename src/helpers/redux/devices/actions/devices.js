import {FETCH_ACTiVE_DEVICES} from './types';
import {FireQuery} from 'helpers/firebase/firestore/firestore_collection';
import {fetchCollection} from "helpers/redux/helpers/actions/data_subscriptions";
import Device from 'model/base/device';

export const fetchActiveDevices = (companyId, dispatch) => {
  const conditions = [
    new FireQuery("company_account.id", "==", companyId),
    new FireQuery("status", "==", "available")
  ]
  fetchCollection(FETCH_ACTiVE_DEVICES, Device, conditions, dispatch)
}