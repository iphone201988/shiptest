import {DeviceProfile} from "../../base/device";
import Device from "../../base/device";

export class IoTProfile extends  DeviceProfile{

	constructor(data){
		super(data)
		this.os = data.os || ""
		this.version = data.version || ""
	}
}

export class IoTDevice extends Device {

	constructor(id=undefined, data){
		super(id, data)
		this.device_type = "iot"
		try{
			this.profile = data.profile ? new IoTProfile(data.profile) : {}
		}catch (e) {
			this.invalid = true
		}
		this.user = data.user
	}
}
