import React, { PureComponent, lazy } from "react";
import { connect } from "react-redux";

import { RadioGroup, RadioButton } from "components/uielements/radio";
import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
import {Redirect} from "react-router-dom";
import {notifyError, notifySuccess} from "components/notification";
import {getIntegrationProvider} from "model/manager/integration/integrations_map";
import {get_route_path} from "constants/routes";
import {addIntegration} from "helpers/firebase/firebase_functions/integrations";

const qs = require('qs');

const NewIntegration =  lazy(() => import("./new_integrations"));
const Integrations =  lazy(() => import("./integrations"));

const  defaultView = "integrations"

class CompanyIntegrationsPage extends PureComponent {
  INITIAL_STATE = {
    itemView: defaultView,
    redirect: undefined,
    loading: false,
    domain: "",
    view: undefined,
  };

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
  }

  componentDidMount() {
    const { match, domain } = this.props;

    this.setState({ domain: domain });

    const provider = match.params.provider;
    if (provider) {
      const params = qs.parse(this.props.location.search, {
        ignoreQueryPrefix: true,
      });
      const code = params.code;
      const providerObject = getIntegrationProvider(provider);
      const integrationData = {
        provider: provider,
        code: code,
        scopes: providerObject.scopes,
      };
      addIntegration(integrationData)
        .then((res) => {
          notifySuccess(
            "notification.success.new_integration",
            this.props.intl
          );
          this.setLoading(false);
          this.setState({
            redirect: <Redirect to={get_route_path(domain, "integrations")} />,
          });
        })
        .catch((e) => {
          notifyError("notification.fail.new_integration", this.props.intl);
          this.setLoading(false);
        });
    }

    if (this.props.itemTabKey) {
      this.setState({ view: this.props.itemTabKey });
    }
  }

  setLoading = (loading) => {
    this.setState({ loading: loading });
  };

  onNewItemClose = () => {
    this.setState({ itemView: defaultView });
  };

  renderTabContent = () => {
    const { itemView } = this.state;
    const { domain } = this.props;

    let tabView = "";
    if (itemView === "new") {
      tabView = (
        <NewIntegration
          domain={domain}
          visible={true}
          onDone={this.onNewItemClose}
        ></NewIntegration>
      );
    } else {
      tabView = <Integrations domain={domain} visible={true} onDone={this.onNewItemClose} />;
    }

    return tabView;
  };

  render() {
    const { itemView, redirect } = this.state;
    if (redirect) {
      return redirect;
    }

    return (
      <LayoutWrapper>
        <Box>
          <RadioGroup
            buttonStyle="solid"
            id="view"
            name="view"
            value={itemView}
            onChange={(event) => {
              this.setState({ itemView: event.target.value });
            }}
          >
            <RadioButton value="new">
              <IntlMessages id="integration.action.add" />
            </RadioButton>
            <RadioButton value="integrations">
              <IntlMessages id="integration.name" />
            </RadioButton>
          </RadioGroup>
          {this.renderTabContent()}
        </Box>
      </LayoutWrapper>
    );
  }
}

export default connect()(CompanyIntegrationsPage);