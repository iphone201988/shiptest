
const collectionModels = {
    shipment_template: require("./shipment/shipmentTemplate").default,
    carrier_shipment: require("./shipment/shipment").default,
    shipper_shipment: require("./shipment/shipment").default,
    admin_shipment: require("./shipment/shipment").default,
    carrier_quote_request: require("./shipment/quote_request").default,
    shipper_quote_request: require("./shipment/quote_request").default,
    carrier_quote_offer: require("./shipment/quote_offer").default,
    shipper_quote_offer: require("./shipment/quote_offer").default,
    carrier_vehicle: require("./asset/vehicle").default,
    carrier_trailer: require("./asset/trailer").default,
    shipper_vehicle: require("./asset/vehicle").default,
    shipper_trailer: require("./asset/trailer").default,
    carrier_user: require("./user/carrier_user").default,
    shipper_user: require("./user/shipper_user").default,
    admin_user: require("./user/admin_user").default,
    carrier_company_location: require("./location/company_location").default,
    shipper_company_location: require("./location/company_location").default,
    carrier_transport_rate: require("./rate/carrier_transport_rate").default,
    carrier_billing_profile: require("./billing/billing_profile").default,
    shipper_billing_profile: require("./billing/billing_profile").default,
    device: require("./base/device").default,
    document: require("./document/document").default,
    vehicle_registration_documents: require("./document/vehicle_registration_document").default,
    carrier_integrations: require("./integration/company_integration").default,
    shipper_integrations: require("./integration/company_integration").default,
    schedule_event: require("./event/schedule_event").default,
    company_account: require("./company/company").default,
    carrier_account: require("./carrier/carrier").default,
    shipper_account: require("./shipper/shipper").default,
    device_tracking: require("./base/device_tracking").default,
    eld_device_tracking: require("./base/device_tracking").ELDTracking,
    notifications: require("./notification/notification").default,
    payment_method: require("./billing/payment_method").default,
    invoice: require("./invoice/invoice").default,
}

export function selectCollectionModel(key){
    const collectionModel = collectionModels[key] || {}
    if (collectionModel === {}){
        console.error(`collectionModel ${key} not supported`)
    }
    return collectionModel
}
