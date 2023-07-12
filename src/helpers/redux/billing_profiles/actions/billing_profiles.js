import {FireQuery} from "helpers/firebase/firestore/firestore_collection";
import {fetchCollection} from "helpers/redux/helpers/actions/data_subscriptions";
import {FETCH_ACTIVE_BILLING_PROFILES} from "./types";
import BillingProfile from "../../../../model/billing/billing_profile";

export const fetchActiveBillingProfiles = (companyId, dispatch) => {

    //TODO: add status=active condition   active=true condition
    const conditions = [
        new FireQuery("company_account.id", "==",  companyId),
    ]
    fetchCollection(FETCH_ACTIVE_BILLING_PROFILES, BillingProfile, conditions, dispatch)
}