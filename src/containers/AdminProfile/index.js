import React, { Component } from "react";
import { connect } from "react-redux";
import Tabs, { TabPane } from 'components/uielements/tabs';
import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";


import UserProfileForm from "./user_profile"


const INITIAL_STATE = {
  info:{},
  account_status:'',
  company_name:'',
  phone:'',
  loading:false,
  error:null
}

class AdminPrivateProfile extends Component {

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
              <TabPane tab={<IntlMessages id="profile.user.label"/>} key="2">
                <UserProfileForm/>
              </TabPane>
            </Tabs>
          </Box>
        </LayoutWrapper>
  );
  }
}


export default connect()(AdminPrivateProfile);