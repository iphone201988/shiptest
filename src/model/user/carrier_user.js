import User from './user'
import {mapToCarrierRoleObject} from "../carrier/role/util";
import FirestoreCollection from "helpers/firebase/firestore/firestore_collection";
import { FireQuery } from 'helpers/firebase/firestore/firestore_collection';

export default class CarrierUser extends User{

  static collection = new FirestoreCollection("Users", CarrierUser,[new FireQuery('domain', '==', "carrier")])

  constructor(id, userData) {
    userData = userData || {}
    super(id, userData);
    try{
      this.roles = userData.roles.map(role_data => mapToCarrierRoleObject(role_data))
    }catch (e) {
      this.roles = []
    }
  }
}