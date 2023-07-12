import ShipperUserRole from "./shipper_user_role";

export default class ManagerRole extends ShipperUserRole {

  constructor(RoleData) {
    super(RoleData || {})
  }
}