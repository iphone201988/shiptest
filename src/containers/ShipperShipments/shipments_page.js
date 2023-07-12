import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { RadioGroup, RadioButton } from "components/uielements/radio";

import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
import Shipments from "./shipments";
import ToogleButton from 'containers/Topbar/toggleButton'
class ShipmentsPage extends PureComponent {

  INITIAL_STATE = {
    ShipmentView: "active"
  }

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
  }
  
  render() {

    const {ShipmentView} = this.state


    return (

      <LayoutWrapper>
        <Box>
        <div className="filterBox">
          <RadioGroup
            buttonStyle="solid"
            id="ShipmentView"
            name="ShipmentView"
            value={ShipmentView}
            onChange={event => {
              this.setState({ShipmentView: event.target.value})
            }}
          >
            <RadioButton value="active"><IntlMessages id="shipments.active.name"/></RadioButton>
            <RadioButton value="history"><IntlMessages id="shipments.history.name"/></RadioButton>
          </RadioGroup>
            <div className={"toggleOuter"}>
              <ToogleButton {...this.props} />
            </div>
          </div>
          <Shipments view={ShipmentView}/>
        </Box>
      </LayoutWrapper>

    );
  }
}

export default connect()(ShipmentsPage);