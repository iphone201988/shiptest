import React, {Component}  from "react";
import {injectIntl, intlShape}  from "react-intl";
import moment from "moment";

import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Scrollbars from "components/utility/customScrollBar";
import {Box} from "./quotes.style";
import CardWrapper from "./quotes.style";
import ShipmentService from "../../services/shipment"

import {QuoteDetailsDrawer} from "components/Shipment/QuoteDetailsDrawer";
import QuoteModifyDrawerForm from "components/Shipment/QuoteModifyDrawer";

import {
  dateFormat,
  TYPE_UPDATE_QUOTE_REQUEST
} from "constants/variables";
import {get_currency} from "constants/options/money";
import {
  get_trailer_type, quote_offer_status
} from "constants/options/shipping";
import {weight_convert} from "helpers/views/units";
import {toTableList} from "helpers/data/mapper";
import CustomTable from "../DataGrid/customTable";

class QuoteOffers extends Component {

  INITIAL_STATE = {
    TrailerTypes: {},
    Initialized: false,
    selected: [],
    Quotes: [],
    QuoteWeights: [],
    Columns: [],
    QuoteDetails: {},
    QuoteDetailsVisible: false,
    QuoteModifyVisible: false,
    quote_offers_options:{}
  }

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
    this.state.quote_offers_options =  props.quote_offers_options || {}
    this.setState({Columns: this.get_colums()})
  }

  componentDidMount() {
    this.getQuotes()
  }

  componentDidUpdate(prevProps) {

    if (prevProps.quote_offers_options !== this.props.quote_offers_options ){
      this.setState({quote_offers_options: this.props.quote_offers_options})
    }
  }

  getTrailerType = (key) => {
    if (this.state.TrailerTypes){
      return this.state.TrailerTypes[key] || ""
    }
    return key
  }

  showQuoteDetails = (record) => {
    this.setState({QuoteDetailsVisible: true, QuoteDetails: record})
  }

  get_colums = () => {
    return [
      {
        title: 'Action',
        key: 'x',
        width: '10%',
        dataIndex: '',
        render: (text, record, index) => (<span>
          <div>
            <div>
              {/* eslint-disable-next-line */}
              <a onClick={()=> {this.showQuoteDetails(record)}}>
                {this.props.intl.formatMessage({id: "general.details"})}</a></div>
          </div>
        </span>)
      },
      {
        title: this.props.intl.formatMessage({id: "general.status"}),
        dataIndex: '',
        rowKey: 'status',
        width: '10%',
        render: (text, quote) => <span>
           <IntlMessages id={quote_offer_status(quote.status).name || ""}/>
        </span>,
      },
      {
        title: this.props.intl.formatMessage({id: "freight.type.title"}),
        dataIndex: 'freight_type',
        rowKey: 'id',
        width: '10%',
        render: text => <span>{text}</span>,
      },
      {
        title: this.props.intl.formatMessage({id: "trailer.title"}),
        dataIndex: '',
        rowKey: 'trailer',
        width: '10%',
        render: (text, record) => <span>
           <IntlMessages id={get_trailer_type(record.trailer_type).name || ""}/></span>
      },
      {
        title: this.props.intl.formatMessage({id: "shipment.pickup_info.date.title"}),
        dataIndex: '',
        rowKey: 'pickup_date',
        width: '10%',
        render: (text, record) => <span>{new moment(record.itinerary.pickup_date).format(dateFormat)}</span>
      },
      {
        title: this.props.intl.formatMessage({id: "shipment.delivery_info.date.title"}),
        dataIndex: '',
        rowKey: 'delivery_date',
        width: '10%',
        render: (text, record) => <span>{new moment(record.itinerary.delivery_date).format(dateFormat)}</span>,
      },
      {
        title: this.props.intl.formatMessage({id: "shipment.origin.title"}),
        dataIndex: 'itinerary.origin.address.label',
        rowKey: 'origin',
        width: '10%',
        render: (text, record) => <span>
          {`${record.itinerary.origin.address.city}, ${record.itinerary.origin.address.country}`}
        </span>,
      },
      {
        title: this.props.intl.formatMessage({id: "shipment.destination.title"}),
        dataIndex: 'itinerary.destination.address.label',
        rowKey: 'destination',
        width: '10%',
        render: (text, record) => <span>
          {`${record.itinerary.destination.address.city}, ${record.itinerary.destination.address.country}`}
        </span>,
      },
      {
        title: this.props.intl.formatMessage({id: "shipper.title"}),
        dataIndex: 'shipper.profile.name',
        rowKey: 'shipper',
        width: '10%',
        render: text => <span>{text}</span>,
      },
      {
        title: this.props.intl.formatMessage({id: "general.weight"}),
        dataIndex: '',
        rowKey: 'weight',
        width: '10%',
        render: (text, record) => <span>{weight_convert(record.weight, {show_unit:true})}</span>,
      },
      {
        title: this.props.intl.formatMessage({id: "shipment.rate.title"}),
        dataIndex: '',
        rowKey: 'rate',
        width: '10%',
        render: (text, record) => <span>
          <IntlMessages id={get_currency().name}/> {record.rate.carrier_rate}
        </span>,
      },

    ]
  }

  getQuotes = () => {
    const {quote_offers_options} = this.state
    ShipmentService.getCarrierQuoteOffers(quote_offers_options).then(quotes => {
      this.setState({Quotes: quotes})
      this.setState({Initialized: true})
    } ).catch(e => {})
  }

  onRefreshRequired = () => {
    this.getQuotes()
  }

  onQuoteDetailsClose = () =>{
    this.setState({QuoteDetailsVisible: false})
  }

  onQuoteModifyClose = () => {
    this.setState({QuoteModifyVisible: false})
  }


  render() {

    const {Quotes, QuoteDetailsVisible, QuoteDetails, QuoteModifyVisible, Initialized} = this.state

    let table =    <LayoutWrapper>
          <Box>
            <div className="isoInvoiceTableBtn">
            </div>
            <CardWrapper title={this.props.intl.formatMessage({id: "general.quotes"})}>

                  <div>
                    <div className="isoInvoiceTable">
                      <Scrollbars style={{width: '100%'}}>
                        <CustomTable
                            dataSource={toTableList(Quotes)}
                            loading={!Initialized}
                            columns={this.get_colums()}
                            pagination={true}
                        />
                      </Scrollbars>
                    </div>
                    <QuoteDetailsDrawer
                        visible={QuoteDetailsVisible}
                        quote={QuoteDetails}
                        onClose={this.onQuoteDetailsClose}
                    />

                    <QuoteModifyDrawerForm
                        visible={QuoteModifyVisible}
                        loading={!Initialized}
                        quote={QuoteDetails}
                        onSubmit={this.onRefreshRequired}
                        onClose={this.onQuoteModifyClose}
                        type={TYPE_UPDATE_QUOTE_REQUEST}
                    />
                    </div>
            </CardWrapper>
          </Box>
        </LayoutWrapper>
    return table

  }
}

QuoteOffers.propTypes = {
  intl: intlShape.isRequired
}


export default injectIntl(QuoteOffers);