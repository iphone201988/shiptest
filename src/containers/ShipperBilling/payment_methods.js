import React, {PureComponent}  from "react";
import {injectIntl, intlShape}  from "react-intl";
import {PropTypes} from "prop-types";

import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";

import {CURRENCIES_CODES} from "constants/options/money";
import {FireQuery} from "helpers/firebase/firestore/firestore_collection";
import DataView from "../base/data_view";
import {optionObjectToOptionsLabelValue} from "helpers/data/mapper";
import {deletePaymentMethod} from "helpers/firebase/firebase_functions/payment_method";
import {notifyError, notifySuccess} from "components/notification";
import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
import CardWrapper from '../PaymentMethod/payment_methods.style'
import { Select } from 'antd';
import { RadioGroup, RadioButton } from "components/uielements/radio";
import ToogleButton from 'containers/Topbar/toggleButton'
const _ = require("underscore")

const defaultView = "active"
const paymentMethodTypeName = {
  'acss_debit': 'payment_method.type.acss_debit',
  'card': 'payment_method.type.card'
}

const getPaymentMethodTypeName = (type, intl) => {
  return intl.formatMessage({id: paymentMethodTypeName[type] || ''})
}

const getPaymentDetailsField = (record, field) => {
  // TODO: move this to a helper file

  const profile = record.profile || {}
  const paymentAccountInfo = profile[profile.type]
  console.log(record,"record", field, " fields")
  const field_map = {
    'acss_debit': {
      'institution': paymentAccountInfo?.bank_name,
      'transit_number': paymentAccountInfo?.transit_number||paymentAccountInfo?.routing_number,
      'account_number': `****${paymentAccountInfo?.last4}`,
      "institution_number":paymentAccountInfo?.institution_number,
    },
    'card': {
      'brand': paymentAccountInfo?.brand,
      'country': paymentAccountInfo?.country,
      'expiry_date': paymentAccountInfo?.exp_month+'/'+paymentAccountInfo?.exp_year,
      "funding": paymentAccountInfo?.funding
    }
  }
  return field_map[profile.type]?.[field]

}

class PaymentMethods extends PureComponent {

  defaultViewType = "table"
  INITIAL_STATE = {
    viewType: this.defaultViewType,
    loading: true,
    Initialized: false,
    PaymentMethods: [],
    queryFilterConditions: [],
    Columns: [],
    view: defaultView,
    billingArray:[]
  }

  static propTypes = {
    companyId: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
    this.state.columns =  this.getColumns()
    this.state.itemActions = this.getItemActions()
  }

  componentDidMount() {
    let billings =[], activeBilling=null;
    if (this.props?.activeBillingProfiles) {
      for (let i = 0; i < Object.keys(this.props?.activeBillingProfiles).length; i++) {
        billings.push({ value: Object.keys(this.props?.activeBillingProfiles)[i], label: this.props.activeBillingProfiles[Object.keys(this.props?.activeBillingProfiles)[i]].business_profile.business_name })
      }
      activeBilling = Object.keys(this.props?.activeBillingProfiles)[0];
    }
    this.setState({billingArray:billings, activeBillingId:activeBilling })
  }

  componentDidUpdate(prevProps) {
    let billings =[], activeBilling=null;
    if (this.props?.activeBillingProfiles) {
      for (let i = 0; i < Object.keys(this.props?.activeBillingProfiles).length; i++) {
        billings.push({ value: Object.keys(this.props?.activeBillingProfiles)[i], label: this.props.activeBillingProfiles[Object.keys(this.props?.activeBillingProfiles)[i]].business_profile.business_name })
      }
      if(this.state.activeBillingId === null){
        activeBilling = Object.keys(this.props?.activeBillingProfiles)[0];
        this.setState({billingArray:billings, activeBillingId: activeBilling })
      }
    }
  }


