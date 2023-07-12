import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import IntlMessages from "components/utility/intlMessages";
import Scrollbar from "components/utility/customScrollBar";
import Popover from "components/uielements/popover";
import TopbarDropdownWrapper from "./topbarDropdown.style";

const demoMails = [
  {
    id: 1,
    name: "David Doe | Carrier 1",
    time: "3 minutes ago",
    desc: "Hi David, Please call me when you have a chance"
  },
  {
    id: 2,
    name: "Jin Wong | Shipper 1",
    time: "20 minutes ago",
    desc: "Please as for George Smith when you arrive shipping #123456, Thanks"
  },
  {
    id: 3,
    name: "Steve Smith",
    time: "45 minutes ago",
    desc: "Hi David, Please call me when you have a chance"
  },

];

class TopbarMail extends Component {
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
    const { url, customizedTheme } = this.props;

    const content = (
      <TopbarDropdownWrapper className="topbarMail">
        <div className="isoDropdownHeader">
          <h3>
            <IntlMessages id="sidebar.email" />
          </h3>
        </div>
        <div className="isoDropdownBody">
          <Scrollbar style={{ height: 300 }}>
            {demoMails.map(mail => (
              <Link to={`${url}/mailbox`} onClick={this.hide} key={mail.id}>
                <div className="isoDropdownListItem">
                  <div className="isoListHead">
                    <h5>{mail.name}</h5>
                    <span className="isoDate">{mail.time}</span>
                  </div>
                  <p>{mail.desc}</p>
                </div>
              </Link>
            ))}
          </Scrollbar>
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
            className="ion-email"
            style={{ color: customizedTheme.textColor }}
          />
          <span>{demoMails.length}</span>
        </div>
      </Popover>
    );
  }
}

export default connect(state => ({
  ...state.App,
  customizedTheme: state.ThemeSwitcher.topbarTheme
}))(TopbarMail);
