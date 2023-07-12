import React, {Component}  from "react";
import {injectIntl, intlShape}  from "react-intl";
import moment from "moment";

import LayoutWrapper from "components/utility/layoutWrapper";

import IntlMessages from "components/utility/intlMessages";
import {Box} from "./shipments_documents.style";
import ShipmentService from "../../services/shipment"
import Shipment from "model/shipment/shipment";

import {shipment_status} from "constants/options/shipping";
import {dateFormat} from "constants/variables";
import {FreightBill} from "./FreightBill/freight_bill";
import {toTableList} from "helpers/data/mapper";
import CustomTable from "../DataGrid/customTable";

class ShipperShipments extends Component {

  INITIAL_STATE = {
    TrailerTypes: {},
    Initialized: false,
    Shipments: [],
    Columns: [],
    ShipmentDetails: {},
    FreightBillVisible: false,
    shipments_options: {}
  }

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
    this.state.shipments_options =  props.shipments_options || {}
    this.setState({Columns: this.get_colums()})
  }

  componentDidMount() {
    this.getShipperShipments()
  }


  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {

    if (nextProps.shipments_options !== this.props.shipments_options ){
      this.setState(
          {
            shipments_options: nextProps.shipments_options,
          })
    }
  }

  getTrailerType = (key) => {
    if (this.state.TrailerTypes){
      return this.state.TrailerTypes[key] || ""
    }
    return key
  }

  showFreightBill = (shipment) => {
    if (shipment instanceof Shipment){
      this.setState({FreightBillVisible: true, ShipmentDetails: shipment})
    }
  }

  get_colums = () => {
    return [
      {
        title: 'Action',
        key: 'x',
        width: '5%',
        dataIndex: '',
        render: (text, record, index) => (<span>
          <div>
            <div>
              {/* eslint-disable-next-line */}
              <a onClick={()=> {this.showFreightBill(record)}}>
                {this.props.intl.formatMessage({id: "document.freight_bill"})}</a>

            </div>
          </div>
        </span>)
      },
      {
        title: this.props.intl.formatMessage({id: "general.id"}),
        dataIndex: 'id',
        rowKey: 'status',
        width: '8%',
        render: (text) => <span>{text}</span>,
      },
      {
        title: this.props.intl.formatMessage({id: "general.status"}),
        dataIndex: '',
        rowKey: 'status',
        width: '8%',
        render: (text, quote) => <span>
           <IntlMessages id={shipment_status(quote.status).name || ""}/>
        </span>,
      },
      {
        title: this.props.intl.formatMessage({id: "freight.type.title"}),
        dataIndex: 'freight_type',
        rowKey: 'freight_type',
        width: '5%',
        render: text => <span>{text}</span>,
      },
      {
        title: this.props.intl.formatMessage({id: "shipment.pickup_info.date.title"}),
        dataIndex: '',
        rowKey: 'pickup_date',
        width: '7%',
        render: (text, record) => <span>{new moment(record.itinerary.pickup_date).format(dateFormat)}</span>,
      },
      {
        title: this.props.intl.formatMessage({id: "shipment.delivery_info.date.title"}),
        dataIndex: '',
        rowKey: 'delivery_date',
        width: '7%',
        render: (text, record) => <span>{new moment(record.itinerary.delivery_date).format(dateFormat)}</span>,
      },
      {
        title: this.props.intl.formatMessage({id: "shipment.origin.title"}),
        dataIndex: 'itinerary.origin.shortLabel',
        rowKey: 'origin',
        width: '10%',
        render: (text, record) => <span>
          {`${record.itinerary.origin.address.city}, ${record.itinerary.origin.address.country}`}
        </span>,
      },
      {
        title: this.props.intl.formatMessage({id: "shipment.destination.title"}),
        dataIndex: 'itinerary.destination.shortLabel',
        rowKey: 'destination',
        width: '10%',
        render: (text, record) => <span>
          {`${record.itinerary.destination.address.city}, ${record.itinerary.destination.address.country}`}
        </span>,
      },
    ]
  }


  getShipperShipments(){
    const {shipments_options} = this.state
    ShipmentService.getShipperShipments(shipments_options).then(shipments => {
      this.setState({Shipments: shipments})
      this.setState({Initialized: true})
    } ).catch(e => {})
  }

  onShipmentDetailsClose = () => {
    this.setState({FreightBillVisible: false})
  }


  render() {
    const {Shipments, FreightBillVisible, ShipmentDetails, Initialized} = this.state

    let content =    <LayoutWrapper>

      <Box>
          <CustomTable
              loading={!Initialized}
              dataSource={toTableList(Shipments)}
              columns={this.get_colums()}
              pagination={true}
              className="invoiceListTable"
          />
          <FreightBill
              visible={FreightBillVisible}
              shipment={ShipmentDetails}
              onClose={this.onShipmentDetailsClose}
              is_shipper={false}
          />
      </Box>

    </LayoutWrapper>

    return content

  }
}

// quotes.contextTypes = {
//   intl: PropTypes.object.isRequired,
// };

ShipperShipments.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(ShipperShipments);