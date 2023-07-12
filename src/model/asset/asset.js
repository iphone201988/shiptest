import CoreModel from "../core/core";

export default class  Asset extends CoreModel {
	constructor(id=undefined, data){
		super(id)
		try {
			this.status = data.status || undefined
			this.profile = {}
			this.active = data.active || undefined
			this.asset_type = data.asset_type || ""
		}catch (e) {
			this.invalid = true
		}
	}

	isValid = () =>{
		return !this.invalid
	}


}
