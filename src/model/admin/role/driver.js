import DriverAuthorityID from "../authority/driver";
import AdminUserRole from "./admin_user_role";

export default class DriverRole extends AdminUserRole {

  constructor(driverRole) {
    driverRole = driverRole || {}
    super(driverRole || {})
    this.status = driverRole.status
    this.driver_authority_id = new DriverAuthorityID(driverRole.driver_authority_id || {})
  }
}