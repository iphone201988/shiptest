import React, {lazy} from "react";
// import TrailerDetails from "containers/Carrier/TrailerDetails";
const InvoiceDetailview = lazy(() => import("../InvoiceDetails/invoice"));
const ShipmentInvoiceView = lazy(() => import("../Shipment/ShipmentInvoiceView"));
const ShipmentDetailsView = lazy(() => import("../Shipment/ShipmentDetailsView"));
const QuoteRequestDetailsView = lazy(() => import("../Shipment/QuoteRequestDetailsView"));
const QuoteOfferDetails = lazy(() => import("../Shipment/QuoteOfferDetails"));
const CarrierVehicleDetails = lazy(() => import("containers/Assets/Carrier/VehicleDetails"));
const CarrierTrailerDetails = lazy(() => import("containers/Assets/Carrier/TrailerDetails"));
const ShipperVehicleDetails = lazy(() => import("containers/ShipperAssets/VehicleDetails"));
const ShipperTrailerDetails = lazy(() => import("containers/ShipperAssets/TrailerDetails"));
const IntegrationDrawerPage = lazy(() => import("containers/CompanyIntegrations/integrations_drawer_page"));
const CarrierUserDetailsView = lazy(() => import("../Users/CarrierUserDetailsView"));
const ShipperUserDetailsView = lazy(() => import("../Users/ShipperUserDetailsView"));
const AdminUserDetailsView = lazy(() => import("../Users/AdminUserDetailsView"));
const CarrierDrawerDetailsView = lazy(() => import("../CarrierDevices/DeviceDrawer"));
const CarrierRatesDetailsView = lazy(() => import("../CarrierRates/CarrierRatesDetailsView"));
const CompanyLocationDrawer= lazy(() => import("../Location/CompanyLocation/CompanyLocationDrawer"));
const CarrierBillingProfileDetailsView = lazy(() => import("../../containers/CarrierBilling/BillingProfileDetailsView"));
const ShipperBillingProfileDetailsView = lazy(() => import("../../containers/ShipperBilling/BillingProfileDetailsView"));
const PaymentMethodDetailsView = lazy(() => import("../../containers/PaymentMethod/PaymentDetailsView"));
const DocumentsDetailsView = lazy(() => import("../Document/shipment_documents_details_view"));
const TemplateDetails = lazy(() => import("../Shipment/TemplateDetails.js"))
const CompanyDetailsView = lazy(() => import("../Company/CompanyDetailsView.js"));
const AssetDocumentsDetailsView = lazy(() => import ("../Document/assets_documents_details_view"))

