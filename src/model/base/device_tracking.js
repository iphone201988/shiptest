import CoreModel from "../core/core";
import FirestoreCollection, {FireQuery} from "helpers/firebase/firestore/firestore_collection";
import { Position } from "./../location/location";
import { CompanyAccount } from "./../base/device";
import { TimeStamp } from "helpers/data/format";

export class ResourceAssociation {
  constructor(data) {
    this.id = data.id;
    this.provider_id = data.provider_id || "";
    this.profile = data.profile || {};
  }
}

export class UserResource extends ResourceAssociation {
  constructor(data) {
    super(data);
  }
}

export class AssetResource extends ResourceAssociation {
  constructor(data) {
    super(data);
	this.type = data.type || ""
  }
}

export class ShipmentResource extends ResourceAssociation {
  constructor(data) {
    super(data);
  }
}

export class ELDDeviceAssociations {
  constructor(data) {
    // super()
    if (data.user) {
      this.user = new UserResource(data.user || {});
    }
    if (data.asset) {
      this.asset = new AssetResource(data.asset || {});
    }
    if (data.shipment) {
      this.shipment = new ShipmentResource(data.shipment || {});
    }
  }
}

export class ELDTrackData {
  constructor(data) {

    if (data.position) {
      this.position = new Position(data.position);
    }
    this.bearing = data.bearing ? data.bearing : 0;
    this.speed = data.speed ? data.speed : "";
    this.eta = data.eta ? data.eta : "";
    this.fuel = data.fuel ? data.fuel : "";
    this.odometer = data.odometer ? data.odometer : "";
    this.engine_hours = data.engine_hours ? data.engine_hours : "";
    this.state = data.state ? data.state : "";
    this.description = data.description ? data.description : "";
  }
}

export class MobileTrackData {
  constructor(data) {
    if (data.position) {
      this.position = new Position(data.position);
    }
    if (data.bearing) {
      this.bearing = data.bearing;
    }
    if (data.speed) {
      this.speed = data.speed;
    }
    if (data.eta) {
      this.eta = data.eta;
    }
	this.timeStamp = data.timeStamp? data.timeStamp : {} ;
  }
}

export class MobileDeviceAssociations {
  constructor(data) {
    if (data.user) {
      this.user = new UserResource(data.user || {});
    }
    if (data.asset) {
      this.asset = new AssetResource(data.asset || {});
    }
    if (data.shipment) {
      this.shipment = new ShipmentResource(data.shipment || {});
    }
  }
}


export default class DeviceTracking extends CoreModel {
  static collection = new FirestoreCollection(
    "DeviceTracking",
    DeviceTracking,
    []
  );

  constructor(id, data) {
    data = data || {};
    // console.log('i am data from device tracking', data)
    super(id);
    this.type = data.type? data.type : '' ;
    this.device = data.device
    this.company_account = data.company_account?  new CompanyAccount(data.company_account) : {};
    this.timeStamp = data.timeStamp? {timestamp: TimeStamp(data.timeStamp.timestamp), track_time: TimeStamp(data.timeStamp.track_time)} : {} ;
    this.tracking_data = this.getTrackingData(data.type, data.tracking_data)
    this.associations = this.getAssociationsData(data.type, data.associations)

  }

  getTrackingData = (type, data) => {

    if(type === 'eld' || type === 'ELD'){
      return new ELDTrackData(data);
    }

    if(type === 'mobile' || type === 'Mobile'){
      return new MobileTrackData(data)
    }
  }

  getAssociationsData = (type, data) => {
    if(type === 'eld' || type === 'ELD'){
      return new ELDDeviceAssociations(data);
    }

    if(type === 'mobile' || type === 'Mobile'){
      return new MobileDeviceAssociations(data)
    }
  }

}

export class MobileTracking extends DeviceTracking {

  static collection = new FirestoreCollection(
    "DeviceTracking",
    MobileTracking,
    [new FireQuery('type', '===', 'mobile')]
  );

  constructor(id, data) {
    super(id, data)
    this.tracking_data = new MobileTrackData(data.tracking_data || {});
    this.associations = new MobileDeviceAssociations(data.associations);
  }
}

export class ELDTracking extends DeviceTracking {

  static collection = new FirestoreCollection(
    "DeviceTracking",
    ELDTracking,
    []
  );

  constructor(id, data) {
    super(id, data)
    this.tracking_data = new ELDTrackData(data.tracking_data || {});
    this.associations = new ELDDeviceAssociations(data.associations);
  }
}
