import React, {Component}  from "react";
import {injectIntl, intlShape}  from "react-intl";
import LayoutWrapper from "components/utility/layoutWrapper";
import PageHeader from "components/utility/pageHeader";
import IntlMessages from "components/utility/intlMessages";
import {Link} from "react-router-dom";
import Button from "components/uielements/button";
import HelperText from "components/utility/helper-text";
import Scrollbars from "components/utility/customScrollBar";
import TableWrapper from "../DataGrid/antTables/antTable.style";
import {Box} from "./quotes.style";
import CardWrapper from "./quotes.style";
import ShipmentService from "../../services/shipment"
import {CARRIER_APP} from "constants/application";
import {weight_convert} from "helpers/views/units";
import {toTableList} from "helpers/data/mapper";


class MarketQuotes extends Component {

  INITIAL_STATE = {
    TrailerTypes: {},
    Initialized: false,
    selected: [],
    Quotes: [],
    QuoteWeights: [],
    Columns: []
  }

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
    this.setState({Columns: this.get_colums()})
  }


  getTrailerType = (key) => {
    if (this.state.TrailerTypes){
      return this.state.TrailerTypes[key] || ""
    }
    return key
  }

  get_colums = () => {
    return [
      {
        title: this.props.intl.formatMessage({id: "freight.type.title"}),
        dataIndex: 'freight_type',
        rowKey: 'id',
        width: '10%',
        render: text => <span>{text}</span>,
      },
      {
        title: this.props.intl.formatMessage({id: "trailer.title"}),
        dataIndex: 'trailer_type',
        rowKey: 'id',
        width: '10%',
        render: text => <span>{text}</span>,
      },
      {
        title: this.props.intl.formatMessage({id: "shipment.origin.title"}),
        dataIndex: 'itinerary.origin.address.label',
        rowKey: 'id',
        width: '10%',
        render: text => <span>{text}</span>,
      },
      {
        title: this.props.intl.formatMessage({id: "shipment.destination.title"}),
        dataIndex: 'itinerary.destination.address.label',
        rowKey: 'id',
        width: '10%',
        render: text => <span>{text}</span>,
      },
      {
        title: this.props.intl.formatMessage({id: "general.weight"}),
        dataIndex: '',
        rowKey: 'id',
        width: '10%',
        render: (text, record) => <span>{weight_convert(record.weight, {show_unit:true})}</span>,
      },

    ]
  }


  componentDidMount() {
    this.getQuotes()
  }

  getQuotes(){
    let options = {'status': 'quote'}
    ShipmentService.getShipments(options, CARRIER_APP).then(quotes => {
      this.setState({quotes: quotes})
      this.setState({Initialized: true})
    } )
  }


  render() {
    const {Quotes} = this.state

    let x =    <LayoutWrapper>
          <PageHeader>
            <IntlMessages id="sidebar.quotes"/>
          </PageHeader>
          <Box>
            <div className="isoInvoiceTableBtn">
              <Link to="">
                <Button type="primary" className="mateAddInvoiceBtn">
                  Add Quote
                </Button>
              </Link>
            </div>

            <CardWrapper title={this.props.intl.formatMessage({id: "general.quotes"})}>
              {Quotes.length === 0 ? (
                  <HelperText text="No Quotes"/>
              ) : (

                  <div className="isoInvoiceTable">
                    <Scrollbars style={{width: '100%'}}>
                      <TableWrapper
                          dataSource={toTableList(Quotes)}
                          columns={this.get_colums()}
                          pagination={true}
                          className="invoiceListTable"
                      />
                    </Scrollbars>
                  </div>

              )}
            </CardWrapper>
          </Box>
        </LayoutWrapper>
    return x

  }
}

// quotes.contextTypes = {
//   intl: PropTypes.object.isRequired,
// };

MarketQuotes.propTypes = {
  intl: intlShape.isRequired
}


export default injectIntl(MarketQuotes);