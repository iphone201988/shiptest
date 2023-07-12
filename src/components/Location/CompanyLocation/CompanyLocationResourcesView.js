import React from "react";
import Loader from "components/utility/loader";
import { connect } from "react-redux";
import { notifyError, notifySuccess } from "../../notification";
import { compose } from "redux";
import { firebaseConnect } from "react-redux-firebase";
import { PropTypes } from "prop-types";
import { assignShipmentTransportResources } from "helpers/firebase/firebase_functions/shipments";
import { injectIntl, intlShape } from "react-intl";
import "antd/dist/antd.css";
import Vehicle from "model/asset/vehicle";
import Trailer from "model/asset/trailer";
import CarrierUser from "model/user/carrier_user";
import { FireQuery } from "helpers/firebase/firestore/firestore_collection";
import FormBox from "containers/base/form_box";
import { BoxWrapper } from "components/utility/box.style";
import { objectToKeyValList } from "helpers/data/mapper";

class CompanyLocationResourcesView extends React.Component {
  static propTypes = {
    firebase: PropTypes.object,
    companyId: PropTypes.string,
  };

  constructor(props) {
    const INITIAL_STATE = {
      is_shipper: false,
      shipment: props.shipment || null,
      remove_map: props.remove_map || false,
    };

    super(props);
    this.state = {
      ...INITIAL_STATE,
      formInputs: undefined,
      driverOptions: [],
      vehicleOptions: [],
      legOptions: [],
      trailerOptions: [],
    };
  }

