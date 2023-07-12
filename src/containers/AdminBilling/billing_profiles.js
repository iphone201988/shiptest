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
import FilterBox from "components/base/filter_box";
import DataView from "../base/data_view";
import {optionObjectToOptionsLabelValue} from "helpers/data/mapper";
import {deleteBillingProfile} from "helpers/firebase/firebase_functions/billing_profiles";
import {notifyError, notifySuccess} from "components/notification";

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
        title: "Label",
        key: "label",
        dataIndex: 'label',
        rowKey: 'label',
        width: '10%',
        render: (text, record) => <span>{record.label}</span>
      },
      {
        title: "Type",
        key: "type",
        dataIndex: '',
        rowKey: 'type',
        width: '10%',
        render: (text, record) => <span>{record.type}</span>
      },
      {
        title: "currency",
        key: "currency",
        dataIndex: "currency",
        rowkey: "currency",
        width: '10%',
        render: (text, record) => <span>{record.currency}</span>
      },
      {
        title: this.props.intl.formatMessage({id: "general.name"}),
        key: "name",
        dataIndex: 'name',
        rowKey: 'name',
        width: '10%',
        render: (text, record) => <span>{record.contact_profile.full_name}</span>
      },
      {
        title: this.props.intl.formatMessage({id: "general.email"}),
        key: "email",
        dataIndex: 'email',
        rowKey: 'email',
        width: '10%',
        render: (text, record) => <span>{record.contact_profile.email}</span>
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

    return    <LayoutWrapper>
      <FilterBox
          title={this.props.intl.formatMessage({id: 'general.actions.find_users'})}
          formInputs={filterInputs}
          onSubmit={this.setFilterConditions}
      />
      <DataView itemType={"billing_profile"}
                queryFilterConditions={queryFilterConditions}
                resultsFilterConditions={resultsFilterConditions}
                columns={columns}
                itemActions={itemActions}
                viewType={viewType}
                layouts={[{key: 'table', sections:[{type: 'table', span: 24}]}]}
      />
    </LayoutWrapper>


  }

}

BillingProfiles.propTypes = {
  intl: intlShape.isRequired
}

const mapStateToProps = state => {
  return {
    companyId: state.FB.company.companyId,
  }
}

export default compose(
    connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(BillingProfiles))
