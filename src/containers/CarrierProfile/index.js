import React, { Component } from "react";
import { connect } from "react-redux";
import Tabs, { TabPane } from 'components/uielements/tabs';
import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
import Form from "components/uielements/form";

import CompanyProfileForm from "./company_profile"
import UserProfileForm from "./user_profile"

const INITIAL_STATE = {
  info:{},
  account_status:'',
  company_name:'',
  phone:'',
  loading:false,
  error:null
}

class CarrierPrivateProfile extends Component {

  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount(){
  }

  render() {

    return (
        <LayoutWrapper>
          <Box>
            <Tabs defaultActiveKey="1" >
              <TabPane tab={<IntlMessages id="profile.company.label"/>} key="1">
                <Form className="isoSignUpForm">
                  <CompanyProfileForm/>
                </Form>
              </TabPane>
              <TabPane tab={<IntlMessages id="profile.user.label"/>} key="2">
                <UserProfileForm/>
              </TabPane>

            </Tabs>
          </Box>
        </LayoutWrapper>

  );
  }
}


export default connect()(CarrierPrivateProfile);