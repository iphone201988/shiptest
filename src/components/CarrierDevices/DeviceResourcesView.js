import "antd/dist/antd.css";
import React from "react";
import Loader from "components/utility/loader";
import { connect } from "react-redux";
import { notifyError, notifySuccess } from "components/notification";
import { compose } from "redux";
import { firebaseConnect } from "react-redux-firebase";
import { PropTypes } from "prop-types";
import { associateDevice } from "helpers/firebase/firebase_functions/devices";
import { injectIntl, intlShape } from "react-intl";
import FormBox from "containers/base/form_box";
import { getSpan } from "constants/layout/grids";
import { BoxWrapper } from "components/utility/box.style";
import {
  vehiclesMapToSelectOptions,
  trailerMapToSelectOptions,
} from "helpers/containers/states/assets";
import { usersMapToSelectOptions } from "helpers/containers/states/users";
import { objectToKeyValList } from "helpers/data/mapper";
import { ASSET_TYPE } from "constants/options/assets";

const radioBoxKeyVal = objectToKeyValList(ASSET_TYPE);

class DeviceResourcesView extends React.Component {
  static propTypes = {
    firebase: PropTypes.object,
    companyId: PropTypes.string,
    activeDrivers: PropTypes.object,
    activeVehicles: PropTypes.object,
    activeTrailers: PropTypes.object,
    activeDevices: PropTypes.object,
  };

  constructor(props) {
    const INITIAL_STATE = {
      is_shipper: false,
      device: props.device || null,
      remove_map: props.remove_map || false,
      formInputs: undefined,
      vehicleData: undefined,
      vehicleOptions: undefined,
      trailerData: undefined,
      trailerOptions: undefined,
      legOptions: undefined,
      devicesOptions: undefined,
      radioBoxOptions: undefined,
      // assetType: undefined,
      trailerDisabled: undefined,
      vehicleDisabled: undefined,
      checked: undefined,
    };

    super(props);
    this.state = {
      ...INITIAL_STATE,
    };
  }

