import AdminUserRole from "./admin_user_role";

export default class AdminRole extends AdminUserRole {

  constructor(RoleData) {
    super(RoleData || {})
  }

}