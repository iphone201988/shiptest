import React, { Component } from "react";
import { connect } from "react-redux";
import Tabs, { TabPane } from 'components/uielements/tabs';
import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
import ShipperNewQuote from "./new_quote"


const INITIAL_STATE = {

}


class ShipperQuotes extends Component {

  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }


  render() {

    return (

        <LayoutWrapper>
          <Box>
            <Tabs defaultActiveKey="1" >
              <TabPane tab={<IntlMessages id="general.new_quote"/>} key="1">
                <ShipperNewQuote/>
              </TabPane>
              <TabPane tab={<IntlMessages id="general.quotes"/>} key="2">
                Quotes
              </TabPane>

            </Tabs>
          </Box>
        </LayoutWrapper>

  );
  }
}

  export default connect()(ShipperQuotes);