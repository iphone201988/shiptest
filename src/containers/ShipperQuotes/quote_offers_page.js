import React, { Component } from "react";
import { connect } from "react-redux";
import Tabs, { TabPane } from 'components/uielements/tabs';
import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
import QuoteOffers from "./quote_offers";

class QuoteOffersPage extends Component {

  constructor(props) {
    super(props);
  }

  //TODO: add OnChange to Tabs to detect when we change tab and initially it just load the default tab

  render() {

    return (

        <LayoutWrapper>
          <Box>
            <Tabs defaultActiveKey="1" >
              <TabPane tab={<IntlMessages id="quotes.active.name"/>} key="1">
                <QuoteOffers
                    quote_offers_options = {{'active': true}}
                />
              </TabPane>
              <TabPane tab={<IntlMessages id="quotes.history.name"/>} key="2">
                <QuoteOffers
                    quote_offers_options = {{'history': true}}
                />
              </TabPane>

            </Tabs>
          </Box>
        </LayoutWrapper>

    );
  }
}

export default connect()(QuoteOffersPage);