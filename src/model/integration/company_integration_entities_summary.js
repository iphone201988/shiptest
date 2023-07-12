import CoreModel from "model/core/core";
import FirestoreCollection from "helpers/firebase/firestore/firestore_collection";

export default class CompanyIntegrationEntitiesSummary extends CoreModel {

  static collection = new FirestoreCollection("CompanyIntegrationEntitiesSummary", CompanyIntegrationEntitiesSummary,[])

  constructor(id, data) {
    data = data || {}
    super(id)
    this.type = data.type;
    this.entities = data.entities || {}
  }

  static getId(provider, type, companyId){
    return `${provider}_${type}_${companyId}`
  }
}