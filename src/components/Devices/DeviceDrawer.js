import React from "react";
import {PropTypes} from "prop-types";
import {injectIntl} from "react-intl";
import DeviceDetailsView from "./DeviceDetailsView";
import DeviceResourcesView from "./DeviceResourcesView";
import { RadioGroup, RadioButton } from "../uielements/radio";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";

class CompanyDeviceDrawer extends React.PureComponent {
  state = { visible: false };

 

  constructor(props){
    const INITIAL_QUOTE = {
      detailsView: undefined,
      is_shipper: undefined,
      
    }

    super(props);
    this.state = { ...INITIAL_QUOTE };
  }

  componentDidMount() {

    this.setState(
      {
        device: this.props.device,
        is_shipper: this.props.is_shipper,
        detailsView: this.props.itemTabKey
      })
  }

  componentDidUpdate(prevProps) {

    if ((prevProps.device !== this.props.device || prevProps.is_shipper !== this.props.is_shipper)) {
      this.setState(
        {
          device: this.props.device,
          is_shipper: this.props.is_shipper,
          detailsView: this.props.itemTabKey
        })
    }
  }

  onCloseDetail = () => {
		this.props.onCloseDetail()
	}

  render() {
    const {device, detailsView, is_shipper} = this.state

    if (device === null){
      return ("")
    }

    return (
      <div>
      <Box>
        <RadioGroup
          buttonStyle="solid"
          id="deviceDetails"
          name="deviceDetails"
          value={detailsView}
          onChange={event => {
            this.setState({detailsView: event.target.value})
          }}
        >
          <RadioButton value="details"><IntlMessages id="device.details.title"/></RadioButton>
          <RadioButton value="resources"><IntlMessages id="general.shipment_transport_resources"/></RadioButton>
        </RadioGroup>
        {detailsView === "details" ? 
            <DeviceDetailsView is_shipper={is_shipper} onCloseDetail={this.onCloseDetail} device={device}/>
          :
            <DeviceResourcesView
              device={device}
              onCloseDetail={this.onCloseDetail}
              />
        }
      </Box>
    </div>
    );
  }
}

CompanyDeviceDrawer.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    firebase: state.FB.firebase,
		companyId: state.FB.company.companyId,
    activeVehicles: state.FB.assets.activeVehicles,
    activeTrailers: state.FB.assets.activeTrailers,
  }
}

export default compose(
  connect(mapStateToProps, {}),
  firebaseConnect()
)(injectIntl(CompanyDeviceDrawer))
