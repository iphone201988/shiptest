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

class ShipmentDetailsView extends React.Component {

  constructor(props){
    
    const INITIAL_QUOTE = {
      domain: "carrier",
      shipment: props.shipment || null,
      PICKUP_SERVICES: PICKUP_SERVICES,
      DELIVERY_SERVICES: DELIVERY_SERVICES,
      remove_map: props.remove_map || false,
      detailsView: undefined,
    }

    super(props);
    this.state = { ...INITIAL_QUOTE };
  }

  componentDidMount() {
		this.setOptions()
	}

  setOptions = () => {
		this.setState({
			detailsView: this.props.itemTabKey,
		})
	}

  componentDidUpdate(prevProps) {

    if ((this.props.shipment instanceof Shipment ) &&
        (prevProps.remove_map !== this.props.remove_map
            || prevProps.shipment !== this.props.shipment || prevProps.domain !== this.props.domain)) {
      this.setState({shipment: this.props.shipment, domain: this.props.domain, remove_map: this.props.remove_map})
    }
  }

  onCloseDetail = () => {
    this.props.onCloseDetail()
  }

  renderView = (detailsView, shipment) => {

    if (detailsView === "details") {
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
          <RadioButton value="details"><IntlMessages id="shipment.details.title"/></RadioButton>
          {this.props.domain === "carrier" ? <RadioButton value="resources"><IntlMessages id="general.shipment_transport_resources"/></RadioButton> : null}
          <RadioButton value="tracking"><IntlMessages id="general.tracking"/></RadioButton>
          <RadioButton value="documents"><IntlMessages id="general.documents"/></RadioButton>
        </RadioGroup>
          {this.renderView(detailsView, shipment)}
      </Box>
    </div>)

  }
}

ShipmentDetailsView.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(ShipmentDetailsView)