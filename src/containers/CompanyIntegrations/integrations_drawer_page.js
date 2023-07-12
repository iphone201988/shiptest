import React, { PureComponent, lazy } from "react";
import { connect } from "react-redux";
import { RadioGroup, RadioButton } from "components/uielements/radio";
import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
import { addIntegration } from "./integrations_backend";
import { Redirect } from "react-router-dom";
import { notifyError, notifySuccess } from "components/notification";
import { getIntegrationProvider } from "model/manager/integration/integrations_map";
import { get_route_path } from "constants/routes";

const qs = require('qs');

const CompanyIntegrationDetails = lazy(() => import("./integrations_details"));
const IntegrationSync = lazy(() => import("./integrations_sync"));

const defaultView = "details"

class IntegrationDrawerPage extends PureComponent {

  INITIAL_STATE = {
    itemView: undefined,
    redirect: undefined,
    loading: false,
    domain: "",
  }
  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
  }

  componentDidMount() {
    if (this.state.itemView === undefined) {
      this.setState({ itemView: defaultView })
    }
    if (this.props.itemTabKey) {
      this.setState({ itemView: this.props.itemTabKey });
    }
  }

  setLoading = (loading) => {
    this.setState({ loading: loading })
  }

  onNewItemClose = () => {
    this.setState({ itemView: defaultView })
  }

  renderTabContent = () => {
    const { itemView } = this.state
    const { domain } = this.props

    let tabView = ""

    if (itemView === "details") {
      tabView = <CompanyIntegrationDetails domain={domain} visible={true} onDone={this.onNewItemClose} integration={this.props.integration}></CompanyIntegrationDetails>
    }

    if (itemView === "sync_entities") {
      tabView = <IntegrationSync domain={domain} integration={this.props.integration} visible={true} onDone={this.onNewItemClose} />
    }

    return tabView
  }

  render() {

    console.log('*******', this.props.itemTabKey)

    const { itemView, redirect } = this.state

    if (redirect) {
      return redirect
    }

    return (

      <LayoutWrapper>
        <Box>
          <RadioGroup
            buttonStyle="solid"
            id="view"
            name="view"
            value={itemView}
            onChange={event => {
              this.setState({ itemView: event.target.value })
            }}
          >
            <RadioButton value="details"><IntlMessages id="integration.detail" /></RadioButton>
            <RadioButton value="sync_entities"><IntlMessages id="integration.sync" /></RadioButton>
          </RadioGroup>
          {this.renderTabContent()}
        </Box>
      </LayoutWrapper>

    );
  }
}

export default connect()(IntegrationDrawerPage);