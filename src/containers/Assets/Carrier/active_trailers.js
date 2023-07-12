import React, {Component, lazy} from "react";
import {PropTypes} from "prop-types";
import {injectIntl, intlShape} from "react-intl";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
const Assets = lazy(() => import ("./assets.js"))
class ActiveTrailers extends Component {

  static propTypes = {
    companyId: PropTypes.string,
    activeTrailers: PropTypes.object,
  }

  render() {
    return <Assets assetType={"trailer"} active={true}/>
  }
}

ActiveTrailers.propTypes = {
  intl: intlShape.isRequired
}

const mapStateToProps = state => {
  return {
    companyId: state.FB.company.companyId,
    activeTrailers: state.FB.carrierUsers.activeTrailers
  }
}

export default compose(
  connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(ActiveTrailers))