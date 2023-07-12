import ShipperUserRole from "./shipper_user_role";

export default class AdminRole extends ShipperUserRole {

  constructor(RoleData) {
    super(RoleData || {})
  }

}