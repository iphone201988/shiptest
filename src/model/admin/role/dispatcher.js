import AdminUserRole from "./admin_user_role";

export default class DispatcherRole extends AdminUserRole {

  constructor(RoleData) {
    super(RoleData || {})
  }
}