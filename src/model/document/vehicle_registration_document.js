import CoreModel from "../core/core";
import FirestoreCollection, {FireQuery} from "helpers/firebase/firestore/firestore_collection";
import {DOCUMENTS_TYPES} from "constants/options/documents";
import { FileAttachmentsData, AssociatedResource } from "./document";

export default class VehicleRegistrationDocument extends CoreModel {
    
    static collection = new FirestoreCollection("Documents", VehicleRegistrationDocument, [
        [new FireQuery('type' === DOCUMENTS_TYPES.vehicle_registration.key)]
    ])

    constructor(id, data,) {
        super(id)
        this.name = data.name
        this.type = data.type
        this.visibility = data.visibility
        this.country = data.country
        this.province_state = data.province_state
        this.permit_number = data.permit_number
        this.license_plate = data.license_plate
        this.effective_to_expiry_date = data.effective_to_expiry_date
        this.attachments = (data.attachments || []).map(attachment => new FileAttachmentsData(attachment))
        this.attachments_path = data.attachments_path || ""
        this.associated_resource = new AssociatedResource(data.associated_resource)

    }
}