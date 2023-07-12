import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { injectIntl, intlShape } from "react-intl";
import { compose } from "redux";
import { firebaseConnect } from "react-redux-firebase";
import Loader from "components/utility/loader";
import { BoxWrapper } from "components/utility/box.style";
import FormBox from "../base/form_box";
import { notifyError, notifySuccess } from "components/notification";
import { PropTypes } from "prop-types";
import { getSpan } from "constants/layout/grids";
import {
  addEvent,
  updateEvent,
  deleteEvent
} from "helpers/firebase/firebase_functions/events";
import ScheduleEvent from "model/event/schedule_event";
import { objectToKeyValList } from 'helpers/data/mapper'
import { VISIBILITY_OPTIONS } from "constants/options/location";
import { statusOption} from "constants/options/calendar";
import {vehiclesMapToSelectOptions, trailerMapToSelectOptions} from "helpers/containers/states/assets";
import {usersMapToSelectOptions} from "helpers/containers/states/users";


const statusoptionkeyvallist = objectToKeyValList(statusOption);
const visibiltyoptionkeyvallist = objectToKeyValList(VISIBILITY_OPTIONS);

class EventForm extends PureComponent {

  static propTypes = {
    firebase: PropTypes.object,
    companyId: PropTypes.string,
    activeDrivers: PropTypes.object,
    activeVehicles: PropTypes.object,
    activeTrailers: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.INITIAL_STATE = {
      user: undefined,
      existingEventData: {},
      loading: false,
      driverOptions: undefined,
      vehicleOptions: undefined,
      trailerOptions: undefined,
    };
    this.state = { ...this.INITIAL_STATE };
  }

  componentDidMount() {
    
    if(this.props.existingEventData)
    {
      this.setState({ existingEventData: this.props.existingEventData || {} });
    }

    if (this.props.activeDrivers !== undefined){
      this.setDriverOptions()
    }
    if (this.props.activeVehicles !== undefined){
      this.setVehiclesOptions()
    }
    if (this.props.activeTrailers !== undefined){
      this.setTrailersOptions()
    }

  }

  componentDidUpdate(prevProps, prevState) {
    const {driverOptions, vehicleOptions, trailerOptions} = this.state

    if (prevProps.existingEventData !== this.props.existingEventData) {
      this.setState({ existingEventData: this.props.existingEventData });
    }

    if (this.props.activeDrivers != prevProps.activeDrivers){
      this.setDriverOptions()
    }

    if (this.props.activeVehicles != prevProps.activeVehicles){
      this.setVehiclesOptions()
    }

    if (this.props.activeTrailers != prevProps.activeTrailers){
      this.setTrailersOptions()
    }

  }

  setDriverOptions = () => {
    this.setState({ driverOptions: usersMapToSelectOptions(this.props.activeDrivers)})
  }

  setVehiclesOptions = () => {
    this.setState({vehicleOptions: vehiclesMapToSelectOptions(this.props.activeVehicles)})
  }

  setTrailersOptions = () => {
    this.setState({trailerOptions: trailerMapToSelectOptions(this.props.activeTrailers)})
  }

  KeyValListToOptionsLeg = (KeyValList) => {
    return KeyValList.map(kv => {return {label: `Leg ${Number(kv.key) + 1}`,value: kv.value.id}})
  }

  KeyValListToOptions = (KeyValList) => {
    return KeyValList.map(kv => { return { label: this.props.intl.formatMessage({ id: kv.value.name }), value: kv.key } })
  }

  KeyValListToOptionsVehicleTrailer = (KeyValList) => {
    return KeyValList.map(kv => { return { label: this.props.intl.formatMessage({ id: `${kv.value.profile.make}, ${kv.value.profile.model}, ${kv.value.profile.year}` }), value: kv.key } })
  }
  KeyValListToOptionsDriver = (KeyValList) => {
    return KeyValList.map(kv => { return { label: this.props.intl.formatMessage({ id: `${kv.value.profile.first_name} ${kv.value.profile.last_name}` }), value: kv.key } })
  }

