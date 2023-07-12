import React, {PureComponent}  from "react";
import {injectIntl, intlShape}  from "react-intl";
import {compose} from "redux";
import {connect} from "react-redux";
import {PropTypes} from "prop-types";
import {firebaseConnect} from "react-redux-firebase";
import DataView from "../base/data_view.js";
import {DisplayTag} from "components/UI/buttons";
import {companies_account_status} from "constants/options/companies";
import setTabsFilter from "helpers/containers/states/setTabsFilter" ;
import FilterBox from "components/base/filter_box";
import {getSpan} from "constants/layout/grids";
import {
  LocationFilterFormItemlabelCol, 
  LocationFilterFormItemWrapperCol, 
  LocationFilterWrapperCol, 
  LocationRadiusFilterFormItemLabelCol, 
  LocationRadiusFilterFormItemWrapperCol, 
  LocationRadiusFilterWrapperCol
} from "helpers/containers/properties/shipment";
import { setCompanyFilter } from "helpers/containers/states/filters/setCompanyFilter.js";
import { COMPANIES_STATUS } from 'constants/options/companies.js';
import {objectToKeyValList} from 'helpers/data/mapper'
import CompanyAccount from "model/company/company.js";

const defaultViewType = "table";
const CompanyStatusKeyVal = objectToKeyValList(COMPANIES_STATUS);

class CarrierAccounts extends PureComponent {

  INITIAL_STATE = {
    queryFilterConditions: [],
    resultsFilterConditions: [],
    columns: [],
    itemActions: [],
    viewType: defaultViewType,
    companyStatusOptions: [],
    collectionModel: CompanyAccount,
  }

  static propTypes = {
  }

  constructor(props){
    super(props)
    this.state = {...this.INITIAL_STATE }
    this.state.columns =  this.getColumns()
    this.state.itemActions = this.getItemActions()
    
  }

  componentDidMount() {
    if (this.props.view !== 'null') {
      this.setTabsConditions(this.props.view)
    }
    this.setOptions()
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.view === 'null') {
      if (prevProps.view !== this.props.view) {
        this.setTabsConditions(this.props.view)
      }
    }
  }

  setOptions = () => {
    this.setState({
        CompanyStatusOptions: this.KeyValListToOptions(CompanyStatusKeyVal),
        detailsView: this.props.itemTabKey,
    })
}

KeyValListToOptions = (KeyValList) => {
    return KeyValList.map(kv => {return {label: this.props.intl.formatMessage({id: kv.value.name}),value: kv.key}})
}
   
  getFilterInputs = () => {

    const {CompanyStatusOptions} = this.state ;

    const filterInputs = {
      form_type: "regular",
      submit_label: this.props.intl.formatMessage({ id: "general.search" }),
      formProps: {
        layout: "horizontal",
      },
      sections: [
        {
          key: "find_status",
          title: this.props.intl.formatMessage({ id: "general.action.find_status" }),
          groups: [
            {
              name: "find_status",
              wrapperCol: { ...getSpan(24) },
              groupWrapper: {
                type: "box",
              },
              items: [
                {
                  name: "company_status",
                  type: "selectField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({ id: "general.account_status" }),
                    labelCol: LocationFilterFormItemlabelCol,
                    wrapperCol: LocationFilterFormItemWrapperCol,
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({ id: "general.account_status" }),
                    options: CompanyStatusOptions,
                    // disabled: statusFilterDisabled,
                  },
                  wrapperCol: LocationFilterWrapperCol
                },
                {
                  name: "company_name",
                  type: "textField",
                  formItemProps: {
                    label: this.props.intl.formatMessage({ id: "general.company_name" }),
                    labelCol: LocationRadiusFilterFormItemLabelCol,
                    wrapperCol: LocationRadiusFilterFormItemWrapperCol,
                  },
                  fieldProps: {
                    placeholder: this.props.intl.formatMessage({ id: "general.company_name" }),
                  },
                  wrapperCol: LocationRadiusFilterWrapperCol
                },
              ]
            }
          ]
        }
      ]
    }
    return filterInputs
  }  

  setFilterConditions = (form_values={}) => {
    this.setState(setCompanyFilter(form_values));
  }
  

  setTabsConditions = (view) => {
    if(view === 'null'){
      return ;
    }
    this.setState(setTabsFilter(view))
}

  getColumns() {
    return [
      {
        title: this.props.intl.formatMessage({id: "general.name"}),
        rowKey: 'name',
        sorter: this.sortName,
        sortDirections: ['ascend', 'descend'],
        width: '15%',
        render: (text, account) => <span>{(account.profile || {}) .name}</span>
      },
      {
        title: this.props.intl.formatMessage({id: "general.status"}),
        dataIndex: '',
        rowKey: 'status',
        width: '15%',
        render: (text, account) => <div>{DisplayTag(companies_account_status(account.account_status))}</div>,
      }
    ]
  }

  getItemActions() {
    return [
      {label: "general.details", type:"viewItem", itemTabKey: "details"},      
    ]
  }
  
  static propTypes = {
    companyId: PropTypes.string,
  }

  render() {
    const {columns, itemActions, viewType, queryFilterConditions, resultsFilterConditions } = this.state ;
    const filterInputs = this.getFilterInputs()
   
    if((columns || []).length > 0 )
    {
      
      return (
         <div>
           <FilterBox
              title={this.props.intl.formatMessage({id: 'general.action.find_status'})}
              formInputs={filterInputs}
              onSubmit={this.setFilterConditions}
              />
            {/* DataView is the actual table being displayed */}
            <DataView itemType={"carrier_account"}
                        queryFilterConditions={queryFilterConditions}
                        resultsFilterConditions={resultsFilterConditions}
                        columns={columns}
                        itemActions={itemActions}
                        viewType={viewType}
                        layouts={[{key: 'table', sections:[{type: 'table', span: 24}]}]}
              />
         </div>
      );

    } else {
      return "" ;
    }

  }
}

CarrierAccounts.propTypes = {
  intl: intlShape.isRequired
}


const mapStateToProps = state => {
  return {
  }
}

export default compose(
  connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(CarrierAccounts))
