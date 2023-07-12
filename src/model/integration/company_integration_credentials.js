import CoreModel from "../core/core"
import FirestoreCollection from "helpers/firebase/firestore/firestore_collection";
import { dateNow }  from 'helpers/data/datetime'

// class CompanyIntegrationCredentials extends CoreModel {
//
//     static collection = new FirestoreCollection("CompanyIntegrationsCredentials", CompanyIntegrationCredentials,[])
//
//     constructor(id, data) {
//         data = data || {}
//         super(id)
//         this.type = data.type
//         this.company_account = data.company_account
//         this.credentials = new Credentials(data.credentials)
//         this.provider = data.provider || ""
//         this.type = data.type || ""
//     }
//
//     static getCompanyIntegrationId(provider, companyId){
//         return `${provider}_${companyId}`
//     }
//
//     isExpired(){
//         const lapse_window = 120
//         const expiration = (this.credentials || {}).expiration || 0 - lapse_window
//         return dateNow() > expiration
//     }
// }
//
// export default CompanyIntegrationCredentials

