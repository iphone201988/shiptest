import React, { Component } from "react";
import { connect } from "react-redux";
import { RadioGroup, RadioButton } from "components/uielements/radio";

import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
import QuoteRequests from "./quote_requests";

class QuoteRequestsPage extends Component {

  INITIAL_STATE = {
    QuoteView: "loads"
  }

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
  }


  render() {

    const {QuoteView} = this.state
    // console.log(QuoteView)

    return (
<>
      <LayoutWrapper>
        <Box>
          <RadioGroup
            buttonStyle="solid"
            id="QuoteView"
            name="QuoteView"
            value={QuoteView}
            onChange={event => {
              this.setState({QuoteView: event.target.value})
            }}
          >
            <RadioButton value="loads"><IntlMessages id="quote.find_loads.title"/></RadioButton>
            <RadioButton value="offers"><IntlMessages id="shipment.quote_offers.title"/></RadioButton>
            <RadioButton value="history"><IntlMessages id="quotes.history.name"/></RadioButton>
          </RadioGroup>
          <QuoteRequests view={QuoteView}/>
        </Box>
      </LayoutWrapper>
      </>
    );
  }
}

export default connect()(QuoteRequestsPage);