import React, { PureComponent } from 'react';
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import {injectIntl, intlShape} from "react-intl";
import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
import Tabs, { TabPane } from 'components/uielements/tabs';
import ShippersAccount from './shippers_account';
import Loader from "components/utility/loader";

export class shippers_account_page extends PureComponent {
  INITIAL_STATE = {
    loading: false
  }

  constructor(props){
    super(props)
    this.state = { ...this.INITIAL_STATE}
  }

  render() {
    const {loading} = this.state

    if(loading){
      return <Loader></Loader>
    }
    
    return (
      <LayoutWrapper>
        <Box>
          <Tabs defaultActiveKey="1" >
            <TabPane tab={<IntlMessages id="shipper_active" />} key="1">
            <ShippersAccount view='active' />
            </TabPane>
            <TabPane tab={<IntlMessages id="All Shipper" />} key="2">
            <ShippersAccount view='null' />
            </TabPane>
          </Tabs>
        </Box>
      </LayoutWrapper>
    )
  }
}

shippers_account_page.propTypes = {
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
)(injectIntl(shippers_account_page))