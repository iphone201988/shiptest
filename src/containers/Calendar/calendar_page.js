import React, { PureComponent, lazy } from "react";
import { connect } from "react-redux";
import { RadioGroup, RadioButton } from "components/uielements/radio";
import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
import EventForm from "./event_form";

const Calendar = lazy(() => import("./Calendar"));

const defaultView = "resourceSchedule"

class CalendarPage extends PureComponent {

  INITIAL_STATE = {
    view: defaultView,
    queryFilterConditions: [],
        clientFilterConditions: [],
        ShipmentStatusOptions: [],
  }

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
  }

  returnToTeamView = () => {
    this.setState({ view: "resourceSchedule" })
  }

  renderTabContent = () => {
    const { view } = this.state
    let tabView = "" ;
     if (view === "resourceSchedule") {
      tabView = <Calendar type={'resource_schedule'}  />
    } 
    
    if (view === "addEvent") {
      tabView = <EventForm closeForm={() => this.returnToTeamView()}/>
    }

    if(view === "shipmentSchedule"){
      tabView = <Calendar type={'shipment_schedule'} />
    }

    return tabView
  }

  

  render() {
    const { view } = this.state
    
    return (

      <LayoutWrapper>
        <Box>
        <RadioGroup
        buttonStyle="solid"
        id="view"
        name="view"
        value={view}
        onChange={event => {
        this.setState({ view: event.target.value })
      }}
        >
        <RadioButton value="addEvent"><IntlMessages id="general.actions.add_event" /></RadioButton>
        <RadioButton value="resourceSchedule"><IntlMessages id="carrier.schedule.resource_schedule"/></RadioButton>
      <RadioButton value="shipmentSchedule"><IntlMessages id="carrier.schedule.shipmentSchedule" /></RadioButton>
        </RadioGroup>
      {this.renderTabContent()}
        </Box>
      </LayoutWrapper>

    );
  }
}

export default connect()(CalendarPage);

