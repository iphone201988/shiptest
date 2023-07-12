import CarrierUserRole from "./carrier_user_role";

export default class ManagerRole extends CarrierUserRole {

  constructor(RoleData) {
    super(RoleData || {})
  }
}