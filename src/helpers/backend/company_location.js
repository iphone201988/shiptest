import BackendHelper from './index'
import {ShipHaulSAPIBackendURL} from 'settings/endpoints'

const queryString = require('qs');

export default class CompanyLocationRequest extends BaseBackend{

    constructor(params={}) {
        super({auth: params.auth});
    }

    async addCompanyLocation(LocationData) {
        return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "PUT", "company/location/",
            {auth: this.auth, require_authorization: true, data: LocationData})
    }

    async deleteCompanyLocation(CompanyLocationId) {

        const query_str = queryString.stringify({company_location_id: CompanyLocationId}, { indices: false })
        return await BackendHelper.fetchBackend(ShipHaulSAPIBackendURL, "DELETE", `company/location/?${query_str}`,
            {auth: this.auth, require_authorization: true})
    }

}