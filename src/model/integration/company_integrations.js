import CompanyIntegration from "./company_integration";

export default class CompanyIntegrations {

  constructor(integrationsData = []) {
    this.integrations = {}
    integrationsData.forEach((integrationData)=> {
      const integration = new CompanyIntegration(integrationData)
      if (integration.provider){
        this.integrations[integration.provider] = integration
      }
    })
  }

}