import React from "react";
import {PropTypes} from "prop-types";
import Drawer from 'antd/es/drawer'
import Shipment from "model/shipment/shipment";
import {PICKUP_SERVICES, DELIVERY_SERVICES, get_trailer_type} from "constants/options/shipping";
import ShipmentDetailsView from "./ShipmentDetailsView";

export class ShipmentDetailsDrawer extends React.PureComponent {
  state = { visible: false };

  constructor(props){
    const INITIAL_QUOTE = {
      visible: false,
      is_shipper: false,
      shipment: null,
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

  componentDidUpdate(prevProps){

    if ((this.props.shipment instanceof Shipment)
      && (prevProps.visible !== this.props.visible
        || prevProps.shipment !== this.props.shipment || prevProps.is_shipper !== this.props.is_shipper)) {
      this.setState(
        {
          visible: this.props.visible,
          shipment: this.props.shipment,
          is_shipper: this.props.is_shipper,
        })
    }
  }

  render() {
    const {shipment, visible, is_shipper, remove_map} = this.state

    if (shipment == null){
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
        {visible ?
          <ShipmentDetailsView
            shipment={shipment}
            remove_map={remove_map}
          /> : ""
        }


      </Drawer>
    );
  }
}

ShipmentDetailsDrawer.contextTypes = {
  intl: PropTypes.object.isRequired,
};
