import UserRole from "../../role/user_role";



export default class AdminUserRole extends UserRole {

  constructor(userRoleData) {
    super(userRoleData || {})
  }
}