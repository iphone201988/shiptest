import React, {Component} from "react";
import {injectIntl, intlShape} from "react-intl";
import {compose} from "redux";
import {connect} from "react-redux";
import {PropTypes} from "prop-types";
import Loader from "components/utility/loader";
import LayoutWrapper from "components/utility/layoutWrapper";
import DataView from "../base/data_view";
import NotificationMessage from "./notificationsMessage";

class NotificationsList extends Component {
  INITIAL_STATE = {
    queryFilterConditions: [],
    resultsFilterConditions: [],
    columns: [],
    itemActions: [],
    notifications: {},
    ready: false,
  };

  static propTypes = {
    domain: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
    this.state.itemActions = this.getItemActions()
    this.state.columns = this.getColumns()
    this.state.ready = true
  }

  getItemActions() {
    return [
      {label: "general.details", type:"viewItem", itemTabKey: "details"},
    ]
  }

  getColumns = () => {
    return [
      {
        title: this.props.intl.formatMessage({id: "general.notifications"}),
        dataIndex: '',
        rowKey: 'notification',
        defaultSortOrder: 'ascend',
        width: '95%',
        render: (text, notification, index) => <NotificationMessage notification={notification} />
      }
      ]
  }

  render() {
    const {columns, itemActions, ready} = this.state
    const {notifications} = this.props

    if (!ready){
      return <Loader></Loader>
    }

    return (<DataView
                dataItems={notifications || []}
                columns={columns}
                itemActions={itemActions}
                gridProps={{pagination: {pageSize: 4}, scroll: {y: 500}}}
                layouts={[{key: 'notifications', sections:[{type: 'table', span: 24}]}]}
      />)
  }
}

NotificationsList.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  return {
    domain: state.FB.company.domain,
  };
};

export default compose(
  connect(mapStateToProps, {}),
)(injectIntl(NotificationsList));
