import UserRole from "../../role/user_role";



export default class CarrierUserRole extends UserRole {

  constructor(userRoleData) {
    super(userRoleData || {})
  }
}