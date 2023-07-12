import React, {Component} from "react";
import {PropTypes} from "prop-types";
import {injectIntl, intlShape} from "react-intl";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import Devices from './devices'

class ActiveDevices extends Component {

  static propTypes = {
    companyId: PropTypes.string,
    activeDevices: PropTypes.object,
  }

  render() {
    const { activeDevices } = this.props
    if (activeDevices){
      const devices = Object.values(activeDevices)
      return <Devices devices={devices}/>
    }else{
      return ""
    }

  }
}

ActiveDevices.propTypes = {
  intl: intlShape.isRequired
}

const mapStateToProps = state => {
  return {
    companyId: state.FB.company.companyId,
    activeDevices: state.FB.devices.activeDevices
  }
}

export default compose(
  connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(ActiveDevices))