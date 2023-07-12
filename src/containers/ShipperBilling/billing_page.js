import React, { PureComponent, lazy } from "react";
import { connect } from "react-redux";

import { RadioGroup, RadioButton } from "components/uielements/radio";
import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
import Payment_methods from "./payment_methods";

const NewBillingProfile =  lazy(() => import("./new_billing_profile"));
const BillingProfile =  lazy(() => import("./billing_profiles"));

const  defaultView = "active"

class BillingPage extends PureComponent {

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
    if (view === "new") {
      tabView = <NewBillingProfile  visible={true} onDone={this.onClose}></NewBillingProfile>
    }    else if (view === "paymentMethods") {
      tabView = <Payment_methods  {...this.state}/>
  }
    else{
      tabView = <BillingProfile view={view}/>
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
              <RadioButton value="new"><IntlMessages id="dashboard.billing_profile.add"/></RadioButton>
              <RadioButton value="active"><IntlMessages id="billing_profiles.name"/></RadioButton>
              <RadioButton value="paymentMethods"><IntlMessages id="menu.payment_methods"/></RadioButton>
            </RadioGroup>
            {this.renderTabContent()}
          </Box>
        </LayoutWrapper>

    );
  }
}

export default connect()(BillingPage);