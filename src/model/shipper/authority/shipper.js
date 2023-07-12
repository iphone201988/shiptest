import Authority from "../../authority/authority";

export default class ShipperAuthorityId extends Authority
{
	constructor(shipperAuthority){
		shipperAuthority = shipperAuthority || {}
		super(shipperAuthority)
		this.shipper_authority = shipperAuthority.shipper_authority || ""
	}
}
