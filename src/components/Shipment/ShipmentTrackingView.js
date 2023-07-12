import "antd/dist/antd.css";
import React from "react";
import Loader from "components/utility/loader";
import { connect } from "react-redux";
import {compose} from "redux";
import {firebaseConnect} from "react-redux-firebase";
import {PropTypes} from "prop-types";
import {injectIntl, intlShape} from "react-intl";
import {FireQuery} from "helpers/firebase/firestore/firestore_collection";
import { getLocalTimeFromEpoch } from "helpers/data/format";
import { dateTimeFormat } from "constants/variables";
import DataView from "containers/base/data_view";
import IntlMessages from "components/utility/intlMessages";


class ShipmentTrackingView extends React.Component {
  static propTypes = {
    firebase: PropTypes.object,
    companyId: PropTypes.string,
  };

  INITIAL_STATE = {
    is_shipper: false,
    remove_map: undefined,
    queryFilterConditions: undefined,
    resultsFilterConditions: undefined,
    viewType: "table",
    columns: [],
    itemActions: [],
    ready: undefined,
  };

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
  }

  componentDidMount() {
    if (this.props.shipment || this.props.remove_map) {
      this.setState(
        {
          columns: this.getColumns(),
          remove_map: this.props.remove_map,
        },
        this.setFilterConditions
      );
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.shipment !== prevProps.shipment) {
      this.setFilterConditions();
    }
  }

  KeyValListToOptions = (KeyValList) => {
    return KeyValList.map((kv) => {
      return {
        label: this.props.intl.formatMessage({ id: kv.value.name }),
        value: kv.key,
      };
    });
  };

  
  setFilterConditions = () => {
    const queryFilterConditions = [];
    const resultsFilterConditions = [];

    if (this.props.shipment.id) {
      queryFilterConditions.push(new FireQuery("associations.shipment.id", "==", this.props.shipment.id));
    }

    this.setState({
      queryFilterConditions: queryFilterConditions,
      resultsFilterConditions: resultsFilterConditions,
    });
  };

  getColumns = () => {
    return [
      {
        title: <IntlMessages id={"general.time"} />,
        rowKey: "device_time",
        width: "10%",
        render: (text, deviceTracking) => (
          <div>
            <div>
              {deviceTracking.timeStamp
                ? getLocalTimeFromEpoch(
                    deviceTracking.timeStamp?.track_time
                  ).format(dateTimeFormat)
                : ""}{" "}
            </div>
          </div>
        ),
      },
      {
        title: <IntlMessages id={"general.position_and_bearing"} />,
        dataIndex: "",
        rowKey: "Coordinates",
        defaultSortOrder: "ascend",
        width: "10%",
        render: (text, deviceTracking, index) => (
          <div>
            <div>
              <span>{`${
                deviceTracking.tracking_data?.position?.geopoint?.latitude || ""
              }°, ${
                deviceTracking.tracking_data?.position?.geopoint?.longitude ||
                ""
              }°`}</span>
              <br></br>
              <span>{deviceTracking.tracking_data?.bearing || "?"}°</span>
            </div>
          </div>
        ),
      },
      {
        title: <IntlMessages id={"general.description"} />,
        rowKey: "description",
        width: "10%",
        render: (text, deviceTracking) => (
          <div>
            <div>{deviceTracking.tracking_data?.description || ""}</div>
          </div>
        ),
      },
      {
        title: <IntlMessages id={"general.speed"} />,
        rowKey: "speed",
        width: "10%",
        render: (text, deviceTracking) => (
          <div>
            <div>{deviceTracking.tracking_data?.speed || ""}</div>
          </div>
        ),
      },
    ];
  };

  render() {

    const {
      viewType,
      columns,
      itemActions,
      queryFilterConditions,
      resultsFilterConditions,
    } = this.state;

    const { shipment } = this.props;

    if (shipment) {
      const itemType = `device_tracking`;
      return (
        <div>
          {shipment ? (
            <DataView
              itemType={itemType}
              queryFilterConditions={queryFilterConditions}
              resultsFilterConditions={resultsFilterConditions}
              columns={columns}
              itemActions={itemActions || []}
              viewType={viewType}
              layouts={[
                {
                  key: "hybrid",
                  sections: [
                    { type: "table", span: 12 },
                    {
                      type: "map",
                      map_type: "tracking",
                      field: "tracking_data",
                      span: 12,
                      width: "100%",
                      height: "70vh",
                    },
                  ],
                },
              ]}
            />
          ) : (
            <Loader></Loader>
          )}
        </div>
      );
    } else {
      return null;
    }
  }
}

ShipmentTrackingView.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  return {
    firebase: state.FB.firebase,
    companyId: state.FB.company.companyId,
  };
};

export default compose(
  connect(mapStateToProps, {}),
  firebaseConnect()
)(injectIntl(ShipmentTrackingView));
