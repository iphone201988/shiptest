import React, { useRef } from "react";
import ReactDOMServer, { ReactDOM } from 'react-dom/server';
import { Page, Document } from '@react-pdf/renderer';
import { injectIntl, intlShape } from "react-intl";
import Box from "components/utility/box";
import Invoice from "model/invoice/invoice.js";
import Card from "containers/Uielements/Card/card.style";
import './popUpStyle.css';
import {
  renderInvoiceDataView
} from "../InvoiceDetails/invoiceComponents";
import Button from 'components/uielements/button';
import Popover  from 'antd'



class InvoiceDetailView extends React.Component {

  constructor(props) {

    const INITIAL_QUOTE = {
      domain: "shipping",
      invoice: props.shipment || null,
      detailsView: undefined,
      popUp: false,
    }

    super(props);
    this.state = { ...INITIAL_QUOTE };
    this.handlePrint = this.handlePrint.bind(this);
    this.originalContents = document.body.innerHTML;
   
  }

  componentDidMount() {
    window.addEventListener('afterprint', this.handleAfterPrint);
    this.setOptions()
  }

  setOptions = () => {

    this.setState({
      detailsView: this.props.itemTabKey,
    })
  }

  componentDidUpdate(prevProps) {
    if ((this.props.invoice instanceof Invoice) &&
      (prevProps.remove_map !== this.props.remove_map
        || prevProps.invoice !== this.props.invoice || prevProps.domain !== this.props.domain)) {
      this.setState({ invoice: this.props.shipment, domain: this.props.domain })
    }
    window.removeEventListener('afterprint', this.handleAfterPrint);
  }

  onCloseDetail = () => {
    this.props.onCloseDetail()
  }

  handlePrint = () =>{
    const printContents = document.getElementById('drawer-invoice').innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = this.originalContents
  }

  handleAfterPrint = () => {
    this.setState({popUp:true})
    const content = document.body.innerHTML;
    ReactDOM.render(
      <Popover>
        <div>{content}</div>
      </Popover>,
      document.getElementById('popover-root')
    );
    document.body.innerHTML = this.originalContents
  };

  renderView = (detailsView, invoice) => {
    if (detailsView === "details") {
      return (
        <Card>
          {renderInvoiceDataView(invoice, this.props.intl.formatMessage, {
            showIssuerAccount: true,
            showInvoice: true, showInvoiceStatus: true, showRecipientAccount: true, showPayitems: true, showTotalDetails: true, showType: true
          })}</Card>
      )
    }
  }

  render() {
    const { invoice, detailsView } = this.state

    if (invoice === null) {
      return (<div></div>)
    }
    return (
      <div>
        <Button type="primary" onClick={this.handlePrint}>Print Invoice</Button>
      <div id="drawer-invoice">
        <Document >
          <Page size="A4" >
          <Box >
            {this.renderView(detailsView, invoice)}
          </Box>
        </Page>
      </Document>
      </div>
      {this.popUp && <div id="popover-root"></div>}
      </div >)
  }

}
InvoiceDetailView.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(InvoiceDetailView)


