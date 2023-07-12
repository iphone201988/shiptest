import {FireQuery} from "../../../firebase/firestore/firestore_collection";
import {fetchCollection} from "../../helpers/actions/data_subscriptions";
import {SET_CURRENT_COMPANY} from "./types";
import Shipper from "../../../../model/shipper/shipper";


export const setCurrentCompany = (companyId, dispatch) => {
  fetchCollection(SET_CURRENT_COMPANY, Shipper, companyId, dispatch)
}
