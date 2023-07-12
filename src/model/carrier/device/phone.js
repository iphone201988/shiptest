import {DeviceProfile} from "../../base/device";
import Device from "../../base/device";

export class PhoneProfile extends  DeviceProfile{

	constructor(data){
		super(data)
		this.os = data.os || ""
		this.version = data.version || ""
	}
}


export class PhoneDevice extends Device {

	constructor(id=undefined, data){
		super(id, data)
		this.device_type = "phone"
		// this.tracking_profile
		try{
			this.profile = data.profile ? new PhoneProfile(data.profile) : {}
		}catch (e) {
			this.invalid = true
		}
		this.user = data.user
	}
}
