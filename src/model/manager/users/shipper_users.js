import {FireQuery} from "helpers/firebase/firestore/firestore_collection";
import ShipperUser from "../../user/shipper_user";
import {setCollectionSubscription} from "../data_subscription";

export let ActiveUsers = {}

export const setActiveShippersUsers= (companyId) => {
  const conditions = [new FireQuery("company_account.id", "==", companyId), new FireQuery("account_status", "==", 'active')]
  setCollectionSubscription(ShipperUser, ActiveUsers, conditions)
}