  getFormInputs = () => {
    const { title, desc, start, end, trailers, vehicles, users, location, radius, event_status, visibility } = this.state.existingEventData || {};

    const { driverOptions, trailerOptions, vehicleOptions } = this.state

    const ItemlabelCol = {
      xs: { span: 4 },
      sm: { span: 4 },
      md: { span: 4 },
      lg: { span: 4 },
    }

    const DescriptionItemlabelCol = {
      xs: { span: 4 },
      sm: { span: 4 },
      md: { span: 4 },
      lg: { span: 4 },
    }

    const DateItemlabelCol = {
      xs: { span: 7 },
      sm: { span: 7 },
      md: { span: 7 },
      lg: { span: 7 },
    }

    const ItemWrapperCol = {
      xs: { span: 20 },
      sm: { span: 20 },
      md: { span: 20 },
      lg: { span: 20 },
    }

    const formInputs = {
      form_type: "multi_steps_tabs",
      submit_label: this.props.intl.formatMessage({ id: "general.submit" }),
      formProps: {
        layout: "horizontal",
      },
      sections: [
        {
          key: "actions",
          size: "full",
          title: this.props.intl.formatMessage({ id: "carrier.info.title" }),
          onSubmit: this.onSubmit,
          groups: [
            {
              name: "info",
               wrapperCol: { ...getSpan("full") },
              groupWrapper: {
                type: "box",
              },
              items: [
                {
                  name: "title",
                  type: "textField",
                  hide: false,
                  formItemProps: {
                    initialValue: title || "",
                    rules: [{ required: true }],
                    label: this.props.intl.formatMessage({ id: "uiElements.popover.title" }),
                    labelCol: ItemlabelCol,
                    wrapperCol: ItemWrapperCol,
                  },
                  fieldProps: {
                    placeholder: "Title",
                  },
                  wrapperCol: getSpan(48)
                },
                {
                  name: "description",
                  type: "textField",
                  hide: false,
                  formItemProps: {
                    initialValue: desc || "",
                    rules: [{ required: false }],
                    label: this.props.intl.formatMessage({ id: "carrier.schedule.description" }),
                    labelCol: DescriptionItemlabelCol,
                    wrapperCol: ItemWrapperCol,
                  },
                  fieldProps: {
                    placeholder: "Description",
                  },
                  wrapperCol: getSpan(24)
                },
                {
                  name: "eventDateTimeRange",
                  type: "DateRangePickerField",
                  hide: false,
                  formItemProps: {
                    initialValue: [start, end],
                    rules: [{ required: true }],
                    label: this.props.intl.formatMessage({
                      id: "carrier.schedule.dates",
                    }),
                    name: "eventDateTimeRange",
                    labelCol: DateItemlabelCol,
                    wrapperCol: ItemWrapperCol,
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({ id: "general.address.placeholder.additional_info" }),
                    wrapperCol: getSpan(24)
                  },
                },
                {
                  name: "event_status",
                  type: "selectField",
                  hide: false,
                  formItemProps: {

                    initialValue: event_status,
                    rules: [{ required: true }],
                    label: this.props.intl.formatMessage({ id: "general.status" }),
                    labelCol: ItemlabelCol,
                    wrapperCol: ItemWrapperCol,
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({ id: "general.status" }),
                    options: this.KeyValListToOptions(statusoptionkeyvallist),
                  },
                  wrapperCol: getSpan(24)
                },
                {
                  name: "location",
                  type: "addressField",
                  formItemProps: {
                    initialValue: location,
                    label: this.props.intl.formatMessage({ id: "general.location" }),
                    labelCol: ItemlabelCol,
                    wrapperCol: ItemWrapperCol,
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({ id: "general.location" }),
                  },
                  wrapperCol: getSpan(24)
                },
                {
                  name: "visibility",
                  type: "selectField",
                  formItemProps: {
                    initialValue: visibility,
                    label: this.props.intl.formatMessage({ id: "general.visibility" }),
                    labelCol: ItemlabelCol,
                    wrapperCol: ItemWrapperCol,
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({ id: "general.visibility" }),
                    options: this.KeyValListToOptions(visibiltyoptionkeyvallist),
                  },
                  wrapperCol: getSpan(24)
                },
              ]
            }
          ]
        },
        { //* resource tab starts herere.
          key: "general.resources",
          title: this.props.intl.formatMessage({ id: "carrier.resource.title" }),
          groups: [
            {
              name: "resources",
              wrapperCol: { ...getSpan(30) },
              groupWrapper: {
                type: "box",
              },
              items: [
                {
                  name: "userAssignments",
                  type: "selectField",
                  formItemProps: {
                    initialValue: users ? users.map(user => {
                      return user.id
                    }) : undefined,
                    name: "userAssignments",
                    label: this.props.intl.formatMessage({ id: "sidebar.users" }),
                    labelCol: ItemlabelCol,
                    wrapperCol: ItemWrapperCol,
                  },
                  fieldProps: {
                    itemType: "user_type",
                    options: driverOptions,
                    mode: "multiple",
                  },
                  wrapperCol: getSpan(24)
                },
                {
                  name: "trailerAssignments",
                  type: "selectField",
                  formItemProps: {
                    initialValue: trailers ? trailers.map(trailer => {
                      return trailer.id
                    }) : undefined,
                    name: "trailerAssignments",

                    label: this.props.intl.formatMessage({ id: "carrier.asset.trailers" }),
                    labelCol: ItemlabelCol,
                    wrapperCol: ItemWrapperCol,


                  },
                  fieldProps: {
                    options: trailerOptions,
                    mode: "multiple",
                  },
                  wrapperCol: getSpan(24)
                },
                {
                  name: "vehicleAssignments",
                  type: "selectField",
                  formItemProps: {
                    initialValue: vehicles ? vehicles.map(vehicle => {
                      return vehicle.id
                    }) : undefined,
                    name: "vehicleAssignments",

                    label: this.props.intl.formatMessage({ id: "carrier.asset.vehicles" }),
                    labelCol: ItemlabelCol,
                    wrapperCol: ItemWrapperCol,
                  },
                  fieldProps: {
                    options: vehicleOptions,
                    mode: "multiple",
                  },
                  wrapperCol: getSpan(24)
                }
              ],
            },
          ]
        },
      ]
    }
    return formInputs ;
  };

