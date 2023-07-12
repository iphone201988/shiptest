import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from "prop-types";
import { Link } from 'react-router-dom';
import notification from 'components/notification';
import HelperText from 'components/utility/helper-text';
import LayoutWrapper from 'components/utility/layoutWrapper';
import PageHeader from 'components/utility/pageHeader';
import IntlMessages from 'components/utility/intlMessages';
import Scrollbars from 'components/utility/customScrollBar';
import Button from 'components/uielements/button';
import invoiceActions from 'helpers/redux/invoice/actions';
import { FireQuery } from "helpers/firebase/firestore/firestore_collection";
import CardWrapper, { Box, StatusTag } from './invoice.style';
import TableWrapper from '../DataGrid/antTables/antTable.style';
import DataView from "../base/data_view";
import { toTableList } from "helpers/data/mapper";
import { firestoreConnect } from "react-redux-firebase";
import { injectIntl, intlShape } from "react-intl";
import { compose } from "redux";
import { fakedata } from './config'
import { Select } from 'antd';
import { RadioGroup, RadioButton } from "components/uielements/radio";
import ToogleButton from 'containers/Topbar/toggleButton'

const defaultView = "active"
class Invoices extends PureComponent {

  defaultViewType = "table"
  INITIAL_STATE = {
    viewType: "table",
    loading: true,
    Initialized: false,
    selected: [],
    PaymentMethods: [],
    queryFilterConditions: [],
    resultsFilterConditions: [],
    Columns: [],
    view: defaultView,
    shipment_info: []
  }

  static propTypes = {
    companyId: PropTypes.string,
  }
  constructor(props) {
    super(props);

    this.state = { ...this.INITIAL_STATE };
    this.state.columns = this.getColumns()
    this.state.itemActions = this.getItemActions()
  }
  componentDidMount() {
    const { initialInvoices, initData } = this.props;

    let billings = [], activeBilling = null;
    if (this.props?.activeBillingProfiles) {
      for (let i = 0; i < Object.keys(this.props?.activeBillingProfiles).length; i++) {
        billings.push({ value: Object.keys(this.props?.activeBillingProfiles)[i], label: this.props.activeBillingProfiles[Object.keys(this.props?.activeBillingProfiles)[i]].business_profile.business_name })
      }
      activeBilling = Object.keys(this.props?.activeBillingProfiles)[0];
    }
    this.setState({ billingArray: billings, activeBillingId: activeBilling })

  }
  componentDidUpdate() {
    let billings = [], activeBilling = null;
    if (this.props?.activeBillingProfiles) {
      for (let i = 0; i < Object.keys(this.props?.activeBillingProfiles).length; i++) {
        billings.push({ value: Object.keys(this.props?.activeBillingProfiles)[i], label: this.props.activeBillingProfiles[Object.keys(this.props?.activeBillingProfiles)[i]].business_profile.business_name })
      }
      if (this.state.activeBillingId === null) {
        for (let i = 0; i < Object.keys(this.props?.activeBillingProfiles).length; i++) {
        activeBilling = Object.keys(this.props?.activeBillingProfiles)[0];
        this.setState({ billingArray: billings, activeBillingId: activeBilling })
      }}
    }
    if (this.props?.invoices) {
      this.setState({ invoices: this.props.invoices })
    }
  }

  onChange = (value) => {
    this.setState({ activeBillingId: value, queryFilterConditions: [new FireQuery('recipient.billing_profile.id', '==', value)] })
    // console.log(this.state.queryFilterConditions,"WWWWWW");
    this.setState({shipment_info:[new FireQuery('recipient.shipment_info', '==', value)]})
  };

