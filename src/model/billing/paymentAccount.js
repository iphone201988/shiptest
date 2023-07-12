import CoreModel from "../core/core";
import FirestoreCollection from "helpers/firebase/firestore/firestore_collection";


export class PaymentAccount extends CoreModel{

  static collection = new FirestoreCollection("PaymentAccounts", PaymentAccount,[])

  constructor(id, data) {
    data = data || {}
    super(id)
    this.type = data.type
    this.company_account = data.company_account
    this.profile = data.profile
  }

  static getId = (companyId) => {
    return `stripe_account_${companyId}`
  }
}