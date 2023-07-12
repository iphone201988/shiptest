import React, {Component, lazy} from "react";
import {PropTypes} from "prop-types";
import {injectIntl, intlShape} from "react-intl";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";

const Assets = lazy(() => import ("./assets.js"))

class ActiveVehicles extends Component {

  static propTypes = {
    companyId: PropTypes.string,
    activeVehicles: PropTypes.object,
  }

  render() {
    return <Assets assetType={"vehicle"} active={true}/>
  }
}

ActiveVehicles.propTypes = {
  intl: intlShape.isRequired
}

const mapStateToProps = state => {
  return {
    companyId: state.FB.company.companyId,
    activeVehicles: state.FB.carrierUsers.activeUsers
  }
}

export default compose(
  connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(ActiveVehicles))