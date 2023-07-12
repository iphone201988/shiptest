import React from "react";
import {injectIntl, intlShape} from "react-intl";


import QuoteRequest from "model/shipment/quote_request";
import {
  PICKUP_SERVICES,
  DELIVERY_SERVICES,
} from "constants/options/shipping";
import QuoteOffer from "model/shipment/quote_offer";

import {renderShipmentFreightMode, renderShipmentItinerary} from "./ShipmentComponents";


class QuoteOfferDetails extends React.PureComponent {

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


  componentDidUpdate(prevProps, nextContext) {

    if ((this.props.quote instanceof QuoteRequest || this.props.quote instanceof QuoteOffer)
            || prevProps.quote !== this.props.quote ) {
      this.setState({quote: this.props.quote, is_shipper: this.props.is_shipper})
    }
  }

  render() {
    const {quote} = this.state

    if (quote === null){
      return (<div></div>)
    }
    return (
        <div>
          {renderShipmentFreightMode(quote, this.props.intl.formatMessage, {showTrailerTypes: true})}
          <br/>
          <div  style={{width: "60vw"}}>
            {renderShipmentItinerary(quote, this.props.intl.formatMessage)} 
          </div>
        </div>
    );
  }
}

QuoteOfferDetails.contextTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(QuoteOfferDetails)