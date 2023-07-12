import React, { PureComponent, lazy } from "react";
import { connect } from "react-redux";
import {compose} from "redux";
import {injectIntl, intlShape} from "react-intl";
import {firebaseConnect} from "react-redux-firebase";

import { RadioGroup, RadioButton } from "components/uielements/radio";
import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
import { instanceOf } from "prop-types";
import {Capitalize} from "helpers/data/string";
import {PropTypes} from "prop-types";
import {vehiclesMapToSelectOptions} from "helpers/containers/states/assets";

const CarrierNewVehicle = lazy(() => import("./new_vehicle"))
const Assets = lazy(() => import ("./assets.js"))
const ActiveVehicles = lazy(() => import("./active_vehicles"))

class VehiclesPage extends PureComponent {

  static propTypes = {
    firebase: PropTypes.object,
    companyId: PropTypes.string,
    activeVehicles: PropTypes.object,
  }

  INITIAL_STATE = {
    VehicleView: "active"
  }

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
  }

  componentDidMount() {
    if (this.props.activeVehicles != undefined) {
        this.setVehiclesOptions()
    }
  }

  setVehiclesOptions = () => {
    this.setState({vehicleOptions: vehiclesMapToSelectOptions(this.props.activeVehicles)})
  }

  onNewVehicleDone = () => {
    this.setState({VehicleView : "active"})
  }

  renderTabContent = () => {
    const {VehicleView} = this.state
    const { activeVehicles } = this.props
    let devices = []
    if (activeVehicles) { 
      devices = Object.values(activeVehicles)
    }
    let tabView = ""
    if(VehicleView === "new") {
      tabView = <CarrierNewVehicle onDone={this.onNewVehicleDone}> </CarrierNewVehicle>
    } else if(VehicleView === 'active'){
      // tabView = <Carrier assetType={'vehicle'} assets={devices}></Carrier>
      tabView = <ActiveVehicles/>
    } else {
      tabView = <Assets assetType={'vehicle'} active={false} > </Assets>
    }

    return tabView
  }
  
  onTabChange = (e) => {
    this.setState({
      VehicleView: e.target.value
    })
  }


  render() {
    const {VehicleView} = this.state
    return (
      <LayoutWrapper>
        <Box>
          <RadioGroup
          buttonStyle="solid"
          id="VehicleView"
          name="VehicleView"
          value={VehicleView}
          onChange={this.onTabChange}
          >
            <RadioButton value="new"><IntlMessages id="general.new"/></RadioButton>
            <RadioButton value="active"><IntlMessages id="general.active"/></RadioButton>
            <RadioButton value="inactive"><IntlMessages id="user.status.inactive.name"/></RadioButton>
          </RadioGroup>
          {this.renderTabContent()}
        </Box>
      </LayoutWrapper>
    )
  }
}


VehiclesPage.propTypes = {
  intl: intlShape.isRequired,
};


const mapStateToProps = state => {
  return {
    firebase: state.FB.firebase,
		companyId: state.FB.company.companyId,
    activeVehicles: state.FB.assets.activeVehicles,
  }
}
export default compose(
  connect(mapStateToProps, {}),
  firebaseConnect()
)(injectIntl(VehiclesPage))
