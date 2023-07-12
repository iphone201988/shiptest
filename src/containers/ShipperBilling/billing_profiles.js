import React, {PureComponent}  from "react";
import {injectIntl, intlShape}  from "react-intl";
import {PropTypes} from "prop-types";

import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";

import LayoutWrapper from "components/utility/layoutWrapper";

import BillingProfile from "model/billing/billing_profile";
import {CURRENCIES_CODES} from "constants/options/money";
import {mapFirestoreResultsToModelList} from "helpers/firebase/firestore_model";
import {FireQuery} from "helpers/firebase/firestore/firestore_collection";
import DataView from "../base/data_view";
import {optionObjectToOptionsLabelValue} from "helpers/data/mapper";
import {deleteBillingProfile} from "helpers/firebase/firebase_functions/billing_profiles";
import {notifyError, notifySuccess} from "components/notification";
import {CompactAddress} from "../../components/Location/locations_components";

const _ = require("underscore")

class BillingProfiles extends PureComponent {

  defaultViewType = "table"
  INITIAL_STATE = {
    viewType: this.defaultViewType,
    loading: true,
    Initialized: false,
    BillingProfiles: [],
    NewBillingVisible: false,
    BillingProfileDetailsVisible: false,
    BillingProfileModifyVisible: false,
    Columns: []
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
    if (this.props.companyId){
      this.setFilterConditions()
    }
  }

  componentDidUpdate(prevProps) {

    if (this.props.companyId !== prevProps.companyId){
      this.setFilterConditions()
    }

    if (!_.isEqual( prevProps.BillingProfiles , this.props.BillingProfiles)){
      this.setState({BillingProfiles:  mapFirestoreResultsToModelList(this.props.BillingProfiles, BillingProfile)})
    }
  }

  showBillProfileDetails = () => {
    this.setState({BillingProfileDetailsVisible: true})
  }

  showBillProfileModify = () => {
    this.setState({BillingProfileModifyVisible: true})
  }

  getColumns = () => {

    return [
      {
        title: this.props.intl.formatMessage({id: "general.label"}),
        key: "label",
        dataIndex: 'label',
        rowKey: 'label',
        width: '10%',
        render: (text, record) => <span>{record.label}</span>
      },
      {
        title: this.props.intl.formatMessage({id: "general.business_name"}),
        key: "business_name",
        dataIndex: 'business_name',
        rowKey: 'business_name',
        width: '15%',
        render: (text, record) => <span>{record.business_profile?.business_name}</span>
      },
      {
        title: this.props.intl.formatMessage({id: "billing.address"}),
        key: "business_address",
        dataIndex: 'business_address',
        rowKey: 'business_address',
        width: '20%',
        render: (text, record) => <CompactAddress location={record.business_profile?.billing_address}/>
      },
      {
        title: this.props.intl.formatMessage({id: "currency.title"}),
        key: "currency",
        dataIndex: "currency",
        rowkey: "currency",
        width: '5%',
        render: (text, record) => <span>{record.currency}</span>
      },
      {
        title: this.props.intl.formatMessage({id: "general.name"}),
        key: "name",
        dataIndex: 'name',
        rowKey: 'name',
        width: '15%',
        render: (text, record) => <span>{record.contact_profile?.full_name}</span>
      },
      {
        title: this.props.intl.formatMessage({id: "general.email"}),
        key: "email",
        dataIndex: 'email',
        rowKey: 'email',
        width: '15%',
        render: (text, record) => <span>{record.contact_profile?.email}</span>
      }

    ]
  }

  deleteBillingProfile = (billing_profile) => {
    deleteBillingProfile(billing_profile.id).then((res)=> {
      notifySuccess("billing_profile.delete_success", this.props.intl)
    }).catch(e => {
      notifyError("billing_profile.delete_fail", this.props.intl)
    })
}

  getItemActions = () => {
    return [
      {label: "general.details", type:"viewItem", itemTabKey: "details"},
      {label: "billing_profile.payment_setup", type:"viewItem", itemTabKey: "payment_account"},
      {confirm_text: "billing_profile.delete_confirm", label:"general.delete", type:"confirm", callback: this.deleteBillingProfile},
    ]
  }

  setOptions = () => {
    this.setState({
      CurrencyOptions: optionObjectToOptionsLabelValue(CURRENCIES_CODES, this.props.intl),
    })
  }

  setFilterConditions = (formValues={}) => {

    const queryFilterConditions = [new FireQuery('company_account.id', '==', this.props.companyId)]
    const resultsFilterConditions = []

    this.setState({queryFilterConditions: queryFilterConditions, resultsFilterConditions: resultsFilterConditions})
  }

  render() {
    const {viewType, columns,  filterInputs, queryFilterConditions, resultsFilterConditions, itemActions} = this.state

    return    <div>
      <DataView itemType={"shipper_billing_profile"}
                queryFilterConditions={queryFilterConditions}
                resultsFilterConditions={resultsFilterConditions}
                columns={columns}
                itemActions={itemActions}
                viewType={viewType}
                layouts={[{key: 'table', sections:[{type: 'table', span: 24}]}]}
      />
    </div>
  }

}

BillingProfiles.propTypes = {
  intl: intlShape.isRequired
}

const mapStateToProps = state => {
  return {
    companyId: state.FB.company.companyId,
    activeBillingProfiles: state.FB.billingProfiles.activeBillingProfiles
  }
}

export default compose(
    connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(BillingProfiles))
