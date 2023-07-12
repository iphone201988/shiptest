import React, { Component } from 'react';
import { connect } from 'react-redux';
import Popover from 'components/uielements/popover';
import IntlMessages from 'components/utility/intlMessages';
import userpic from 'images/user1.png';
import authAction from 'helpers/redux/auth/actions';
import TopbarDropdownWrapper from './topbarDropdown.style';
import LogoutLink from "components/Authentication/LogoutLink";

const { logout } = authAction;


class TopbarUser extends Component {


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
        {/* eslint-disable-next-line */}
        <a className="isoDropdownLink">
          <IntlMessages id="themeSwitcher.settings" />
        </a>
        {/* eslint-disable-next-line */}
        <a className="isoDropdownLink">
          <IntlMessages id="sidebar.feedback" />
        </a>
        {/* eslint-disable-next-line */}
        <a className="isoDropdownLink">
          <IntlMessages id="topbar.help" />
        </a>
        <LogoutLink className="isoDropdownLink"/>

      </TopbarDropdownWrapper>
    );

    return (
      <Popover
        content={content}
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        arrowPointAtCenter={true}
        placement="bottomLeft"
      >
        <div className="isoImgWrapper">
          <img alt="user" src={userpic} />
          <span className="userActivity online" />
        </div>
      </Popover>
    );
  }
}
export default connect(null, { logout })(TopbarUser);
