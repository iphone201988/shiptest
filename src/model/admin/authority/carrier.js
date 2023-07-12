import Authority from "../../authority/authority";

export default class CarrierAuthorityId extends Authority
{
	constructor(carrierAuthority){
		carrierAuthority = carrierAuthority || {}
		super(carrierAuthority)
		this.carrier_authority = carrierAuthority.carrier_authority || ""
	}
}
