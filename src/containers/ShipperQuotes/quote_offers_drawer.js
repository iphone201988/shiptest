import React from "react";

import Drawer from 'antd/es/drawer'
import QuoteRequestOffers from  "./quote_request_offers"
import QuoteRequest from "model/shipment/quote_request";


export class QuoteOffersDrawer extends React.PureComponent {

    onClose = () => {
        if (this.props.onClose) {
            this.props.onClose()
        }
    };

    render() {
        const {quote, visible, view} = this.props

        if (!quote){
            return ('')
        }

        return (
            <Drawer
                width="80%"
                placement="right"
                closable={true}
                onClose={this.onClose}
                visible={visible}
            >
                {quote instanceof QuoteRequest  ?
                    <QuoteRequestOffers view={view} quoteRequest={quote}></QuoteRequestOffers>
                    : ""
                }

            </Drawer>
        )
    }

}

