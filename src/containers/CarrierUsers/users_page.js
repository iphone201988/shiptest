import React, { PureComponent, lazy } from "react";
import { connect } from "react-redux";

import { RadioGroup, RadioButton } from "components/uielements/radio";
import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";

const NewUser =  lazy(() => import("./new_user"));
const Users =  lazy(() => import("./users"));
const ActiveUsers =  lazy(() => import("./active_users"));

const  defaultView = "active";

class UsersPage extends PureComponent {

  INITIAL_STATE = {
    view: defaultView
  }

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
  }

  onNewQuoteClose = () => {
    this.setState({view: defaultView})
  }

  renderTabContent = () => {
    const {view} = this.state
    let tabView = ""
    if (view === "new") {
      tabView = <NewUser  visible={true} onDone={this.onNewQuoteClose}></NewUser>
    }else if (view === "active"){
      tabView = <ActiveUsers />
    }
    else{
      tabView = <Users view={view}/>
    }

    return tabView
  }

  render() {

    const {view} = this.state

    return (

        <LayoutWrapper>
          <Box>
            <RadioGroup
              buttonStyle="solid"
              id="view"
              name="view"
              value={view}
              onChange={event => {
                this.setState({view: event.target.value})
              }}
            >
              <RadioButton value="new"><IntlMessages id="users.actions.add_user"/></RadioButton>
              <RadioButton value="active"><IntlMessages id="users.active.name"/></RadioButton>
              <RadioButton value="all"><IntlMessages id="users.all.name"/></RadioButton>
            </RadioGroup>
            {this.renderTabContent()}
          </Box>
        </LayoutWrapper>
    );
  }
}

export default connect()(UsersPage);