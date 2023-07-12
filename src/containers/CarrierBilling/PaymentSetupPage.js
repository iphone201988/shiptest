import React, { PureComponent, lazy } from "react";
import { connect } from "react-redux";

import { RadioGroup, RadioButton } from "components/uielements/radio";
import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";

const NewStripeAccount =  lazy(() => import("./NewStripeAccount"));

const  defaultView = "setup"

class PaymentSetupPage extends PureComponent {

  INITIAL_STATE = {
    view: defaultView
  }

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
  }

  onClose = () => {
    this.setState({view: defaultView})
  }

  renderTabContent = () => {
    const {view} = this.state
    let tabView = ""
    if (view === "setup") {
      tabView = <NewStripeAccount onDone={this.onClose}></NewStripeAccount>
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
              <RadioButton value="setup"><IntlMessages id="payment.stripe_connect.setup_tab_title"/></RadioButton>
            </RadioGroup>
            {this.renderTabContent()}
          </Box>
        </LayoutWrapper>

    );
  }
}

export default connect()(PaymentSetupPage);