  loading = (loading) => {
    this.setState({ loading: loading });
  };

  handleReset = () => {    };

  onDone = () => {
    if (this.props.onDone) {
      this.handleReset();
      this.props.onDone();
    }
  };

  onSubmit = (values) => {
    this.loading(true);
    const existingEventData = this.props.existingEventData || {};

    const eventData = {
      type: "resource_schedule",  
      info: {
        title: values.title,
        description: values.description,
        start_time: values.eventDateTimeRange[0].unix(),
        end_time: values.eventDateTimeRange[1].unix(),
        location: values.location,
        visibility: values.visibility,
        event_status: values.event_status,
      },
      assignments: {
        users: values.userAssignments,
        trailers: values.trailerAssignments,
        vehicles: values.vehicleAssignments
      },
    };


    let event = new ScheduleEvent(undefined, eventData);

    if (existingEventData.id) {
      eventData.eventId = this.props.existingEventData.id
      return updateEvent(eventData)
        .then((res) => {
          notifySuccess("notification.success.update_event", this.props.intl);
          this.onDone();
          this.loading(false);
          this.props.closeForm()
        })
        .catch((e) => {
          console.log(e);
          notifyError("notification.fail.update_event", this.props.intl);
          this.loading(false);
        });
    } else {
      return addEvent(event)
        .then((res) => {
          notifySuccess("notification.success.new_event", this.props.intl);
          this.onDone();
          this.loading(false);
          this.props.closeForm()
        })
        .catch((e) => {
          notifyError("notification.fail.new_event", this.props.intl);
          this.loading(false);
        });
    }
  };

  onDelete = () => {
    return deleteEvent({ eventId: this.props.existingEventData.id })
      .then((res) => {
        notifySuccess("notification.success.delete_event", this.props.intl);
        this.onDone();
        this.loading(false);
        this.props.closeForm()
      })
      .catch((e) => {
        notifyError("notification.fail.delete_event", this.props.intl);
        this.loading(false);
      });
  }

  deleteButton = () => {
    const existingEvent = this.props.existingEventData
    if (existingEvent && existingEvent.id) {
      return <button onClick={this.onDelete}>Delete Event</button>;
    }
  };

  isReady = () => {
    const {trailerOptions, vehicleOptions, driverOptions } = this.state
    return trailerOptions?.length != undefined && vehicleOptions?.length != undefined && driverOptions?.length != undefined
  }

  

  render() {
    if (!this.isReady() ) {
      return (
        <Loader></Loader>                
      )
    } else {
      const initialInputs  = this.getFormInputs() ;
      return (
        <BoxWrapper>
          {initialInputs ? (
            <FormBox
              title={this.props.intl.formatMessage({
                id: "users.actions.add_user",
              })}
              formInputs={ initialInputs? initialInputs:'' }
              onSubmit={this.onSubmit}
            />
          ) : (
            ""
          )}
          {this.deleteButton()}
        </BoxWrapper>
      );
    }


  }
}

const mapStateToProps = state => {
  return {
    firebase: state.FB.firebase,
    companyId: state.FB.company.companyId,
    activeDrivers: state.FB.carrierUsers.activeDrivers,
    activeVehicles: state.FB.assets.activeVehicles,
    activeTrailers: state.FB.assets.activeTrailers,
    state
  }
}

EventForm.propTypes = {
  intl: intlShape.isRequired,
};

export default compose(
  connect(mapStateToProps, {}),
  firebaseConnect()
)(injectIntl(EventForm));
