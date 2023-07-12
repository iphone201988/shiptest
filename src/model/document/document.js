import CoreModel from "../core/core";
import FirestoreCollection, {FireQuery} from "helpers/firebase/firestore/firestore_collection";

export class FileAttachmentsData {

    constructor(data) {
        this.file_name = data.file_name
        this.full_path = data.full_path
    }
}

export class AssociatedResource {

    constructor(data) {
        data = data || {}
        this.id = data.id
        this.type = data.type
    }

}

export default class Document extends CoreModel {

    static collection = new FirestoreCollection("Documents", Document, [])

    constructor(id=undefined, data){
        super(id);
        this.name = data.name
        this.type = data.type
        this.category = data.category;
        this.company_account = data.company_account
        this.tags = data.tags || []
        this.information = data.information || ""
        this.reference = data.reference || ""
        this.info = data.info || {}
        this.status = data.status
        this.attachments = (data.attachments || []).map(attachment => new FileAttachmentsData(attachment))
        this.attachments_path = data.attachments_path || ""
        this.associated_resource = new AssociatedResource(data.associated_resource)
    }
}
