import React from "react";
import Drawer from 'antd/es/drawer'
import {PropTypes} from "prop-types";
import QuoteRequest from "model/shipment/quote_request";
import {PICKUP_SERVICES, DELIVERY_SERVICES} from "constants/options/shipping";
import QuoteRequestDetailsView from "./QuoteRequestDetailsView";

export class QuoteDetailsDrawer extends React.PureComponent {
  state = { visible: false };

  constructor(props){
    const INITIAL_QUOTE = {
      visible: false,
      is_shipper: false,
      quote: undefined,
      PICKUP_SERVICES: PICKUP_SERVICES,
      DELIVERY_SERVICES: DELIVERY_SERVICES,
      remove_map: false
    }

    super(props);
    this.state = { ...INITIAL_QUOTE };
  }

  onClose = () => {
    this.setState({
      visible: false,
      remove_map: true,
    });
    if (this.props.onClose){
      this.props.onClose()
    }
  };

  componentDidUpdate(prevProps) {
    if ((this.props.quote instanceof QuoteRequest)
        && (prevProps.visible !== this.props.visible
        || prevProps.quote !== this.props.quote || prevProps.is_shipper !== this.props.is_shipper)) {
      this.setState(
          {
            visible: this.props.visible,
            quote: this.props.quote,
            is_shipper: this.props.is_shipper,
          })
    }
  }

  render() {
    const {quote, visible, remove_map} = this.state

    if (!quote){
      return ("")
    }

    return (

          <Drawer
              width="80%"
              placement="right"
              closable={true}
              onClose={this.onClose}
              visible={visible}
          >
            {quote && visible ?
            <QuoteRequestDetailsView
              quote={quote}
              remove_map={remove_map}
            /> : ""
            }

          </Drawer>
    );
  }
}

QuoteDetailsDrawer.contextTypes = {
  intl: PropTypes.object.isRequired,
};
