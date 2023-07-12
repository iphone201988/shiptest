

class CompanyIntegrationsCredentials  {

  constructor(companyIntegrationsCredentials=[]) {
    this.companyIntegrationsCredentials = {}
    companyIntegrationsCredentials.forEach((companyIntegrationCredentials) => {
      const provider = companyIntegrationCredentials.provider
      if (provider){
        this.companyIntegrationsCredentials[provider] = companyIntegrationCredentials
      }
    })
  }
}


export default CompanyIntegrationsCredentials;