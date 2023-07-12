import React, {Component}  from "react";
import {injectIntl, intlShape}  from "react-intl";
import moment from "moment";

import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";

import {Box} from "./quotes.style";
import CardWrapper from "./quotes.style";
import ShipmentService from "../../services/shipment"
import QuoteModifyDrawerForm from "components/Shipment/QuoteModifyDrawer";
import {
  dateFormat,
  TYPE_UPDATE_QUOTE_REQUEST
} from "constants/variables";
import Notification from "components/notification";
import {get_currency} from "constants/options/money";
import {
  get_trailer_type,
  QUOTE_OFFER_STATUS_COUNTER_OFFER_PENDING, QUOTE_OFFER_STATUS_PENDING,
  QUOTE_OFFER_STATUS_REJECTED, quote_offer_status
} from "constants/options/shipping";
import {weight_convert} from "helpers/views/units";
import QuoteOfferDrawer from "./quote_offer_drawer";
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
    QuoteOfferReviewAcceptVisible: false,
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
      this.setState(
          {
            quote_offers_options: this.props.quote_offers_options,
          })
    }
  }

  componentDidUpdate(prevProps) {

    if (prevProps.quote_offers_options !== this.props.quote_offers_options ){
      this.setState(
          {
            quote_offers_options: this.props.quote_offers_options,
          })
    }
  }

  getTrailerType = (key) => {
    if (this.state.TrailerTypes){
      return this.state.TrailerTypes[key] || ""
    }
    return key
  }

  showQuoteOfferReviewAccept = (record) => {
    this.setState({QuoteOfferReviewAcceptVisible: true, QuoteDetails: record})
  }

  AcceptQuoteOffer = (record) => {
    ShipmentService.acceptQuoteOffer(record.id)
    this.onRefreshRequired()
  }

  showQuoteModify = (record) => {
    this.setState({QuoteModifyVisible: true, QuoteDetails: record})
  }

  cancelQuoteRequest = (record) => {
    ShipmentService.cancelQuoteRequest(record.id)
        .then(res => {
          Notification('success', this.props.intl.formatMessage({id: "feedback.alert.quote_cancelled"}))
          this.onRefreshRequired()
        }).catch(e => {})
  }

  getQuotes = () => {
    const {quote_offers_options} = this.state
    ShipmentService.getShipperQuoteOffers(quote_offers_options).then(quotes => {
      this.setState({Quotes: quotes})
      this.setState({Initialized: true})
    } ).catch(e => {})
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
            {record.status == QUOTE_OFFER_STATUS_PENDING ?
            <div>
              <a onClick={()=> {this.showQuoteOfferReviewAccept(record)}}>
                {this.props.intl.formatMessage({id: "general.review_accept"})}</a></div>
                :""}
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
        title: this.props.intl.formatMessage({id: "carrier.title"}),
        dataIndex: 'carrier.profile.name',
        rowKey: 'id',
        width: '10%',
        render: text => <span>{text}</span>,
      },
      {
        title: this.props.intl.formatMessage({id: "trailer.title"}),
        dataIndex: '',
        rowKey: 'id',
        width: '10%',
        render: (text, record) => <span>
           <IntlMessages id={get_trailer_type(record.trailer_type).name || ""}/>
        </span>,
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
        rowKey: 'id',
        width: '10%',
        render: (text, record) => <span>
          {`${record.itinerary.origin.address.city}, ${record.itinerary.origin.address.country}`}
        </span>,
      },
      {
        title: this.props.intl.formatMessage({id: "shipment.destination.title"}),
        dataIndex: 'itinerary.destination.address.label',
        rowKey: 'id',
        width: '10%',
        render: (text, record) => <span>
          {`${record.itinerary.destination.address.city}, ${record.itinerary.destination.address.country}`}
        </span>
      },
      {
        title: this.props.intl.formatMessage({id: "general.weight"}),
        dataIndex: '',
        rowKey: 'id',
        width: '10%',
        render: (text, record) => <span>{weight_convert(record.weight, {show_unit:true})}</span>
      },
      {
        title: this.props.intl.formatMessage({id: "shipment.rate.title"}),
        dataIndex: '',
        rowKey: 'id',
        width: '10%',
        render: (text, record) => <span>
          <IntlMessages id={get_currency().name}/> {record.rate.shipper_rate}
        </span>,
      },
    ]
  }

  onRefreshRequired = () => {
    this.getQuotes()
  }

  onQuoteOfferAcceptClose = () =>{
    this.setState({QuoteOfferReviewAcceptVisible: false})
    this.onRefreshRequired()
  }

  onQuoteModifyClose = () => {
    this.setState({QuoteModifyVisible: false})
  }

  render() {

    const {Quotes, QuoteOfferReviewAcceptVisible, QuoteDetails, QuoteModifyVisible, Initialized} = this.state

    let table =    <LayoutWrapper>
          <Box>
            <div className="isoInvoiceTableBtn">
            </div>

            <CardWrapper title={this.props.intl.formatMessage({id: "general.quotes"})}>

                        <CustomTable
                            loading={!Initialized}
                            dataSource={toTableList(Quotes)}
                            columns={this.get_colums()}
                            pagination={true}
                            className="invoiceListTable"
                        />
              {QuoteOfferReviewAcceptVisible & QuoteDetails ?
                  <QuoteOfferDrawer
                      visible={QuoteOfferReviewAcceptVisible}
                      quote={QuoteDetails}
                      onClose={this.onQuoteOfferAcceptClose}
                      is_shipper={true}
                  />
              : ""}


                    <QuoteModifyDrawerForm
                        visible={QuoteModifyVisible}
                        quote={QuoteDetails}
                        onSubmit={this.onRefreshRequired}
                        onClose={this.onQuoteModifyClose}
                        type={TYPE_UPDATE_QUOTE_REQUEST}
                    />
            </CardWrapper>
          </Box>
        </LayoutWrapper>
    return table

  }
}

// quotes.contextTypes = {
//   intl: PropTypes.object.isRequired,
// };

QuoteOffers.propTypes = {
  intl: intlShape.isRequired
}


export default injectIntl(QuoteOffers);