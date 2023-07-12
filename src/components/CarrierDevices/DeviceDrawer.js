import React from "react";
import {PropTypes} from "prop-types";
import {injectIntl} from "react-intl";
import Device from "model/base/device";
import DeviceDetailsView from "./DeviceDetailsView";
import DeviceTrackingView from "./DeviceTrackingView";
import DeviceResourcesView from "./DeviceResourcesView";
import { RadioGroup, RadioButton } from "../uielements/radio";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";


class DeviceDrawer extends React.PureComponent {
  state = { visible: false };

  constructor(props){
    const INITIAL_QUOTE = {
      is_shipper: false,
      device: null,
      detailsView: undefined
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

    if ((this.props.device instanceof Device)
      && (prevProps.device !== this.props.device || prevProps.is_shipper !== this.props.is_shipper)) {
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

  renderView = (detailsView) => {
    if (detailsView === "details") {
      return (
        <>
            <DeviceDetailsView is_shipper={this.state.is_shipper} onCloseDetail={this.onCloseDetail} device={this.state.device}/>
        </> 
      )
    } 
    else if (detailsView === "resources") {
       return (
        <DeviceResourcesView device={this.state.device} onCloseDetail={this.onCloseDetail}/>
       )
    }
    else if (detailsView === "track_device") {
    return (
        <>
            <DeviceTrackingView is_shipper={this.state.is_shipper} onCloseDetail={this.onCloseDetail} device={this.state.device}/>
        </> 
    )
}
  }

  render() {
    const {device, detailsView} = this.state

    if (device === null){
      return ("")
    }

    return (
      <div>
      <Box>
        <RadioGroup
          buttonStyle="solid"
          id="DeviceDetails"
          name="DeviceDetails"
          value={detailsView}
          onChange={event => {
            this.setState({detailsView: event.target.value})
          }}
        >
          <RadioButton value="details"><IntlMessages id="device.details.title"/></RadioButton>
          <RadioButton value="resources"><IntlMessages id="general.resources"/></RadioButton>
          <RadioButton value="track_device"><IntlMessages id="general.track_device"/></RadioButton>
        </RadioGroup>
        {
          this.renderView(detailsView)
        }
      </Box>
    </div>
    );
  }
}

DeviceDrawer.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(DeviceDrawer)