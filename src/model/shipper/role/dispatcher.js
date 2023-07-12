import ShipperUserRole from "./shipper_user_role";

export default class DispatcherRole extends ShipperUserRole {

  constructor(RoleData) {
    super(RoleData || {})
  }
}