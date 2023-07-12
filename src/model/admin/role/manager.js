import AdminUserRole from "./admin_user_role";

export default class ManagerRole extends AdminUserRole {

  constructor(RoleData) {
    super(RoleData || {})
  }
}