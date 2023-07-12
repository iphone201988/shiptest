import CoreModel from "../core/core"
import FirestoreCollection from "helpers/firebase/firestore/firestore_collection";
import {ValueOrDefault} from "helpers/data/mapper";
import {INTEGRATION_PROVIDERS, INTEGRATION_CATEGORIES} from "../manager/integration/integrations_map";
import {dateNow} from "helpers/data/datetime";

const UNKNOWN = "unknown"

const IntegrationCategory = (value) => {
    return ValueOrDefault(INTEGRATION_CATEGORIES, value, UNKNOWN)
}

const IntegrationProvider = (value) => {
    return ValueOrDefault(INTEGRATION_PROVIDERS, value, UNKNOWN)
}

export class IntegrationsCredentials{
    constructor(data) {
        this.type = data.type
    }

    isExpired(){
        return false
    }
}

export class Oauth2Credentials extends IntegrationsCredentials {

    constructor(data) {
        super(data)
        this.access_token = data.access_token || ""
        this.token_type = data.token_type || ""
        this.refresh_token = data.refresh_token || ""
        this.expiration = data.expiration
    }

    isExpired(){
        const lapse_window = 120
        const expiration = this.expiration.seconds || 0 - lapse_window
        return dateNow() > expiration
    }
}


export const IntegrationsCredentialsMap = {
    oauth2: Oauth2Credentials
}

class Credentials {
    constructor(data) {
        data = data || {}
        this.access_token = data.access_token
        this.expiration = data.expiration
        this.refresh_token = data.refresh_token
        this.token_type = data.token_type
    }
}

export default class CompanyIntegration extends CoreModel {

    static collection = new FirestoreCollection("CompanyIntegrations", CompanyIntegration,[])

    constructor(id, data) {
        data = data || {}
        super(id)
        this.provider = IntegrationProvider(data.provider)
        this.category = IntegrationCategory(data.category)
        this.scopes = data.scopes || []
        this.status = data.status
        this.setCredentials(data.credentials)
    }

    setCredentials(credentials){
        const CredentialsClass = IntegrationsCredentialsMap[(credentials || {}).type]
        if (CredentialsClass){
            this.credentials = new CredentialsClass(credentials)
        }
    }

    isCredentialsExpired = () => {
        try{
            return this.credentials.isExpired()
        }catch (e) {
            return true
        }
    }

    static getCompanyIntegrationId(provider, companyId){
        return `${provider}_${companyId}`
    }

    isValid = () =>{
        return true
    }
}

// export class CompanyIntegrations {
//
//     constructor(companyIntegrations = []) {
//         this.integrations = {}
//         integrationsData.forEach((integrationData)=> {
//             const integration = new CompanyIntegration(integrationData.id, integrationData)
//             if (integration.provider){
//                 this.integrations[integration.provider] = integration
//             }
//         })
//     }
//
// }