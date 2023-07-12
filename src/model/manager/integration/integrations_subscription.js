import {FireQuery} from "helpers/firebase/firestore/firestore_collection";
import CompanyIntegration from "../../integration/company_integration";
import {updateIntegrationCredential} from "helpers/firebase/firebase_functions/integrations";
import {INTEGRATION_PROVIDERS} from "./integrations_map";

export const setIntegrationSubscription = (companyId) => {
  try{
    const conditions = [new FireQuery("company_account.id", "==", companyId)]
    CompanyIntegration.collection.query(conditions,
      (results) => {
        results.forEach(result =>{
          const integration = new CompanyIntegration(result.id, result)
          if (integration.isCredentialsExpired()){
            updateIntegrationCredential({provider: integration.provider}).then(x=>{}).catch(err => console.error(err))
          }
          const provider = INTEGRATION_PROVIDERS[integration.provider]
          if (provider && provider.api){
            provider.api.setIntegrationObject(integration)
          }
        })
      },
      true)
  }
  catch (e) {
    console.error(e.message)
  }
}
