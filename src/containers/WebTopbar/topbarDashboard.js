import React, { Component } from 'react';
import { connect } from 'react-redux';
import Popover from 'components/uielements/popover';
import IntlMessages from 'components/utility/intlMessages';
import authAction from 'helpers/redux/auth/actions';
import TopbarDropdownWrapper from './topbarDropdown.style';
import {get_route_path} from "constants/routes";

const { logout } = authAction;


class TopbarDashboard extends Component {
  constructor(props) {
    super(props);
    this.handleVisibleChange = this.handleVisibleChange.bind(this);
    this.hide = this.hide.bind(this);
    this.state = {
      visible: false
    };
  }
  hide() {
    this.setState({ visible: false });
  }
  handleVisibleChange() {
    this.setState({ visible: !this.state.visible });
  }

  render() {
    const content = (
      <TopbarDropdownWrapper className="isoUserDropdown">
        <a className="isoDropdownLink" href={get_route_path("shipping", "app")}>
          <IntlMessages id="site.topbar.shipper_dashboard" />
        </a>
        <a className="isoDropdownLink"  href={get_route_path("carrier", "app")}>
          <IntlMessages id="site.topbar.carrier_dashboard"/>
        </a>
      </TopbarDropdownWrapper>
    );

    return (
      <Popover
        content={content}
        trigger="hover"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        arrowPointAtCenter={true}
        placement="bottomLeft"
      >
        <div className="title">
          <IntlMessages id="general.dashboard"/>
        </div>
      </Popover>
    );
  }
}
export default connect(null, { logout })(TopbarDashboard);