  componentDidMount() {
    if (this.props.activeDrivers !== undefined) {
      this.setDriverOptions();
    }
    if (this.props.activeVehicles !== undefined) {
      this.setVehiclesOptions();
    }
    if (this.props.activeTrailers !== undefined) {
      this.setTrailersOptions();
    }
    if (this.props.activeDevices !== undefined) {
      this.setDevicesOptions();
    }

    if (
      this.props.activeDevices ||
      this.props.activeVehicles ||
      this.props.activeTrailers ||
      this.props.activeDevices
    ) {
      this.setOptions();
      this.setInitialChecked();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { driverOptions, vehicleOptions, trailerOptions } = this.state;

    if (this.props.activeDrivers !== prevProps.activeDrivers) {
      this.setDriverOptions();
    }

    if (this.props.activeVehicles !== prevProps.activeVehicles) {
      this.setVehiclesOptions();
    }

    if (this.props.activeTrailers !== prevProps.activeTrailers) {
      this.setTrailersOptions();
    }

    if (this.props.activeDevices !== prevProps.activeDevices) {
      this.setDevicesOptions();
    }

    if (
      this.isReady() &&
      (driverOptions !== prevState.driverOptions ||
        trailerOptions !== prevState.trailerOptions ||
        vehicleOptions !== prevState.vehicleOptions ||
        this.state.devicesOptions !== prevState.devicesOptions)
    ) {
      this.setOptions();
    }
  }

  setOptions = () => {
    this.setFormInputs();
    // this.setAssetType()
  };

  isReady = () => {
    const { trailerOptions, vehicleOptions, driverOptions, devicesOptions } =
      this.state;

    return (
      trailerOptions?.length !== undefined &&
      vehicleOptions?.length !== undefined &&
      driverOptions?.length !== undefined &&
      devicesOptions?.length !== undefined
    );
  };

  setDriverOptions = () => {
    this.setState({
      driverOptions: usersMapToSelectOptions(this.props.activeDrivers),
    });
  };

  setDevicesOptions = () => {
    this.setState({
      devicesOptions: usersMapToSelectOptions(this.props.activeDevices),
    });
  };

  setInitialChecked = () => {
    const { device } = this.state;
    this.setState({ checked: device.associations.asset?.type});
  };

  onChangeAction = (value) => {
    this.setState({ checked: value.target.value })
  };

  setVehiclesOptions = () => {
    this.setState({
      vehicleOptions: vehiclesMapToSelectOptions(this.props.activeVehicles),
    });
  };

  setTrailersOptions = () => {
    this.setState({
      trailerOptions: trailerMapToSelectOptions(this.props.activeTrailers),
    });
  };

  KeyValListToOptionsLeg = (KeyValList) => {
    return KeyValList.map((kv) => {
      return {
        label: this.props.intl.formatMessage({
          id: `Leg ${Number(kv.key) + 1}`,
        }),
        value: kv.value.id,
      };
    });
  };

  KeyValListToOptionsVehicleTrailer = (KeyValList) => {
    return KeyValList.map((kv) => {
      return {
        label: this.props.intl.formatMessage({
          id: `${kv.value.profile.make}, ${kv.value.profile.model}, ${kv.value.profile.year}`,
        }),
        value: kv.key,
      };
    });
  };

  KeyValListToOptionsDriver = (KeyValList) => {
    return KeyValList.map((kv) => {
      return {
        label: `${kv.value.profile.first_name} ${kv.value.profile.last_name}`,
        value: kv.key,
      };
    });
  };

  KeyValListToOptions = (KeyValList) => {
    return KeyValList.map((kv) => {
      return {
        label: this.props.intl.formatMessage({ id: kv.value.name }),
        value: kv.key,
      };
    });
  };

  setFormInputs = () => {
    const { trailerOptions, vehicleOptions, device, checked } = this.state;

    const ItemlabelCol = {
      xs: { span: 10 },
      sm: { span: 8 },
      md: { span: 6 },
      lg: { span: 2 },
    };

    const ItemWrapperCol = {
      xs: { span: 4 },
      sm: { span: 6 },
      md: { span: 8 },
      lg: { span: 10 },
    };

    const WrapperCol = {
      xs: { span: 18 },
      sm: { span: 16 },
      md: { span: 14 },
      lg: { span: 24 },
    };

    const UserDetailFormItemWrapperCol = {
      xs: { span: 10 },
      sm: { span: 12 },
      md: { span: 14 },
      lg: { span: 15 },
    };

    const UserDetailRolesWrapperCol = {
      xs: { span: 22 },
      sm: { span: 16 },
      md: { span: 14 },
      lg: { span: 12 },
    };

    const UserDetailRolesLabelCol = {
      xs: { span: 22 },
      sm: { span: 16 },
      md: { span: 14 },
      lg: { span: 4 },
    };

    const formInputs = {
      form_type: "regular",
      submit_label: this.props.intl.formatMessage({ id: "general.submit" }),
      formProps: {
        layout: "horizontal",
      },
      sections: [
        {
          key: "resources_assignments",
          size: "full",
          title: this.props.intl.formatMessage({ id: "general.vehicle" }),
          groups: [
            {
              name: "vehicles",
              wrapperCol: { ...getSpan(24) },
              groupWrapper: {
                type: "box",
                props: { size: "small" },
              },
              items: [
                {
                  name: "asset_type",
                  type: "radioGroupField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({
                      id: "general.assetType",
                    }),
                    labelCol: UserDetailRolesLabelCol,
                    wrapperCol: UserDetailFormItemWrapperCol,
                    initialValue: checked ? checked : "",
                    rules: [
                      {
                        required: true,
                      },
                    ],
                    onChange: this.onChangeAction,
                  },
                  fieldProps: {
                    options: this.KeyValListToOptions(radioBoxKeyVal),
                  },
                  wrapperCol: UserDetailRolesWrapperCol,
                },
                {
                  name: "selectVehicle",
                  type: "selectField",
                  formItemProps: {
                    initialValue: this.state.checked === "vehicle"? device.associations.asset?.id : undefined,
                    rules: [
                      {
                        required: false,
                      },
                    ],
                    label: this.props.intl.formatMessage({
                      id: "general.vehicle",
                    }),
                    labelCol: ItemlabelCol,
                    wrapperCol: ItemWrapperCol,
                  },
                  fieldProps: {
                    options: vehicleOptions,
                    disabled:  this.state.checked === "vehicle" ? false: true,
                  },
                  wrapperCol: WrapperCol,
                },
              ],
            },
            {
              name: "trailers",
              wrapperCol: { ...getSpan(24) },
              groupWrapper: {
                type: "box",
                props: { size: "small" },
              },
              items: [
                {
                  name: "selectTrailer",
                  type: "selectField",
                  formItemProps: {
                    initialValue: this.state.checked === 'trailer'? device.associations.asset?.id : undefined,
                    rules: [
                      {
                        required: false,
                      },
                    ],
                    label: this.props.intl.formatMessage({
                      id: "trailer.title",
                    }),
                    labelCol: ItemlabelCol,
                    wrapperCol: ItemWrapperCol,
                  },
                  fieldProps: {
                    options: trailerOptions,
                    disabled: this.state.checked === "trailer"
                        ? false
                        : true
                      ,
                  },
                  wrapperCol: WrapperCol,
                },
              ],
            },
          ],
        },
      ],
    };

    return formInputs;
  };

  loading = (loading) => {
    this.setState({ loading: loading });
  };

  onDone = () => {
    if (this.props.onDone) {
      this.props.onDone();
    }
    this.props.onCloseDetail();
  };

  onSubmit = (values) => {
    const {checked} =  this.state

    if (['vehicle', 'trailer'].includes(checked)){

      let selectedAsset = undefined

      if (checked === 'vehicle'){
        selectedAsset = values.selectVehicle
      }else if (checked === 'trailer'){
        selectedAsset = values.selectTrailer
      }

      if (selectedAsset !== undefined){
        const associations = {
          asset: {
            type: checked,
            id: selectedAsset,
          }
        }
        const resourceData = {
          device_id: this.props.device.id,
          associations: associations,
        };
        this.loading(true);

        return associateDevice(resourceData)
          .then((res) => {
            notifySuccess(
              "notification.success.resources_assigned",
              this.props.intl
            );
            this.onDone();
            this.loading(false);
          })
          .catch((e) => {
            notifyError("notification.fail.resources_assigned", this.props.intl);
            this.loading(false);
          });
      }

    }
  };

  onCloseDetail = () => {
    this.props.onCloseDetail();
  };

  render() {

    const { vehicleOptions, trailerOptions, formInputs } = this.state;

    if (!trailerOptions?.length && !vehicleOptions?.length) {
      return <Loader></Loader>;
    } else {
      const initialInputs = this.setFormInputs();
      return (
        <BoxWrapper>
          {initialInputs ? (
            <FormBox
              title={this.props.intl.formatMessage({
                id: "general.actions.add_quote_request",
              })}
              formInputs={formInputs ? formInputs : initialInputs}
              onSubmit={this.onSubmit}
              onCloseDetail={this.onCloseDetail}
            />
          ) : (
            ""
          )}
        </BoxWrapper>
      );
    }
  }
}

DeviceResourcesView.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  return {
    firebase: state.FB.firebase,
    companyId: state.FB.company.companyId,
    activeDrivers: state.FB.carrierUsers.activeDrivers,
    activeVehicles: state.FB.assets.activeVehicles,
    activeTrailers: state.FB.assets.activeTrailers,
    state,
    activeDevices: state.FB.devices.activeDevices,
  };
};

export default compose(
  connect(mapStateToProps, {}),
  firebaseConnect()
)(injectIntl(DeviceResourcesView));
