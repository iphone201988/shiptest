import React, { PureComponent, lazy } from "react";
import { connect } from "react-redux";

import { RadioGroup, RadioButton } from "components/uielements/radio";
import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";

const NewRate =  lazy(() => import("./new_rate"));
const Rates =  lazy(() => import("./rates"));

const  defaultView = "active"

class RatesPage extends PureComponent {

  INITIAL_STATE = {
    view: defaultView
  }

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
  }

  onNewTabClose = () => {
    this.setState({view: defaultView})
  }

  renderTabContent = () => {
    const {view} = this.state
    let tabView = ""
    if (view === "new") {
      tabView = <NewRate  visible={true} onDone={this.onNewTabClose}></NewRate>
    }
    else{
      tabView = <Rates view={view}/>
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
              <RadioButton value="new"><IntlMessages id="carrier.rates.actions.add_rate"/></RadioButton>
              <RadioButton value="active"><IntlMessages id="carrier.rates.rates"/></RadioButton>
            </RadioGroup>
            {this.renderTabContent()}
          </Box>
        </LayoutWrapper>

    );
  }
}

export default connect()(RatesPage);