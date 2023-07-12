import React, { Component } from "react";
import { connect } from "react-redux";
import clone from "clone";
import notification from "components/notification";
import ModalEvents from "./modalEvents";
import calendarActions from "helpers/redux/calendar/actions";
import { CalendarStyleWrapper } from "./calendar.style";
import DataView from "../base/data_view";
import {FireQuery} from "helpers/firebase/firestore/firestore_collection";
import { compose } from "redux";
import { PropTypes } from "prop-types";
import { injectIntl, intlShape } from "react-intl";
import { firebaseConnect } from "react-redux-firebase";
import CalendarFilter from "./calendarFilter";
import {getLocationFilterConditions} from "helpers/containers/states/location";
import moment from 'moment';

const { changeView, changeEvents } = calendarActions;

const getIndex = (events, selectedEvent) =>
  events.findIndex((event) => event.id === selectedEvent.id);

class FullCalender extends Component {
  static propTypes = {
    firebase: PropTypes.object,
    companyId: PropTypes.string
  };

  state = {
    view: this.props.view,
    modalVisible: false,
    selectedData: undefined,
    modalEvents: [],
    queryFilterConditions: [],
    resultsFilterConditions: [],
    start: {},
    end:{}
  };

  onSelectEvent = (selectedData) => {
    this.setState({ modalVisible: "update", selectedData });
  };

  onSelectSlot = (selectedData) => {
    this.setState({ modalVisible: "new", selectedData });
  };

  onView = (view) => {

    this.props.changeView(view);
  };

  onEventDrop = (newOption) => {
    const { event, start, end } = newOption;
    const events = clone(this.props.events);
    const allDay = new Date(end).getTime() !== new Date(start).getTime();
    const updatedEvent = { ...event, start, end, allDay };
    const index = getIndex(events, updatedEvent);
    events[index] = clone(updatedEvent);
    this.props.changeEvents(events);
    notification(
      "success",
      "Move event successfully",
      `${event.title} was dropped onto ${event.start}`
    );
  };

  setModalData = (type, selectedData) => {
    const { changeEvents } = this.props;
    const events = clone(this.props.events);
    const { modalVisible } = this.state;
    if (type === "cancel") {
      this.setState({
        modalVisible: false,
        selectedData: undefined,
      });
    } else if (type === "delete") {
      const index = getIndex(events, selectedData);
      if (index > -1) {
        events.splice(index, 1);
      }
      changeEvents(events);
      this.setState({
        modalVisible: false,
        selectedData: undefined,
      });
    } else if (type === "update") {
      this.setState({ selectedData });
    } else {
      if (modalVisible === "new") {
        events.push(selectedData);
      } else {
        const index = getIndex(events, selectedData);
        if (index > -1) {
          events[index] = selectedData;
        }
      }
      changeEvents(events);
      this.setState({
        modalVisible: false,
        selectedData: undefined,
      });
    }
  };

