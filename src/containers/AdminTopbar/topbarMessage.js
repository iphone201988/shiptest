import React, { Component } from "react";
import Popover from 'antd/es/popover'
import { connect } from "react-redux";
import IntlMessages from "components/utility/intlMessages";
import Scrollbar from "components/utility/customScrollBar";
import TopbarDropdownWrapper from "./topbarDropdown.style";

import Image from "images/user3.png";

const demoMassage = [
  {
    id: 1,
    name: "David Doe | Carrier 1",
    time: "3 minutes ago",
    massage: "Hi David, Please call me when you have a chance"
  },
  {
    id: 2,
    name: "Jin Wong | Shipper 1",
    time: "20 minutes ago",
    massage: "[Shipment #123432] Please as for George Smith when you arrive Thanks"
  },
  {
    id: 3,
    name: "Steve Smith | ShipHaul Logistics Inc",
    time: "45 minutes ago",
    massage: "Thank You"
  }
];

class TopbarMessage extends Component {
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
      <TopbarDropdownWrapper className="topbarMessage withImg">
        <div className="isoDropdownHeader">
          <h3>
            <IntlMessages id="sidebar.message" />
          </h3>
        </div>
        <div className="isoDropdownBody">
          <Scrollbar style={{ height: 300 }}>
            {demoMassage.map(massage => (
              // eslint-disable-next-line
              <a className="isoDropdownListItem" key={massage.id}>
                <div className="isoImgWrapper">
                  <img alt="#" src={Image} />
                </div>

                <div className="isoListContent">
                  <div className="isoListHead">
                    <h5>{massage.name}</h5>
                    <span className="isoDate">{massage.time}</span>
                  </div>
                  <p>{massage.massage}</p>
                </div>
              </a>
            ))}
          </Scrollbar>
        </div>
        {/* eslint-disable-next-line */}
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
            className="ion-chatbubbles"
            style={{ color: customizedTheme.textColor }}
          />
          <span>{demoMassage.length}</span>
        </div>
      </Popover>
    );
  }
}

export default connect(state => ({
  ...state.App,
  customizedTheme: state.ThemeSwitcher.topbarTheme
}))(TopbarMessage);