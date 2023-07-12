import React from "react";
import {injectIntl, intlShape} from "react-intl";

import {
  PICKUP_SERVICES,
  DELIVERY_SERVICES,
} from "constants/options/shipping";

import QuoteRequest from "model/shipment/quote_request";

import Card from "containers/Uielements/Card/card.style";
import {renderShipmentFreightMode, renderShipmentItinerary} from "./ShipmentComponents";


class QuoteRequestDetailsView extends React.Component {

  constructor(props){
    const INITIAL_QUOTE = {
      is_shipper: false,
      quote: props.quote || null,
      PICKUP_SERVICES: PICKUP_SERVICES,
      DELIVERY_SERVICES: DELIVERY_SERVICES,
      remove_map: props.remove_map || false,
    }

    super(props);
    this.state = { ...INITIAL_QUOTE };
  }

  componentDidUpdate(prevProps) {

    if ((this.props.quote instanceof QuoteRequest ) &&
        (prevProps.remove_map !== this.props.remove_map
            || prevProps.quote !== this.props.quote || prevProps.is_shipper !== this.props.is_shipper)) {
      this.setState({quote: this.props.quote, is_shipper: this.props.is_shipper, remove_map: this.props.remove_map})
    }
  }

  render() {
    const {quote} = this.state

    if (quote === null){
      return (<div></div>)
    }

    return (<div>
      <Card title={this.props.intl.formatMessage({id: 'freight.types.title'})}>
        {renderShipmentFreightMode(quote, this.props.intl.formatMessage, {showTrailerTypes: true})}
      </Card>
      <Card title={this.props.intl.formatMessage({id: 'shipment.itinerary.title'})}>
        {renderShipmentItinerary(quote, this.props.intl.formatMessage)}
      </Card>
    </div>)

  }
}

QuoteRequestDetailsView.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(QuoteRequestDetailsView)