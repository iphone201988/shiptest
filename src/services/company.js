import CompanyRequest from "helpers/backend/company";
import {handle_backend_response} from "helpers/error/error_handler";



export default class CompanyService{

	static addBillingProfile(billingProfile, auth){
		return CompanyRequest.addBillingProfile(billingProfile, auth).then(handle_backend_response)
			.then(res => res.json())
			.catch(e=> {
				console.log(e.message)
				throw e
			})
	}

	static getBillingProfiles(options){

		return CompanyRequest.getBillingProfiles(options).then(handle_backend_response)
			.then(res => res.json())
			.catch(e=> {
				console.log(e.message)
				throw e
			})
	}

	static addCompanyLocation(LocationData, auth){
		return CompanyRequest.addCompanyLocation(LocationData, auth).then(handle_backend_response)
			.then(res => res.json())
			.catch(e=> {
				console.log(e.message)
				throw e
			})
	}

	static deleteCompanyLocation(CompanyLocationId, auth){
		return CompanyRequest.deleteCompanyLocation(CompanyLocationId, auth).then(handle_backend_response)
			.then(res => res.json())
			.catch(e=> {
				console.log(e.message)
				throw e
			})
	}

	static addCompanyIntegration(integrationData, auth){
		return CompanyRequest.addCompanyIntegration(integrationData, auth).then(handle_backend_response)
			.then(res => res.json())
			.catch(e=> {
				console.log(e.message)
				throw e
			})
	}

	static getCompanyIntegration(provider, auth){
		return CompanyRequest.getCompanyIntegration(provider, auth).then(handle_backend_response)
			.then(res => res.json())
			.catch(e=> {
				console.log(e.message)
				throw e
			})
	}

	static getCompanyIntegrations(auth){
		return CompanyRequest.getCompanyIntegrations(auth).then(handle_backend_response)
			.then(res => res.json())
			.catch(e=> {
				console.log(e.message)
				throw e
			})
	}
}