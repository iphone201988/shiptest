import React, {Component} from "react";
import {PropTypes} from "prop-types";
import {injectIntl, intlShape} from "react-intl";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import Users from './users'

class ActiveUsers extends Component {

  static propTypes = {
    companyId: PropTypes.string,
    activeUsers: PropTypes.object,
  }

  render() {
    const { activeUsers } = this.props
    if (activeUsers){
      const devices = Object.values(activeUsers)
      return <Users users={devices}/>
    }else{
      return ""
    }

  }
}

ActiveUsers.propTypes = {
  intl: intlShape.isRequired
}

const mapStateToProps = state => {
  return {
    companyId: state.FB.company.companyId,
    activeUsers: state.FB.carrierUsers.activeUsers
  }
}

export default compose(
  connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(ActiveUsers))