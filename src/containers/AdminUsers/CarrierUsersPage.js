import React, { PureComponent, lazy } from "react";
import { connect } from "react-redux";
import Loader from "components/utility/loader";
import Tabs, { TabPane } from 'components/uielements/tabs';
import { RadioGroup, RadioButton } from "components/uielements/radio";
import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
import CarrierUsers from './carrier_users' ;

const  defaultView = "active"

class CarrierUsersPage extends PureComponent {
  INITIAL_STATE = {
    loading: false
  }

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
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
            <TabPane tab={<IntlMessages id="general.active" />} key="1">
            <CarrierUsers view='active' />
            </TabPane>
            <TabPane tab={<IntlMessages id="general.all" />} key="2">
            <CarrierUsers view='null' />
            </TabPane>
          </Tabs>
        </Box>
      </LayoutWrapper>
    );
  }

}

export default connect()(CarrierUsersPage);