import DriverAuthorityID from "../authority/driver";
import ShipperUserRole from "./shipper_user_role";


export default class DriverRole extends ShipperUserRole {

  constructor(driverRole) {
    driverRole = driverRole || {}
    super(driverRole || {})
    this.status = driverRole.status
    this.driver_authority_id = new DriverAuthorityID(driverRole.driver_authority_id || {})
  }
}