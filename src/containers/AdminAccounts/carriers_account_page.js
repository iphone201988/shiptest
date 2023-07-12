import React, { PureComponent } from 'react';
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import {injectIntl, intlShape} from "react-intl";
import Carrier_accounts from './carriers_account';
import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
import Loader from "components/utility/loader";
import Tabs, { TabPane } from 'components/uielements/tabs';

export class carriers_account_page extends PureComponent {

  INITIAL_STATE = {
    loading: false
  }

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
  }

  // renderTabContent = () => {
  //   const {view} = this.props
  //   let tabView = ""
  //     tabView = <Carrier_accounts view={view}/>
  //   return tabView
  // }

  render() {
    const {loading} = this.state

    if(loading){
      return <Loader></Loader>
    }
    
    return (
      <LayoutWrapper>
        <Box>
          <Tabs defaultActiveKey="1" >
            <TabPane tab={<IntlMessages id="carriers.active" />} key="1">
            <Carrier_accounts view='active' />
            </TabPane>
            <TabPane tab={<IntlMessages id="carriers.all" />} key="2">
            <Carrier_accounts view='null' />
            </TabPane>
          </Tabs>
        </Box>
      </LayoutWrapper>
    );
  }
}


carriers_account_page.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  return {
      user: state.FB.companyUser
  }
}

export default compose(
  connect(mapStateToProps, {}),
  firebaseConnect()
)(injectIntl(carriers_account_page))