import FirestoreCollection, {FireQuery} from "helpers/firebase/firestore/firestore_collection";
import CoreModel from "../core/core";

export class CompanyAccountAssociation{
    constructor(data){
        this.id = data.id || ''
    }
}


export default class CompanyAccount extends CoreModel{

    static collection = new FirestoreCollection("Company", CompanyAccount,
    [new FireQuery('domain', '==', this.domain)])

    constructor(id, data)
    {
        super(id, data)
        data = data || {}
        this.id = id
        this.domain = data.domain
        this.default_billing_profile = data.default_billing_profile || {}
        this.account_status = data.account_status
        this.profile = data.profile
    }
}