  getColumns = () => {


    return [
      {
        title: this.props.intl.formatMessage({id: "payment_method.type"}),
        key: "payment_type",
        dataIndex: 'payment_type',
        rowKey: 'payment_type',
        width: '10%',
        render: (text, record) => <span>{getPaymentMethodTypeName(record.profile?.type, this.props.intl)}</span>
      },
      {
        title: this.props.intl.formatMessage({id: "payment_method.institution"}),
        key: "institution",
        dataIndex: 'institution',
        rowKey: 'institution',
        width: '20%',
        render: (text, record) => <span>{getPaymentDetailsField(record, 'institution')}</span>
      },
      {
        title: this.props.intl.formatMessage({id: "payment_method.account_number"}),
        key: "account_number",
        dataIndex: 'account_number',
        rowKey: 'account_number',
        width: '20%',
        render: (text, record) => <span>{getPaymentDetailsField(record, 'account_number')}</span>
      },
      {
        title: this.props.intl.formatMessage({id: "payment_method.billing_name"}),
        key: "billing_name",
        dataIndex: 'billing_name',
        rowKey: 'billing_name',
        width: '20%',
        render: (text, record) => <span>{record.profile?.billing_details?.name}</span>
      },
      {
        title: this.props.intl.formatMessage({id: "payment_method.billing_email"}),
        key: "billing_email",
        dataIndex: 'billing_email',
        rowKey: 'billing_email',
        width: '20%',
        render: (text, record) => <span>{record.profile?.billing_details?.email}</span>
      },
    ]
  }

  deletePaymentMethod = (paymentMethod) => {
    deletePaymentMethod(paymentMethod.id).then((res)=> {
      notifySuccess("payment_me.delete_success", this.props.intl)
    }).catch(e => {
      notifyError("billing_profile.delete_fail", this.props.intl)
    })
  }

  getItemActions = () => {
    return [
      {label: "general.details", type:"viewItem", itemTabKey: "details"},
      {confirm_text: "payment_methods.delete_confirm", label:"general.delete", type:"confirm", callback: this.deletePaymentMethod},
    ]
  }

  setOptions = () => {
    this.setState({
      CurrencyOptions: optionObjectToOptionsLabelValue(CURRENCIES_CODES, this.props.intl),
    })
  }

  // setFilterConditions = () => {
  //   const {billing_profile} = this.props
  //
  //   if (billing_profile?.id){
  //     const queryFilterConditions = [new FireQuery('billing_profile.id', '==', this.props.billing_profile?.id)]
  //     const resultsFilterConditions = []
  //     this.setState({queryFilterConditions: queryFilterConditions, resultsFilterConditions: resultsFilterConditions})
  //   }
  // }
  onChange = (value) => {
    console.log(`selected ${value}`);
    this.setState({ activeBillingId: value, queryFilterConditions: [new FireQuery('billing_profile.id', '==', value)] })
    console.log(this.props, this.state)
  };

  render() {
    // const {viewType, filterInputs, queryFilterConditions, resultsFilterConditions, itemActions} = this.state
    let { viewType, activeBillingId, queryFilterConditions, view, billingArray } = this.state
  
    // queryFilterConditions = [new FireQuery('billing_profile.id', '==', activeBillingId)]

    if (activeBillingId) {
      queryFilterConditions = [new FireQuery('billing_profile.id', '==', activeBillingId)]
    }
    const resultsFilterConditions = []
    const columns = this.getColumns()
    const itemActions = this.getItemActions()
    const { toggleState } = this.props;
    if(toggleState){
        viewType= "card"
    }else{
        viewType= "table"
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
              // onSearch={this.onSearch}
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
            <RadioGroup
              buttonStyle="solid"
              id="view"
              name="view"
              value={view}
              onChange={event => {
                this.setState({ view: event.target.value })
              }}
            >
              <RadioButton value="new">
                <IntlMessages id="dashboard.payment_method.add" />
              </RadioButton>
              <RadioButton value="active">
                <IntlMessages id="payment_method.name" />
              </RadioButton>
            </RadioGroup>
            <DataView itemType={"payment_method"}
              queryFilterConditions={queryFilterConditions}
              resultsFilterConditions={resultsFilterConditions}
              columns={columns}
              itemActions={itemActions}
              viewType={viewType}
              layouts={[{ key: viewType, sections: [{ type: viewType, span: 24 }] }]}
            />
          </Box>
        </LayoutWrapper>
        </CardWrapper>
      </>

    }
    return null
  }

}

PaymentMethods.propTypes = {
  intl: intlShape.isRequired
}

const mapStateToProps = state => {
  return {
    companyId: state.FB.company.companyId,
    activeBillingProfiles: state.FB.billingProfiles.activeBillingProfiles,
    toggleState: state.App.toggleState
  }
}

export default compose(
  connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(PaymentMethods))
