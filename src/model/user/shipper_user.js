import User from './user'
import {mapToShipperRoleObject} from "../shipper/role/util";
import FirestoreCollection from "helpers/firebase/firestore/firestore_collection";
import { FireQuery } from 'helpers/firebase/firestore/firestore_collection';

export default class ShipperUser extends User{

  static collection = new FirestoreCollection("Users", ShipperUser,[new FireQuery('domain', '==', "shipping")])

  constructor(id, userData){
    userData = userData || {}
    super(id, userData);
    try{
      this.roles = userData.roles.map(role_data => mapToShipperRoleObject(role_data))
    }catch (e) {
      this.roles = []
    }
  }
}

