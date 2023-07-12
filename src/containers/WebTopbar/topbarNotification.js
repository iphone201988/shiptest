import React, { Component } from "react";
import Popover from "antd/es/popover"
import { connect } from "react-redux";
import IntlMessages from "components/utility/intlMessages";
import TopbarDropdownWrapper from "./topbarDropdown.style";

const demoNotifications = [
  {
    id: 1,
    name: "Shipment Notification",
    notification:
      "Dry Van FTL Shipment from Montreal Qc to Toronto On on April 4th 2019"
  },
  {
    id: 2,
    name: "Shipment Notification",
    notification:
      "Dry Van FTL Shipment from Toronto On to Montreal Qc on April 5th 2019"
  },
  {
    id: 3,
    name: "Shipment Notification",
    notification:
      "Flatbed FTL Shipment from Montreal Qc to Quebec Qc on April 6th 2019"
  },
  {
    id: 4,
    name: "Weather Alert",
    notification:
      "Snow Storm on April 5th 2019 in Toronto On"
  }
];

class TopbarNotification extends Component {
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
    const { customizedTheme } = this.props;
    const content = (
      <TopbarDropdownWrapper className="topbarNotification">
        <div className="isoDropdownHeader">
          <h3>
            <IntlMessages id="sidebar.notification" />
          </h3>
        </div>
        <div className="isoDropdownBody">
          {demoNotifications.map(notification => (
            <a className="isoDropdownListItem" key={notification.id}>
              <h5>{notification.name}</h5>
              <p>{notification.notification}</p>
            </a>
          ))}
        </div>
        <a className="isoViewAllBtn">
          <IntlMessages id="topbar.viewAll" />
        </a>
      </TopbarDropdownWrapper>
    );
    return (
      <Popover
        content={content}
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        placement="bottomLeft"
      >
        <div className="isoIconWrapper">
          <i
            className="ion-android-notifications"
            style={{ color: customizedTheme.textColor }}
          />
          <span>{demoNotifications.length}</span>
        </div>
      </Popover>
    );
  }
}

export default connect(state => ({
  ...state.App,
  customizedTheme: state.ThemeSwitcher.topbarTheme
}))(TopbarNotification);
