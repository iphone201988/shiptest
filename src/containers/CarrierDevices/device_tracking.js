import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { injectIntl, intlShape } from "react-intl";
import DataView from "../base/data_view";
import { FireQuery } from "helpers/firebase/firestore/firestore_collection";
import { getLocalTimeFromEpoch } from "helpers/data/format";
import {dateTimeFormat} from "constants/variables";
import IntlMessages from "components/utility/intlMessages";

export class DeviceTracking extends React.Component {
  INITIAL_STATE = {
    queryFilterConditions: undefined,
    resultsFilterConditions: undefined,
    viewType: "table",
    columns: [],
    itemActions: [],
    zoom_to: undefined,
  };

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
  }

  componentDidMount() {
    if (this.props.device) {
      this.setFilterConditions();
      this.setState({ ready: true });
      this.setState({columns: this.getColumns()})
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.device !== prevProps.device) {
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

    if (this.props.companyId) {
      queryFilterConditions.push(
        new FireQuery("company", "==", this.props.companyId)
      );
    }

    if (this.props.device) {
      queryFilterConditions.push(
        new FireQuery("device.id", "==", this.props.device.id)
      );
    }

    this.setState({
      queryFilterConditions: queryFilterConditions,
      resultsFilterConditions: resultsFilterConditions,
    });
  };

  zoomTo = (location) => {
    this.setState({ zoom_to: location });
  };

  getColumns = () => {
    return [
      {
        title: <IntlMessages id={"general.time"} />,
        rowKey: "device_time",
        width: "10%",
        render: (text, deviceTracking) => (
          <div>
            {/* { console.log('*****', deviceTracking) } */}
            <div>{ deviceTracking.timeStamp? getLocalTimeFromEpoch(deviceTracking.timeStamp?.track_time).format(dateTimeFormat) : ""  } </div>
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
            <span>{`${deviceTracking.tracking_data?.position.geopoint.latitude || ""}°, ${deviceTracking.tracking_data?.position.geopoint.longitude || "" }°`}</span>
              <br></br>
              <span>{deviceTracking.tracking_data?.bearing || "?"}°</span>
            </div>
          </div>
        ),
      },
      {
        title: <IntlMessages id={"general.description" } />,
        rowKey: "description",
        width: "10%",
        render: (text, deviceTracking) => (
          <div>
            <div>{deviceTracking.tracking_data?.description || ""}</div>
          </div>
        ),
      },
      {
        title: <IntlMessages id={"general.speed" } />,
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
    // `${device.device_type}_device_tracking`
    const {
      viewType,
      columns,
      itemActions,
      queryFilterConditions,
      resultsFilterConditions,
    } = this.state;
    const { device } = this.props
    // console.log('i am device', device)
    if (device){
      const itemType = 'device_tracking' 
      return (
        <div>
          {device ? (
            <DataView
              itemType={itemType}
              queryFilterConditions={queryFilterConditions}
              resultsFilterConditions={resultsFilterConditions}
              columns={columns}
              itemActions={itemActions}
              viewType={viewType}
              // layouts={[{key: 'table', sections:[{type: 'table', span: 24}]}]}

              layouts={[{key: 'hybrid', sections:[
                    {type: 'table', span: 12},
                    {type: 'map', map_type: 'tracking', field: 'tracking_data', span: 12, width: "100%", height: "70vh"}
                  ]
                }]}
            />
          ) : (
            ""
          )}
        </div>
      )
    }else{
      return null
    }
  }
}

DeviceTracking.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = (state) => {
  return {
    companyId: state.FB.company.companyId,
  };
};

export default compose(
  connect(mapStateToProps, {}),
  firestoreConnect()
)(injectIntl(DeviceTracking));
