import CoreModel from "../core/core";
import FirestoreCollection from "helpers/firebase/firestore/firestore_collection";

export default class Notification extends CoreModel {
  static collection = new FirestoreCollection("Notifications", Notification, []);

  constructor(id, data) {
    super(id);
    this.company_account = data.company_account || {};
    this.user_account = data.user_account || {};
    this.associated_resources = data.associated_resources || {};
    this.profile = data.profile || {};
    this.scope = data.scope || "";
    this.type = data.type;
    this.active = data.active || true;
  }
}


