import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "components/utility/intlMessages";
import DataView from "../../base/data_view";
import { FireQuery } from "helpers/firebase/firestore/firestore_collection";
import { getLocalTimeFromEpoch } from "helpers/data/format";
import {dateTimeFormat} from "constants/variables";
import Loader from "components/utility/loader";

class AssetTrackingView extends Component {
  intial_state = {
    view: "tracking",
    asset: undefined,
    queryFilterConditions: undefined,
    resultsFilterConditions: undefined,
    viewType: "table",
    columns: [],
    itemActions: [],
    ready: undefined,
  };

  constructor(props) {
    super(props);
    this.state = { ...this.initial_state };
  }

  componentDidMount() {
    if (this.props.asset) {
      this.setState(
        {
          columns: this.getColumns(),
        },
        this.setFilterConditions
      );
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.asset !== prevProps.asset) {
       this.setFilterConditions() ;
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

    if (this.props.asset.id) {
      queryFilterConditions.push(
        new FireQuery("associations.asset.id", "==", this.props.asset.id)
      );
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
            {/* {console.log(` i am deviceTracking data `, deviceTracking)} */}
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
              <span>{`${deviceTracking.tracking_data?.position?.geopoint?.latitude || ""}°, ${deviceTracking.tracking_data?.position?.geopoint?.longitude || "" }°`}</span>
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

    const {
      viewType,
      columns,
      itemActions,
      queryFilterConditions,
      resultsFilterConditions,
    } = this.state;

    const { asset } = this.props ;

    if (asset) {
      const itemType = `device_tracking`;
      return (
        <div>
          {asset ? (
            <DataView
              itemType={itemType}
              queryFilterConditions={queryFilterConditions}
              resultsFilterConditions={resultsFilterConditions}
              columns={columns}
              itemActions={itemActions || []}
              viewType={viewType}
              layouts={[{key: 'hybrid', sections:[
                    {type: 'table', span: 12},
                    {type: 'map', map_type: 'tracking', field: 'tracking_data', span: 12, width: "100%", height: "70vh"}
                  ]
                }]}
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

export default connect()(AssetTrackingView);
