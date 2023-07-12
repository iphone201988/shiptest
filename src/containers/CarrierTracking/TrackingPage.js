import React from "react";

import Map from "components/HereMaps/base_map"
import {Row} from "antd";
import {injectIntl, intlShape} from "react-intl";


class CarrierTrackingPage extends React.Component {


  constructor(props) {
    const InitialState = {}
    super(props);
    this.state = { ...InitialState };
  }

  remove_map = () => {

  }

  render(){
    return (
        <div>
          <Row>
            Asset Tracking  -- Coming Soon
          </Row>
          <Row>
              <Map ></Map>
          </Row>
        </div>
    )

  }

}

CarrierTrackingPage.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(CarrierTrackingPage)