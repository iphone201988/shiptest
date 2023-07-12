import DriverAuthorityID from "../authority/driver";
import CarrierUserRole from "./carrier_user_role";

export default class DriverRole extends CarrierUserRole {

  constructor(driverRole) {
    driverRole = driverRole || {}
    super(driverRole || {})
    this.status = driverRole.status
    this.driver_authority_id = new DriverAuthorityID(driverRole.driver_authority_id || {})
  }
}