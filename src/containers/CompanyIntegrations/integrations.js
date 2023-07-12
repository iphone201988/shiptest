import React, {PureComponent}  from "react";
import {injectIntl, intlShape}  from "react-intl";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import {PropTypes} from "prop-types";
import {DisplayTag} from "components/UI/buttons";
import FilterBox from "components/base/filter_box";
import DataView from "../base/data_view";
import {
    getIntegrationCategory,
    getIntegrationProvider,
    integration_status,
    INTEGRATION_STATUS
} from "model/manager/integration/integrations_map";
import {
    DeviceNameFilterFormItemlabelCol, 
    DeviceNameFilterFormItemWrapperCol, 
    DeviceNameFilterWrapperCol, 
    StatusFilterFormItemLabelCol, 
    StatusFilterFormItemWrapperCol,
    StatusFilterWrapperCol,
  } from "helpers/containers/properties/device";
import {getSpan} from "constants/layout/grids";
import {objectToKeyValList} from 'helpers/data/mapper'
import {setIntegrationFilter} from 'helpers/containers/states/filters/integration_filter'

const StatusKeyVal = objectToKeyValList(INTEGRATION_STATUS)

class Integrations extends PureComponent {

    defaultViewType = "table"
    INITIAL_STATE = {
        Items: [],
        queryFilterConditions: [],
        domain: "",
        columns: [],
        itemActions: [],
        viewType: this.defaultViewType,
        loading: true,
        StatusOptions: [],
        view: undefined,
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
        this.setOptions()

        if (this.props.itemTabKey) {
            this.setState({ view: this.props.itemTabKey });
          }
    }

    componentDidUpdate(prevProps)  {
        if (prevProps.companyId !== this.props.companyId || prevProps.view !== this.props.view){
            this.setFilterConditions()
        }
    }

    setOptions = () => {

        this.setState({
            StatusOptions: this.KeyValListToOptions(StatusKeyVal),
        })
      }
    
    KeyValListToOptions = (KeyValList) => {
    return KeyValList.map(kv => {return {label: this.props.intl.formatMessage({id: kv.value.name}),value: kv.key}})
    }

    getFilterInputs = () =>{
        const { StatusOptions } =  this.state
    
        const filterInputs = {
            form_type: "regular",
            submit_label: this.props.intl.formatMessage({id:"general.search"}),
            formProps:{
                layout: "horizontal",
            },
    
            sections: [
                {
                key: "find_devices",
                title: this.props.intl.formatMessage({id:"device.find_devices"}),
                groups: [
                    {
                    name: "find_devices",
                    wrapperCol: {...getSpan(24)},
                    groupWrapper:{
                        type: "box",
                    },
                    items: [
                                {
                                    name: "provider",
                                    type: "textField",
                                    formItemProps:{
                                        label : this.props.intl.formatMessage({id:"general.provider"}),
                                        labelCol: DeviceNameFilterFormItemlabelCol,
                                        wrapperCol: DeviceNameFilterFormItemWrapperCol,
                                    },
                                    fieldProps:{
                                        placeholder: this.props.intl.formatMessage({id:"general.provider"}),
                                    },
                                    wrapperCol: DeviceNameFilterWrapperCol
                                },
                                {
                                  name: "filter_status",
                                  type: "selectField",
                                  formItemProps:{
                                      label : this.props.intl.formatMessage({id:"general.status"}),
                                      labelCol: StatusFilterFormItemLabelCol,
                                      wrapperCol: StatusFilterFormItemWrapperCol
                                  },
                                  fieldProps:{
                                      placeholder: this.props.intl.formatMessage({id:"general.status"}),
                                      options: StatusOptions,
                                  },
                                  wrapperCol: StatusFilterWrapperCol
                              },
                            ]
                        }
                    ]
                }
            ]
        }
        return filterInputs
    }

    setFilterConditions = (formValues={}) => {
        this.setState(setIntegrationFilter(formValues, this.props.companyId))
    }
    

    sortProvider = (a, b) => {
        return this.sortString(a.provider, b.provider)
    }

    sortType = (a, b) => {
        return this.sortString(a.type, b.type)
    }

    getColumns = () => {
        return [
            {
                title: this.props.intl.formatMessage({id: "general.provider"}),
                rowKey: 'provider',
                sorter: this.sortProvider,
                sortDirections: ['ascend', 'descend'],
                width: '15%',
                render: (text, integration) => <span>{this.props.intl.formatMessage({id: getIntegrationProvider(integration.provider).name})}</span>
            },
            {
                title: this.props.intl.formatMessage({id: "general.type"}),
                rowKey: 'type',
                sorter: this.sortType,
                sortDirections: ['ascend', 'descend'],
                width: '15%',
                render: (text, integration) => <span>{this.props.intl.formatMessage({id: getIntegrationCategory(integration.category).name})}</span>
            },
            {
                title: this.props.intl.formatMessage({id: "general.status"}),
                dataIndex: '',
                rowKey: 'status',
                width: '15%',
                render: (text, integration) => <div>{DisplayTag(integration_status(integration.status))}</div>,
            }
        ]
    }

    getItemActions = () => {
        return [
            {label: "general.details", type:"viewItem", itemTabKey: "details"},
            {label: "integration.sync", type:"viewItem", itemTabKey: "sync_entities" }
        ]
    }


    render(){


        const {viewType, columns, queryFilterConditions, resultsFilterConditions, itemActions, domain} = this.state

        const itemType = domain === "carrier" ? "carrier_integrations" : "shipper_integrations"

        const filterInputs = this.getFilterInputs()

        return    <div>
            <FilterBox
                title={this.props.intl.formatMessage({id: 'general.actions.find_integrations'})}
                formInputs={filterInputs}
                onSubmit={this.setFilterConditions}
            />
            <DataView itemType={itemType}
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

Integrations.propTypes = {
    intl: intlShape.isRequired
}


const mapStateToProps = state => {
    return {
        companyId: state.FB.company.companyId,
    }
}

export default compose(
    connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(Integrations))