export  function  renderDetailsView(type, item, onCloseDetail, itemTabKey){
 
    if (type === "carrier_shipment"){
        return <ShipmentDetailsView domain={"carrier"} onCloseDetail={onCloseDetail} shipment={item} itemTabKey={itemTabKey}/>
    }else if (type === "shipper_shipment"){
        return <ShipmentDetailsView domain={"shipper"} onCloseDetail={onCloseDetail} shipment={item} itemTabKey={itemTabKey}/>
    }else if (type === "carrier_quote_request"){
        return <QuoteRequestDetailsView domain={"carrier"} onCloseDetail={onCloseDetail} quote={item} itemTabKey={itemTabKey}/>
    }
    else if (type === "shipper_quote_request"){
        return <QuoteRequestDetailsView domain={"shipper"} onCloseDetail={onCloseDetail} quote={item} itemTabKey={itemTabKey}/>
    }else if (type === "carrier_quote_offer"){
        return <QuoteOfferDetails domain={"carrier"} onCloseDetail={onCloseDetail} quote={item} itemTabKey={itemTabKey}/>
    }
    else if (type === "shipper_quote_offer"){
        return <QuoteOfferDetails domain={"shipper"} onCloseDetail={onCloseDetail} quote={item} itemTabKey={itemTabKey}/>
    }else if (type === "carrier_vehicle"){
        return <CarrierVehicleDetails domain={"carrier"} onCloseDetail={onCloseDetail} vehicle={item} itemTabKey={itemTabKey}/>
    }else if (type === "carrier_trailer"){
        return <CarrierTrailerDetails domain={"carrier"} onCloseDetail={onCloseDetail} trailer={item} itemTabKey={itemTabKey}/>
    }else if (type === "shipper_vehicle"){
        return <ShipperVehicleDetails domain={"carrier"} onCloseDetail={onCloseDetail} vehicle={item} itemTabKey={itemTabKey}/>
    }else if (type === "shipper_trailer"){
        return <ShipperTrailerDetails domain={"carrier"} onCloseDetail={onCloseDetail} trailer={item} itemTabKey={itemTabKey}/>
    }else if (type === "carrier_company_location"){
        return <CompanyLocationDrawer domain={"carrier"} onCloseDetail={onCloseDetail} company_location={item} itemTabKey={itemTabKey}/>
    }else if (type === "shipper_company_location"){
        return <CompanyLocationDrawer domain={"shipper"} onCloseDetail={onCloseDetail} company_location={item} itemTabKey={itemTabKey}/>
    }else if (type === "carrier_user"){
        return <CarrierUserDetailsView domain={"carrier"} onCloseDetail={onCloseDetail} user={item} itemTabKey={itemTabKey}/>
    }else if (type === "shipper_user"){
        return <ShipperUserDetailsView domain={"shipper"} onCloseDetail={onCloseDetail} user={item} itemTabKey={itemTabKey}/>
    }else if (type === "admin_user"){
        return <AdminUserDetailsView domain={"admin"} onCloseDetail={onCloseDetail} user={item} itemTabKey={itemTabKey}/>
    }else if (type === "carrier_transport_rate"){
        return <CarrierRatesDetailsView domain={"carrier"} onCloseDetail={onCloseDetail} rate={item} itemTabKey={itemTabKey}/>
    }else if (type === "carrier_integrations"){
        return <IntegrationDrawerPage domain={"carrier"} onCloseDetail={onCloseDetail} integration={item} itemTabKey={itemTabKey}/>
    }else if (type === "shipper_integrations"){
        return <IntegrationDrawerPage domain={"shipper"} onCloseDetail={onCloseDetail} integration={item} itemTabKey={itemTabKey}/>
    }
    else if (type === "device"){
        return <CarrierDrawerDetailsView domain={"carrier"} onCloseDetail={onCloseDetail} device={item} itemTabKey={itemTabKey}/>
    }
    else if (type === "carrier_billing_profile"){
        return <CarrierBillingProfileDetailsView domain={"carrier"} onCloseDetail={onCloseDetail} billing_profile={item} itemTabKey={itemTabKey}/>
    }
    else if (type === "shipper_billing_profile"){
        return <ShipperBillingProfileDetailsView domain={"carrier"} onCloseDetail={onCloseDetail} billing_profile={item} itemTabKey={itemTabKey}/>
    }
    else if (type === "payment_method"){
        return <PaymentMethodDetailsView domain={"payment_method"} onCloseDetail={onCloseDetail} payment_method={item} itemTab={itemTabKey}/>
    }
    else if (type === "document"){
        return <DocumentsDetailsView onCloseDetail={onCloseDetail} document={item}/>
    }
    else if (type === "vehicle_registration_documents"){
        return <AssetDocumentsDetailsView onCloseDetail={onCloseDetail} document={item}/>
    }
    else if (type === "shipment_template") {
        return <TemplateDetails domain={"carrier"} onCloseDetail={onCloseDetail} shipment={item} itemTabKey={itemTabKey}/>
    }
    else if (type === "carrier_account"){
        return <CompanyDetailsView domain={"carrier"} onCloseDetail={onCloseDetail} company={item} itemTabKey={itemTabKey}/>
    }
    else if (type === "shipper_account"){
        return <CompanyDetailsView domain={"shipping"} onCloseDetail={onCloseDetail} company={item} itemTabKey={itemTabKey}/>
    } 
    else if (itemTabKey === "shipment_info"){
        return <ShipmentInvoiceView domain={"shipping"} onCloseDetail={onCloseDetail} shipment={item} itemTabKey={itemTabKey}/>     
    }  else if (itemTabKey === "details"){
        return <InvoiceDetailview domain={"shipping"} onCloseDetail={onCloseDetail} shipment={item} itemTabKey={itemTabKey}/>     
    } 




    else{
        console.error(`DetailsView type ${type} not supported`)
        return ""
    }
}

