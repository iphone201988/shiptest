import React, { PureComponent, lazy } from "react";
import { connect } from "react-redux";
import Loader from "components/utility/loader";
import Tabs, { TabPane } from 'components/uielements/tabs';
import { RadioGroup, RadioButton } from "components/uielements/radio";
import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
import NewUsers from './new_user';
import AdminUsers from './admin_users';

// const NewUser =  lazy(() => import("./new_user"));
// const AdminUsers =  lazy(() => import("./admin_users"));

const  defaultView = "active"

class UsersPage extends PureComponent {

  INITIAL_STATE = {
    view: defaultView
  }

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
  }

  onNewQuoteClose = () => {
    this.setState({view: defaultView})
  }

  // renderTabContent = () => {
  //   const {view} = this.state
  //   let tabView = ""
  //   if (view === "new") {
  //     tabView = <NewUser  visible={true} onDone={this.onNewQuoteClose}></NewUser>
  //   }
  //   else if(view === 'active'){
  //     tabView = <AdminUsers view="active"/>
  //   } else {
  //     tabView = <AdminUsers view="all" />
  //   }

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
            <TabPane tab={<IntlMessages id="general.new" />} key="3">
            <NewUsers view='new' />
            </TabPane>
            <TabPane tab={<IntlMessages id="general.active" />} key="1">
            <AdminUsers view='active' />
            </TabPane>
            <TabPane tab={<IntlMessages id="general.all" />} key="2">
            <AdminUsers view='null' />
            </TabPane>
          </Tabs>
        </Box>
      </LayoutWrapper>
    );
  }
}

export default connect()(UsersPage);