  componentDidMount() {
    this.fetchDrivers();
    this.fetchVehicles();
    this.fetchTrailers();
    this.setOptions();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.companyId !== this.props.companyId) {
      this.setFilterConditions();
    }
  }

  setOptions = () => {
    this.setFormInputs();
  };

  fetchLegsOptions = (shipment) => {
    if (shipment) {
      const interconnections = shipment.itinerary_sequence.interconnections;
      const legData = objectToKeyValList(interconnections);
      const LegsOptions = this.KeyValListToOptionsLeg(legData);
      return LegsOptions;
    }
  };

  /*
  legsOptionsMap : {interconnection: label}
   */
  fetchSelectedLegs = (shipment, type, assignment, legsOptionsMap = {}) => {
    const transport_resources = shipment.transport_resources;
    if (transport_resources) {
      const assignments = transport_resources[assignment];
      const legsOptionsIds = Object.keys(legsOptionsMap);

      const selectedLegs = new Set();
      assignments.forEach((assignment) => {
        const interconnections = (assignment.interconnection_id || []).filter(
          (id) => legsOptionsIds.includes(id)
        );
        //TODO  map the interconnection to {label: 'leg_x', value: 'interconnection_id'  using the LegMap  {interconnection: label}
        // const selectLegsKeyVal = interconnections.map(interconnection =>{return {interconnection: legsOptionsMap[interconnection]}})
        const selectedLegsVals =
          interconnections.length > 0 ? interconnections : legsOptionsIds;
        selectedLegsVals.forEach((value) => {
          selectedLegs.add(value);
        });
      });
      return Array.from(selectedLegs).sort();
    }
  };

  onTrailerChange = (trailer) => {
    const trailerData = objectToKeyValList(trailer);
    const formattedData = this.KeyValListToOptionsVehicleTrailer(trailerData);
    this.setState({ trailerOptions: formattedData });
  };

  fetchTrailers = () => {
    const companyId = this.props.companyId;
    if (companyId) {
      const conditions = [new FireQuery("company_account.id", "==", companyId)];
      Trailer.collection.query(conditions, this.onTrailerChange, false);
    }
  };

  onVehicleChange = (vehicle) => {
    const vehicleData = objectToKeyValList(vehicle);
    const formattedData = this.KeyValListToOptionsVehicleTrailer(vehicleData);
    this.setState({ vehicleOptions: formattedData });
  };

  fetchVehicles = () => {
    const companyId = this.props.companyId;
    if (companyId) {
      const conditions = [new FireQuery("company_account.id", "==", companyId)];
      Vehicle.collection.query(conditions, this.onVehicleChange, false);
    }
  };

  onDriverChange = (drivers) => {
    const driverData = objectToKeyValList(drivers);
    const formattedData = this.KeyValListToOptionsDriver(driverData);
    this.setState({ driverOptions: formattedData });
  };

  fetchDrivers = () => {
    const companyId = this.props.companyId;
    if (companyId) {
      const conditions = [
        new FireQuery("role_types", "array-contains", "role_driver"),
        new FireQuery("company_account.id", "==", companyId),
      ];
      CarrierUser.collection.query(conditions, this.onDriverChange, false);
    }
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
        label: this.props.intl.formatMessage({
          id: `${kv.value.profile.first_name} ${kv.value.profile.last_name}`,
        }),
        value: kv.key,
      };
    });
  };

  handleReset = () => {
    this.setState(this.INITIAL_STATE);
  };

  setFormInputs = () => {
    // const { trailerOptions, vehicleOptions, driverOptions, shipment } = this.state
    // console.log("shipment--------->", shipment)

    // const legsOptions = this.fetchLegsOptions(shipment)
    // const legsOptionsMap = {}
    // legsOptions.forEach((legOption) =>{legsOptionsMap[legOption.value] = legOption.label})

    // const selectedDriverLegs = this.fetchSelectedLegs(shipment, "driver", "drivers_assignments", legsOptionsMap)
    // const selectedVehicleLegs = this.fetchSelectedLegs(shipment, "vehicle", "vehicles_assignments", legsOptionsMap)
    // const selectedTrailerLegs = this.fetchSelectedLegs(shipment, "trailer", "trailers_assignments", legsOptionsMap)

    // const defaultDriverOptions = this.defaultResources(shipment, driverOptions, "drivers")
    // const defaultTrailerOptions = this.defaultResources(shipment, trailerOptions, "trailers")
    // const defaultVehicleOptions = this.defaultResources(shipment, vehicleOptions, "vehicles")

    const formInputs = {
      //   form_type: "multi_steps_tabs",
      //   submit_label: this.props.intl.formatMessage({id:"general.submit"}),
      //   formProps:{
      //     layout: "horizontal",
      //     initialValues: {hu_quantity: 1}
      //   },
      //   sections: [
      //     {
      //       key: "resources_assignments",
      //       title: this.props.intl.formatMessage({id:"general.assignments"}),
      //       groups: [
      //         {
      //           name: "driver",
      //           mode: "multiple",
      //           wrapperCol: {...getSpan(24)},
      //           groupWrapper:{
      //             type: "card",
      //             props: {size: "small",title: this.props.intl.formatMessage({id:"role.driver"})}
      //           },
      //           items:[
      //             {
      //               name: "selectDriver",
      //               type: "selectField",
      //               formItemProps:{
      //                 initialValue: defaultDriverOptions,
      //                 rules:[{
      //                   required: false
      //                 }],
      //                 hasFeedback: true,
      //                 label : this.props.intl.formatMessage({id:"role.driver"}),
      //                 labelCol: {
      //                   span: 6
      //                 },
      //                 wrapperCol: {
      //                   span: 12
      //                 },
      //               },
      //               fieldProps:{
      //                 placeholder: this.props.intl.formatMessage({id:"general.driver.placeholder.search_select"}),
      //                 options: driverOptions
      //               },
      //               wrapperCol: getSpan(24)
      //             },
      //             {
      //               name: "leg_driver",
      //               type: "selectField",
      //               formItemProps:{
      //                 hasFeedback: false,
      //                 initialValue: selectedDriverLegs,
      //                 label : this.props.intl.formatMessage({id:"general.legs"}),
      //                 labelCol: {
      //                   span: 6
      //                 },
      //                 wrapperCol: {
      //                   span: 12
      //                 },
      //               },
      //               fieldProps:{
      //                 placeholder: this.props.intl.formatMessage({id:"general.address.placeholder.legs"}),
      //                 options: legsOptions,
      //                 mode: "multiple",
      //               },
      //               wrapperCol: getSpan(24)
      //             },
      //           ],
      //         },
      //         {
      //           name: "vehicle",
      //           mode: "multiple",
      //           wrapperCol: {...getSpan(24)},
      //           groupWrapper:{
      //             type: "card",
      //             props: {size: "small",title: this.props.intl.formatMessage({id:"general.vehicle"})}
      //           },
      //           items:[
      //             {
      //               name: "selectVehicle",
      //               type: "selectField",
      //               formItemProps:{
      //                 initialValue: defaultVehicleOptions,
      //                 rules:[{
      //                   required: false
      //                 }],
      //                 hasFeedback: true,
      //                 label : this.props.intl.formatMessage({id:"general.vehicle"}),
      //                 labelCol: {
      //                   span: 6
      //                 },
      //                 wrapperCol: {
      //                   span: 12
      //                 },
      //               },
      //               fieldProps:{
      //                 placeholder: this.props.intl.formatMessage({id:"general.vehicle.placeholder.search_select"}),
      //                 options: vehicleOptions,
      //               },
      //               wrapperCol: getSpan(24)
      //             },
      //             {
      //               name: "leg_vehicle",
      //               type: "selectField",
      //               formItemProps:{
      //                 hasFeedback: false,
      //                 initialValue: selectedVehicleLegs,
      //                 label : this.props.intl.formatMessage({id:"general.legs"}),
      //                 labelCol: {
      //                   span: 6
      //                 },
      //                 wrapperCol: {
      //                   span: 12
      //                 },
      //               },
      //               fieldProps:{
      //                 placeholder: this.props.intl.formatMessage({id:"general.address.placeholder.legs"}),
      //                 options: legsOptions,
      //                 mode: "multiple",
      //               },
      //               wrapperCol: getSpan(24)
      //             },
      //           ],
      //         },
      //         {
      //           name: "trailer",
      //           mode: "multiple",
      //           wrapperCol: {...getSpan(24)},
      //           groupWrapper:{
      //             type: "card",
      //             props: {size: "small",title: this.props.intl.formatMessage({id:"trailer.title"})}
      //           },
      //           items:[
      //             {
      //               name: "selectTrailer",
      //               type: "selectField",
      //               formItemProps:{
      //                 initialValue: defaultTrailerOptions,
      //                 rules:[{
      //                   required: false
      //                 }],
      //                 hasFeedback: true,
      //                 label : this.props.intl.formatMessage({id:"trailer.title"}),
      //                 labelCol: {
      //                   span: 6
      //                 },
      //                 wrapperCol: {
      //                   span: 12
      //                 },
      //               },
      //               fieldProps:{
      //                 placeholder: this.props.intl.formatMessage({id:"general.vehicle.placeholder.search_select"}),
      //                 options: trailerOptions
      //               },
      //               wrapperCol: getSpan(24)
      //             },
      //             {
      //               name: "leg_trailer",
      //               type: "selectField",
      //               formItemProps:{
      //                 hasFeedback: false,
      //                 initialValue: selectedTrailerLegs,
      //                 label : this.props.intl.formatMessage({id:"general.legs"}),
      //                 labelCol: {
      //                   span: 6
      //                 },
      //                 wrapperCol: {
      //                   span: 12
      //                 },
      //               },
      //               fieldProps:{
      //                 placeholder: this.props.intl.formatMessage({id:"general.address.placeholder.legs"}),
      //                 options: legsOptions,
      //                 mode: "multiple",
      //               },
      //               wrapperCol: getSpan(24)
      //             },
      //           ],
      //         },
      //       ]
      //     },
      //   ]
    };

    this.setState({ formInputs: formInputs });
  };

  loading = (loading) => {
    this.setState({ loading: loading });
  };

  onDone = () => {
    if (this.props.onDone) {
      this.props.onDone();
    }
    this.handleReset();
    this.props.onCloseDetail();
  };

  defaultResources = (shipment, options, field) => {
    let defaultOption = "";
    const resources = shipment.transport_resources[field];
    if (resources?.length) {
      for (let resource of options) {
        if (resources.includes(resource.value)) {
          defaultOption = resource.value;
          return defaultOption;
        }
      }
    } else {
      return null;
    }
  };

  onSubmit = (values) => {
    const getResourceAssignments = (resource, formValues, type, idField) => {
      // const resourceId = formValues[resource[idField]]
      return {
        interconnection_id: formValues[resource["leg_".concat(type)]],
        resource: {
          id: formValues[resource[idField]],
          type: type,
        },
      };
    };

    const setResourceAssignment = (
      groupResources,
      assignmentList = [],
      formValues,
      type,
      idField
    ) => {
      (groupResources || []).forEach((resource) => {
        if (resource) {
          try {
            // TODO:  leg_s needs to be an array (multiple-select)  hence we need to loop through all legs and assign resource to that
            assignmentList.push(
              getResourceAssignments(resource, formValues, type, idField)
            );
          } catch (e) {
            console.error(e);
          }
        }
      });
    };

    const { shipment } = this.state;
    const { itemSetsFields } = values;

    const drivers_assignments = [];
    const vehicles_assignments = [];
    const trailers_assignments = [];

    setResourceAssignment(
      Object.values(itemSetsFields.groups.driver || {}),
      drivers_assignments,
      values,
      "driver",
      "selectDriver"
    );
    setResourceAssignment(
      Object.values(itemSetsFields.groups.vehicle || {}),
      vehicles_assignments,
      values,
      "vehicle",
      "selectVehicle"
    );
    setResourceAssignment(
      Object.values(itemSetsFields.groups.trailer || {}),
      trailers_assignments,
      values,
      "trailer",
      "selectTrailer"
    );

    const transportResources = {};
    const resourceData = {
      shipment_id: shipment.id,
      transport_resources: transportResources,
    };

    if (drivers_assignments.length > 0) {
      transportResources.drivers_assignments = drivers_assignments;
    }

    if (vehicles_assignments.length > 0) {
      transportResources.vehicles_assignments = vehicles_assignments;
    }

    if (trailers_assignments.length > 0) {
      transportResources.trailers_assignments = trailers_assignments;
    }

    this.loading(true);
    return assignShipmentTransportResources(resourceData)
      .then((res) => {
        notifySuccess(
          "notification.success.resources_assigned",
          this.props.intl
        );
        this.onDone();
        this.loading(false);
      })
      .catch((e) => {
        console.log("SUBMISSION ERROR-------------->", e);
        notifyError("notification.fail.resources_assigned", this.props.intl);
        this.loading(false);
      });
  };

  onCloseDetail = () => {
    this.props.onCloseDetail();
  };

  render() {
    const { vehicleOptions, trailerOptions, driverOptions, formInputs } =
      this.state;

    if (
      !driverOptions?.length ||
      !trailerOptions?.length ||
      !vehicleOptions?.length
    ) {
      return <Loader></Loader>;
    } else {
      return (
        <div>
          <BoxWrapper>
            {formInputs ? (
              <FormBox
                title={this.props.intl.formatMessage({
                  id: "general.actions.add_quote_request",
                })}
                formInputs={formInputs}
                onSubmit={this.onSubmit}
                onCloseDetail={this.onCloseDetail}
              />
            ) : (
              ""
            )}
          </BoxWrapper>
        </div>
      );
    }
  }
}

CompanyLocationResourcesView.propTypes = {
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
)(injectIntl(CompanyLocationResourcesView));
