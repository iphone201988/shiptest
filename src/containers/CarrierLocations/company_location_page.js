import React, { Component } from "react";
import { connect } from "react-redux";
import { RadioGroup, RadioButton } from "components/uielements/radio";
import {PropTypes} from "prop-types";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";
import {injectIntl, intlShape}  from "react-intl";
import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
import CompanyLocations from "../CompanyLocations/company_location";
import NewCompanyLocation from "../CompanyLocations/new_company_location";

const  defaultView = "saved"
class CompanyLocationPage extends Component {
  static propTypes = {
    domain: PropTypes.string,
    companyId: PropTypes.string
  }
  INITIAL_STATE = {
    LocationsView: defaultView
  }
  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
  }
  onNewLocationClose = () => {
    this.setState({LocationsView: defaultView})
  }
  renderTab = () => {
    const {LocationsView} = this.state;
    const {domain} = this.props;
    let tabView = "" ;
    if (LocationsView === "new")
    {
      //* render add location page
      tabView = <NewCompanyLocation
          visible={true}
          onDone={this.onNewLocationClose}
          domain={domain}
      />
    }else
    {
      tabView = (
        <CompanyLocations
          View={LocationsView}
          LocationStatus={"saved"}
          domain={domain}
        />
      );
    }
    return tabView
  }

  render() {

    const {LocationsView} = this.state ;

    return (

      <Box>
        <RadioGroup
          buttonStyle="solid"
          id="LocationsView"
          name="LocationsView"
          value={LocationsView}
          onChange={event => {
            this.setState({LocationsView: event.target.value})
          }}
        >
          <RadioButton value="new"><IntlMessages id="company_location.add"/></RadioButton>
          <RadioButton value="saved"><IntlMessages id="general.saved"/></RadioButton>
          <RadioButton value="visited"><IntlMessages id="general.visited"/></RadioButton>
        </RadioGroup>
        {this.renderTab()}
      </Box>

    );
  }
}

CompanyLocationPage.propTypes = {
  intl: intlShape.isRequired
}

const mapStateToProps = state => {
  return {
    domain: state.FB.company.domain,
    companyId: state.FB.company.companyId,
  }
}


export default compose(
  connect(mapStateToProps, {}),
  firestoreConnect()
)(injectIntl(CompanyLocationPage))

// export default connect()(CompanyLocationPage);