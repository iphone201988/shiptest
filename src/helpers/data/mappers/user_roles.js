
export function roleTypeToRoleObject(roleType, role={}) {
  return {
    permissions: {},
    profile: {},
    status: "active",
    type: roleType,
    ... role
  }

}