import BackendHelper from './index'
import {
	ShipHaulBackendURL,
	ShipHaulSAPIBackendURL
} from 'settings/endpoints'
import {SHIPPER_APP, CARRIER_APP} from 'constants/application'

const queryString = require('qs');

export default class CompanyRequest{

	static async addBillingProfile(BillingProfile, auth) {
		return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "PUT", "company/billing_profile/",
			{auth: auth, require_authorization: true, data: BillingProfile})
	}

	static async getBillingProfiles(options, auth) {
		const query_str = queryString.stringify(options, { indices: false })
		return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "GET", `company/billing_profiles/?${query_str}`,
			{require_authorization: true, app: SHIPPER_APP})
	}

	static async addCompanyLocation(LocationData, auth) {
		return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "PUT", "company/location/",
			{auth: auth, require_authorization: true, data: LocationData})
	}

	static async deleteCompanyLocation(CompanyLocationId, auth) {

		const query_str = queryString.stringify({company_location_id: CompanyLocationId}, { indices: false })
		return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "DELETE", `company/location/?${query_str}`,
			{auth: auth, require_authorization: true})
	}

	static async getCompanyIntegrations() {
		return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", "/company/integrations/",
			{require_authorization: true, app: CARRIER_APP})
	}

	static async getCompanyIntegration(provider) {

		const query_str = queryString.stringify({provider: provider}, { indices: false })
		return await BackendHelper.fetchBackend(ShipHaulBackendURL, "GET", `/company/integration/?${query_str}`,
			{require_authorization: true, app: CARRIER_APP})
	}

	static async addCompanyIntegration(provider, authCode){
		const data = {provider: provider, code: authCode}
		return await BackendHelper.fetchBackend(ShipHaulBackendURL, "POST", "/company/integration/",
			{require_authorization: true, app: CARRIER_APP, data: data})
	}

	static async disconnectCompanyIntegration(provider){
		return await BackendHelper.fetchBackend(ShipHaulBackendURL, "DELETE", "/company/integration/",
			{require_authorization: true, app: CARRIER_APP})
	}

	static async activateCompanyIntegration(provider){
		return await BackendHelper.fetchBackend(ShipHaulBackendURL, "POST", "/company/integrations/activate/",
			{require_authorization: true, app: CARRIER_APP})
	}

	static async deactivateCompanyIntegration(provider){
		return await BackendHelper.fetchBackend(ShipHaulBackendURL, "POST", "/company/integrations/deactivate/",
			{require_authorization: true, app: CARRIER_APP})
	}

}