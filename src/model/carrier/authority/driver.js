import Authority from "../../authority/authority";


export default class DriverAuthorityID extends Authority
{
  constructor(driverAuthority){
    driverAuthority = driverAuthority || {}
    super(driverAuthority || {})
    this.id_number = driverAuthority.id_number
    this.license_class = driverAuthority.license_class
  }
}


