import {BaseShipment} from "./baseShipment";
import {SHIPMENT_STATE} from "constants/options/shipping";
import FirestoreCollection, {FireQuery} from "helpers/firebase/firestore/firestore_collection";
import {ResourceAssignment} from "./shipmentSequences"

export default class Shipment extends BaseShipment{

  static collection = new FirestoreCollection("Shipments", Shipment,
      [new FireQuery('type', '==', SHIPMENT_STATE.shipment.key)])

  constructor(id, data) {
    super(id, data)
    data = data || {}
    this.id = id;
    this.type = data?.type //SHIPMENT_STATE.shipment.key
    this.quote_request = data?.quote_request
    this.transport_resources = new TransportResources(data.transport_resources)
    // this.transport_resources = data.transport_resources

  }
}

export class TransportResources {

  constructor(data) {
    data = data || {}

    this.drivers_assignments = this.resourceAssignments(data.drivers_assignments)
    this.vehicles_assignments = this.resourceAssignments(data.vehicles_assignments)
    this.trailers_assignments = this.resourceAssignments(data.trailers_assignments)
    this.carriers_assignments = this.resourceAssignments(data.carriers_assignments)

    this.drivers = this.resourcesIds(data.drivers_assignments)
    this.vehicles = this.resourcesIds(data.vehicles_assignments)
    this.trailers = this.resourcesIds(data.trailers_assignments)
    this.carriers = this.resourcesIds(data.carriers_assignments)
  }

  resourceAssignments(resourceAssignments=[]) {
    return resourceAssignments.map(assignment => {
      return new ResourceAssignment(assignment)
    })
  }

  resourcesIds(resourceAssignments=[]) {
    const items = new Set()
    resourceAssignments.forEach(assignment => {
      items.add(assignment.resource.id)
    })
    return [...items]
  }

}