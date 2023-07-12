import {Drawer} from 'antd';
import React from "react";
import {injectIntl, intlShape} from "react-intl";
import QuoteOfferDetails from "components/Shipment/QuoteOfferDetails";
import QuoteOfferAcceptForm from "./quote_offer_accept";
import Card from "../Uielements/Card/card.style";

class Quote_offer_drawer extends React.PureComponent {
  state = { visible: false };

  INITIAL_STATE = {
    visible: false,
    quote: null,
  }

  constructor(props){
    super(props);
    this.state = { ...this.INITIAL_STATE };
  }

  componentDidMount(){
    if (this.props.quote){
      this.setState({quote: this.props.quote});
    }
    if (this.props.visible){
      this.setState({visible: this.props.visible});
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.quote !== this.props.quote){
      this.setState({quote:this.props.quote});
    }
    if (prevProps.visible !== this.props.visible){
      this.setState({visible: this.props.visible});
    }

  }


  onClose = () => {
    if (this.props.onClose){
      this.props.onClose()
    }
  };


  render() {
    const {quote, visible} = this.state

    if (quote == null){
      return ("")
    }

    return (

          <Drawer
              width="70%"
              placement="right"
              closable={true}
              onClose={this.onClose}
              visible={visible}
              destroyOnClose={true}
          >
            <Card title={this.props.intl.formatMessage({id: 'shipment.quote_offer.title'})}>
              <QuoteOfferAcceptForm
                view={this.props.view}
                quote={quote}
                onClose={this.onClose}
              />
            </Card>
            <Card title={this.props.intl.formatMessage({id: 'quote.details.title'})}>
              <QuoteOfferDetails
                quote={quote}
              />
            </Card>
            
          </Drawer>
    );
  }
}

Quote_offer_drawer.contextTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(Quote_offer_drawer)