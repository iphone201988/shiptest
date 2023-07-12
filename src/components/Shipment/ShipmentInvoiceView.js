import React from "react";
import {injectIntl, intlShape} from "react-intl";
import { RadioGroup, RadioButton } from "components/uielements/radio";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";

import {
  PICKUP_SERVICES,
  DELIVERY_SERVICES,
} from "constants/options/shipping";


import Shipment from "model/shipment/shipment";

import {
  renderShipmentFreightMode,
  renderShipmentItinerary
} from "../Shipment/ShipmentComponents";
import Card from "containers/Uielements/Card/card.style";
import ShipmentResourcesView from "./ShipmentResourcesView"
import ShipmentDocumentsView from "containers/CarrierShipments/shipment_documents_view";
import ShipmentTrackingView from "./ShipmentTrackingView"

class ShipmentInvoiceView extends React.Component {

  constructor(props){
    
    const INITIAL_QUOTE = {
      domain: "shipping",
      shipment: props.shipment.shipmentDetails || null,
      PICKUP_SERVICES: PICKUP_SERVICES,
      DELIVERY_SERVICES: DELIVERY_SERVICES,
      remove_map: props.remove_map || false,
      detailsView: 'shipment_info',
    }

    super(props);
    this.state = { ...INITIAL_QUOTE };
  }

  componentDidMount() {
    console.log(this.props,"2we3")
    console.log(this.props.shipment.shipmentDetails,"SSSSSSSSSS");
		this.setOptions()
	}

  setOptions = () => {
		this.setState({
			detailsView: this.props.itemTabKey,
		})
	}

  componentDidUpdate(prevProps) {

    if ((this.props.shipment.shipmentDetails instanceof Shipment ) &&
        (prevProps.remove_map !== this.props.remove_map
            || prevProps.shipment !== this.props.shipment || prevProps.domain !== this.props.domain)) {
      this.setState({shipment: this.props.shipment.shipmentDetails, domain: this.props.domain, remove_map: this.props.remove_map})
    }
  }

  onCloseDetail = () => {
    this.props.onCloseDetail()
  }

  renderView = (detailsView, shipment) => {

    if (detailsView === "shipment_info") {
      return (
        <>
          <Card title={this.props.intl.formatMessage({id: 'freight.types.title'})}>
            {renderShipmentFreightMode(shipment, this.props.intl.formatMessage, {showTrailerTypes: true})}
          </Card>
          <Card title={this.props.intl.formatMessage({id: 'shipment.itinerary.title'})}>
            {renderShipmentItinerary(shipment, this.props.intl.formatMessage)}
          </Card>
        </>
      )
    }
    else if (detailsView === "resources") {
      return (
        <Card>
          <ShipmentResourcesView
            shipment={shipment}
            onCloseDetail={this.onCloseDetail}
            />
        </Card>
      )
    }
    else if (detailsView === "tracking") {
      return (
        <Card>
          <ShipmentTrackingView
            shipment={shipment}
            onCloseDetail={this.onCloseDetail}
            />
        </Card>
      )
    }else if (detailsView === "documents") {
      return <Card>
        <ShipmentDocumentsView shipmentId={shipment.id}/>
      </Card>
    }else{
      return ""
    }

  }


  render() {
    const {shipment, detailsView} = this.state
    console.log(detailsView,"detailsView detailsView")
    if (shipment === null){
      return (<div></div>)
    }
    return (
    <div>
      <Box>
        <RadioGroup
          buttonStyle="solid"
          id="ShipmentDetails"
          name="ShipmentDetails"
          value={detailsView}
          onChange={event => {
            this.setState({detailsView: event.target.value})
          }}
        >
          <RadioButton value="shipment_info"><IntlMessages id="shipment.details.title"/></RadioButton>
          <RadioButton value="tracking"><IntlMessages id="general.tracking"/></RadioButton>
          <RadioButton value="documents"><IntlMessages id="general.documents"/></RadioButton>
        </RadioGroup>
          {this.renderView(detailsView, shipment)}
      </Box>
    </div>)

  }
}

ShipmentInvoiceView.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(ShipmentInvoiceView)