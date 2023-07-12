import React, { Component } from "react";
import { compose } from "redux";
import { injectIntl, intlShape } from "react-intl";
import { firestoreConnect } from "react-redux-firebase";
import { PropTypes } from "prop-types";
import Popover from "antd/es/popover";
import { connect } from "react-redux";
import IntlMessages from "components/utility/intlMessages";
import TopbarDropdownWrapper from "../CarrierTopbar/topbarDropdown.style";
import NotificationsList from "./notificationsList"
import {FireQuery} from "helpers/firebase/firestore/firestore_collection";
import Notification from 'model/notification/notification'
import {subtractDaysFromToday} from "helpers/data/datetime";

class TopbarNotification extends Component {
  INITIAL_STATE = {
    visible: false,
    notifications: [],
  };

  static propTypes = {
    companyId: PropTypes.string,
    userId: PropTypes.string,
    domain: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.handleVisibleChange = this.handleVisibleChange.bind(this);
    this.hide = this.hide.bind(this);
    this.state = { ...this.INITIAL_STATE };
  }

  componentDidMount() {
    if (this.props.userId) {
      this.setOptions();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.userId !== prevProps.userId) {
      this.setOptions();
    }
  }

  setOptions = () => {
    this.fetchNotifications(this.props.userId);
  };

  onNotificationsChange = (notificationsData) => {
    return this.setState({ notifications: notificationsData });
  };



  fetchNotifications = (userId) => {
    const conditions = [];
    if (userId) {
      conditions.push(new FireQuery("user_account.id", "==", userId),
        new FireQuery("last_modified", ">", subtractDaysFromToday(30).toDate())
      );
    }
    Notification.collection.query(conditions, this.onNotificationsChange, true);
  };

  renderContents = () => {
    const {notifications} = this.state;

    return (
      <TopbarDropdownWrapper className="topbarNotification">
        <NotificationsList notifications={notifications}></NotificationsList>
        <a className="isoViewAllBtn">
          <IntlMessages id="topbar.viewAll" />
        </a>
      </TopbarDropdownWrapper>
    );

  };

  hide() {
    this.setState({ visible: false });
  }
  handleVisibleChange() {
    this.setState({ visible: !this.state.visible });
  }
  render() {
    const { customizedTheme } = this.props;
    const { notifications } = this.state;

    return (
      <span>
        <Popover
          content={this.renderContents()}
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
            <span>{Object.values(notifications).length}</span>
          </div>
        </Popover>
      </span>
    );
  }
}

TopbarNotification.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  return {
    userId: state.FB.companyUser.userId,
    companyId: state.FB.company.companyId,
    domain: state.FB.company.domain,
    ...state.App,
    customizedTheme: state.ThemeSwitcher.topbarTheme,
  };
};

export default compose(
  connect(mapStateToProps, {}),
  firestoreConnect()
)(injectIntl(TopbarNotification));
