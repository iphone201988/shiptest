
export default class UserRole {
  constructor(role_data){
    this.type = role_data.type || ""
    this.status = role_data.status || ""
    this.profile = role_data.profile || ""
    this.permissions = role_data.permissions || []
  }
}
