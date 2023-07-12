import User from './user'
import {mapToAdminRoleObject} from "../admin/role/util";
import FirestoreCollection from "helpers/firebase/firestore/firestore_collection";
import FireQuery from 'helpers/firebase/firestore/firestore_collection'


export default class AdminUser extends User{

  static collection = new FirestoreCollection("Users", AdminUser,[new FireQuery('domain', '==', "admin")])

  // static collection = new FirestoreCollection("Users", AdminUser,
  // [new FireQuery('domain', '==', "admin")])

  constructor(id, userData) {
    userData = userData || {}
    super(id, userData);
    try{
      this.roles = userData.roles.map(role_data => mapToAdminRoleObject(role_data))
    }catch (e) {
      this.roles = []
    }
  }
}