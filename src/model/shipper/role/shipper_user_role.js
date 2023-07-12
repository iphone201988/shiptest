import UserRole from "../../role/user_role";



export default class ShipperUserRole extends UserRole {

  constructor(userRoleData) {
    super(userRoleData || {})
  }
}