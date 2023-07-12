import DispatcherRole from "./dispatcher";
import ManagerRole from "./manager";
import DriverRole from "./driver";
import AdminRole from "./admin";

export function mapToAdminRoleObject(role_data){
  /* convert a role data from response json to the role object*/

  if (role_data.type === 'role_admin'){
    return new AdminRole(role_data)
  }
  else if (role_data.type === 'role_dispatcher'){
    return new DispatcherRole(role_data)
  }
  else if (role_data.type === 'role_driver'){
    return new DriverRole(role_data)
  }
  else if (role_data.type === 'role_manager'){
    return new ManagerRole(role_data)
  }else {
    return undefined
  }

}

export function RoleLanguageId(RoleObject)
{

  const prefix = "carrier.role"

  if (RoleObject instanceof AdminRole) {
    return `${prefix}.admin`
  } else if (RoleObject instanceof DispatcherRole) {
    return `${prefix}.dispatcher`
  } else if (RoleObject instanceof DriverRole) {
    return `${prefix}.driver`
  } else if (RoleObject instanceof ManagerRole) {
    return `${prefix}.manager`
  } else {
    return undefined
  }
}

