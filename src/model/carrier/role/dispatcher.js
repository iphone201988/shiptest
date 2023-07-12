import CarrierUserRole from "./carrier_user_role";

export default class DispatcherRole extends CarrierUserRole {

  constructor(RoleData) {
    super(RoleData || {})
  }
}