  getColumns = () => {
    return [
      {
        title: 'Invoice Number',
        dataIndex: 'invoice_number',
        rowKey: 'invoiceNumber',
        width: '10%',
        render: text => <span>{text}</span>,
      },
      {
        title: 'Name',
        dataIndex: 'type',
        rowKey: 'type',
        width: '10%',
        render: text => { if (text == 'shipment_invoice') return <span>{'State to City'}</span> }
      },
      {
        title: 'Type',
        dataIndex: 'type',
        rowKey: 'type',
        width: '10%',
        render: (text) => {
          if (text == 'shipment_invoice') {
            return <span>{'Shipment Invoice'}</span>
          }
        }
      },
      {
        title: 'Status',
        dataIndex: 'invoice_status',
        rowKey: 'invoice_status',
        width: '10%',
        render: text => {
          if (String(text.current_status).toLowerCase() === 'draft') {
            return <span className='ant-tag ant-tag-grey'>{'Draft'}</span>
          } else if (String(text.current_status).toLowerCase() === 'open') {
            return <span className='ant-tag ant-tag-blue'>{'Open'}</span>
          } else if (String(text.current_status).toLowerCase() === 'void') {
            return <span className='ant-tag ant-tag-black'>{'Void'}</span>
          } else if (String(text.current_status).toLowerCase() === 'partially paid') {
            return <span className='ant-tag ant-tag-orange'>{'Partially Paid'}</span>
          } else if (String(text.current_status).toLowerCase() === 'paid') {
            return <span className='ant-tag ant-tag-green'>{'Paid'}</span>
          }
          else if (String(text.current_status).toLowerCase() === 'uncollectible') {
            return <span className='ant-tag ant-tag-red'>{'Uncollectible'}</span>
          }
          else if (String(text.current_status).toLowerCase() === 'failed') {
            return <span className='ant-tag ant-tag-maroon'>{'Failed'}</span>
          }
        }
      },
      {
        title: 'Invoice Date',
        dataIndex: 'dates',
        rowKey: 'dates',
        width: '10%',
        render: text => <span>{(text.invoice_date)}</span>,
      },
      {
        title: 'Due Date',
        dataIndex: 'dates',
        rowKey: 'dates',
        width: '10%',
        render: text => <span>{text.invoice_due_date}</span>,
      },
      {
        title: 'Amount Due',
        dataIndex: 'amount',
        rowKey: 'amount',
        width: '10%',
        render: text => <span>{text.total}</span>,
      },
      {
        title: 'Balance',
        dataIndex: 'totalCost',
        rowKey: 'totalCost',
        width: '10%',
        render: text => <span>{text}</span>,
      },

    ];
  }
  getItemActions = () => {
    return [
      { label: "general.viewInvoice", type: "viewItem", itemTabKey: "details",selectedItem:"details" },
      { label: "general.pay", type: "viewItem", itemTabKey: "pay",selectedItem:"pay" },
      { label: "general.viewRelatedDocument", type: "viewItem", itemTabKey: "viewRelatedDocument",selectedItem:"viewRelatedDocument" },
      { label: "general.ViewShipment", type: "viewItem", itemTabKey: "shipment_info",selectedItem:"shipment_info" },
      { label: "general.download", type: "viewItem", itemTabKey: "download" ,selectedItem:"download"},
      { label: "payment_methods.despute", type: "viewItem", itemTabKey: "despute",selectedItem:"despute" },
    ]
  }

  getnewInvoiceId = () => new Date().getTime();
  render() {
    const { match, deleteInvoice } = this.props;
    const { selected, columns, invoices, itemActions, resultsFilterConditions, locationFiltersQuotes } = this.state;
    let { viewType, activeBillingId, queryFilterConditions, view, billingArray } = this.state

    if (activeBillingId) {
      queryFilterConditions = [new FireQuery('recipient_account.billing_profile.id', '==', activeBillingId)]
    }
    const { toggleState } = this.props;
    if (toggleState) {
      viewType = "card"
    } else {
      viewType = "table"
    }
    if (queryFilterConditions.length > 0) {
      return <>
        <CardWrapper >
          <LayoutWrapper>
            <div className="selectOuter">
              <IntlMessages id="billing_profiles.name" />
              <Select
                defaultValue={activeBillingId}
                placeholder="Select a biling profile"
                optionFilterProp="children"
                onChange={this.onChange}
                style={{ width: 300 }}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={billingArray}
              />
            </div>
            <div className={"toggleOuter"}>
              <ToogleButton {...this.props} />
            </div>
            <Box>
              <>
                <LayoutWrapper>
                  <Box>
                    <div className="isoInvoiceTableBtn">
                      <Link to={`${match.path}/${this.getnewInvoiceId()}`}>
                        <Button type="primary" className="mateAddInvoiceBtn">
                          Add Invoice
                        </Button>
                      </Link>
                    </div>
                    <DataView
                      itemType={"invoice"}
                      queryFilterConditions={queryFilterConditions}
                      resultsFilterConditions={resultsFilterConditions}
                      columns={columns}
                      itemActions={itemActions}
                      viewType={viewType}
                      layouts={[{ key: viewType, sections: [{ type: viewType, span: 24 }] }]}
                    />
                  </Box>
                </LayoutWrapper>
              </>
            </Box>
          </LayoutWrapper>
        </CardWrapper>
      </>

    }
    return null

  }
}

function mapStateToProps(state) {
  return {
    firebase: state.FB.firebase,
    activeBillingProfiles: state.FB.billingProfiles.activeBillingProfiles,
    toggleState: state.App.toggleState,
  };

}

export default compose(
  connect(mapStateToProps, {}),
  firestoreConnect()
)(injectIntl(Invoices))