  setFilterConditions = (formValues = {}) => {
    const queryFilterConditions = [];
    const resultsFilterConditions = [];

    const { status, visibility, location, trailers, vehicles, users, locationRadius } = formValues;

    // const event = new Date();
    // const expirationDate = TimeStamp(event);

    const localDate = new Date();
    const year = localDate.getFullYear();
    const month = localDate.getMonth();
    const current = new Date(year, month, 1, 1);

    const start = this.state.start? this.state.start.toDate() : current ;
    const end = this.state.end? this.state.end.toDate() : current ;

    if(start){
      queryFilterConditions.push(new FireQuery('info.start_time', '>=', start));
    }

    if(end){
      queryFilterConditions.push(new FireQuery('info.start_time', '<=', end));
    }

  queryFilterConditions.push(
      new FireQuery("company_account.id", "==", this.props.companyId)
    );

    const type = this.props.type || 'resource_schedule';
    queryFilterConditions.push(
      new FireQuery("type", "==", type)
    );


    if (formValues) {

      if (status) {
        queryFilterConditions.push(
          new FireQuery("info.event_status", "==", status)
        )
      }

      if (visibility) {
        queryFilterConditions.push(
          new FireQuery("info.visibility", "==", visibility)
        )
      }

      if (users) {
        // console.log('i am users', users);
        queryFilterConditions.push(
          new FireQuery("assignments.users", "array-contains", users)
        )
      }

      if (vehicles) {
        // console.log('###', vehicles);
        queryFilterConditions.push(
          new FireQuery("assignments.vehicles", "array-contains", vehicles)
        )
      }

      if (trailers) {
        // console.log('###', trailers);
        queryFilterConditions.push(
          new FireQuery("assignments.trailers", "array-contains", trailers)
        )
      }

      if (location) {
        queryFilterConditions.push(getLocationFilterConditions(location, locationRadius || "3", "info.location",))
      }
    }

    this.setState({
      queryFilterConditions: queryFilterConditions, resultsFilterConditions: resultsFilterConditions
    });

  };

  onNavigate = (date, view='month') => {
    let start, end;

    if (view === 'month') {
      start = moment(date).startOf('month').startOf('week')
      
      end = moment(date).endOf('month').endOf('week')
    }
   
    this.setState({start:start, end:end})

  }
  
  componentDidMount() 
  {
    if (this.props.companyId || this.props.type){
      this.onNavigate()
    }
  }

  componentDidUpdate(prevProps, prevState) 
  {
    if (prevProps.companyId !== this.props.companyId || prevProps.type !== this.props.type || prevState.start !== this.state.start || prevState.end !== this.state.end)
    {
      this.setFilterConditions();
    }
  }

  render() {
    const { view, events } = this.props;
    const { modalVisible, selectedData, queryFilterConditions, resultsFilterConditions} = this.state;

    const calendarOptions = {
      events,
      view,
      selectedData,
      onSelectEvent: this.onSelectEvent,
      onSelectSlot: this.onSelectSlot,
      onView: this.onView,
      onEventDrop: this.onEventDrop,
      onNavigate: this.onNavigate,
    };

    const columns = [
      {
        title: this.props.intl.formatMessage({ id: "general.asset" }),
        dataIndex: "",
        rowKey: "name",
        width: "10%",
        render: (text, event, index) => (
          <div>
            <div>{event.info.title}</div>
          </div>
        ),
      },
    ];

    const modalProps = { modalVisible, selectedData };
    modalProps.setModalData = this.setModalData;

    return (
      <CalendarStyleWrapper className="isomorphicCalendarWrapper">
        <ModalEvents
          modalVisible={modalVisible}
          selectedData={selectedData}
          setModalData={this.setModalData}
          events={this.state.modalEvents}
        />

        <CalendarFilter setFilterConditions={this.setFilterConditions} selectedData={this.props.events} />

        {(queryFilterConditions) ?
          // show data only if queryFilterConditions is sets
        <DataView
          itemType={"schedule_event"}
          queryFilterConditions={queryFilterConditions}
          itemActions={[]}
          columns={columns}
          resultsFilterConditions={resultsFilterConditions}
          order={"info.start_time"}
          layouts={[
            {
              key: "calendar",
              sections: [
                {
                  type: "calendar",
                  span: 24,
                  calendarOptions: calendarOptions,
                },
              ],
            },
          ]}
          // passEventDataToModal={this.passEventDataToModal}
        /> : ""}
      </CalendarStyleWrapper>
    );
  }
}

FullCalender.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  const { events, view } = state.Calendar;
  return {
    firebase: state.FB.firebase,
    companyId: state.FB.company.companyId,
    userId: state.FB.companyUser.userId,
    events,
    view,
  };
};

export default compose(
  connect(mapStateToProps, { changeView, changeEvents }),
  firebaseConnect()
)(injectIntl(FullCalender));
