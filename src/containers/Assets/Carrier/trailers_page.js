import React, { PureComponent, lazy } from "react";
import {PropTypes} from "prop-types";
import { connect } from "react-redux";
import {compose} from "redux";
import {injectIntl, intlShape} from "react-intl";
import {firebaseConnect} from "react-redux-firebase";

import { RadioGroup, RadioButton } from "components/uielements/radio";
import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
const Assets = lazy(() => import("./assets"))
const CarrierNewTrailer = lazy(() => import("./new_trailer"))
const ActiveTrailers = lazy(() => import("./active_trailers"))

class TrailersPage extends PureComponent {
  INITIAL_STATE = {
    TrailerView: "active"
  }

  static propTypes = {
    firebase: PropTypes.object,
    companyId: PropTypes.string,
    activeTrailers: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
  }

  onNewTrailerClose = () => {
    this.setState({TrailerView: "active"})
  }

  renderTabContent = () => {
    const {TrailerView} = this.state
    let tabView = ""
    if(TrailerView === "new") {
      tabView = <CarrierNewTrailer onDone={this.onNewTrailerClose}> </CarrierNewTrailer>
    } else if(TrailerView === 'active'){
      tabView = <Assets assetType={"trailer"} active={true}/>
    } else {
      tabView = <Assets assetType={'trailer'} active={false}/>
    }

    return tabView
  }
  
  onTabChange = (e) => {
    this.setState({
      TrailerView: e.target.value
    })
  }

  render() {
    const {TrailerView} = this.state
    return (
      <LayoutWrapper>
        <Box>
          <RadioGroup
          buttonStyle="solid"
          id="TrailerView"
          name="TrailerView"
          value={TrailerView}
          onChange={this.onTabChange}
          >
            <RadioButton value="new"><IntlMessages id="general.new"/></RadioButton>
            <RadioButton value="active"><IntlMessages id="general.active"/></RadioButton>
            <RadioButton value="inactive"><IntlMessages id="user.status.inactive.name"/></RadioButton>
          </RadioGroup>
          {this.renderTabContent()}
        </Box>
      </LayoutWrapper>
    )
  }
}


TrailersPage.propTypes = {
  intl: intlShape.isRequired,
};


const mapStateToProps = state => {
  return { firebase: state.FB.firebase,
		companyId: state.FB.company.companyId,
    activeTrailers: state.FB.assets.activeTrailers,
    state
  }
}
export default compose(
  connect(mapStateToProps, {}),
  firebaseConnect()
)(injectIntl(TrailersPage))
