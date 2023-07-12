import React, {PureComponent, lazy} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {injectIntl, intlShape} from "react-intl";
import {PropTypes} from "prop-types";
import Card from "containers/Uielements/Card/card.style";
import carrierNotificationToMessageMap from "./carrier/notificationToMessage";

class NotificationMessage extends PureComponent {

  INITIAL_STATE = {
  }

  static propTypes = {
    domain: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {...this.INITIAL_STATE};
  }

  notificationToMessage = (notification) => {
    const notificationToMessage = carrierNotificationToMessageMap[notification.type]
    if (notificationToMessage){
      return notificationToMessage(notification, this.props.intl)
    }
    return null
  }

  render() {
    const {notification} = this.props

    const message = this.notificationToMessage(notification)
    if (message){
      return <Card title={message.title}>
        <p>{message.content}</p>
      </Card>
    }else{
      return null;
    }


  }
}

NotificationMessage.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  return {
    domain: state.FB.company.domain,
  };
};

export default compose(
  connect(mapStateToProps, {}),
)(injectIntl(NotificationMessage));