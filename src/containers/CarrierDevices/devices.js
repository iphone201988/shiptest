import React, {Component} from "react";
import {PropTypes} from "prop-types";
import {compose} from "redux";
import {injectIntl, intlShape}  from "react-intl";
import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
// import {DataViewBaseComponent} from "../base/data_view_base_component";
import {
  DeviceNameFilterFormItemlabelCol, 
  DeviceNameFilterFormItemWrapperCol, 
  DeviceNameFilterWrapperCol, 
  StatusFilterFormItemLabelCol, 
  StatusFilterFormItemWrapperCol,
  StatusFilterWrapperCol,
} from "helpers/containers/properties/device";
import {device_status, DEVICE_STATUS } from "constants/options/carrier/devices";
import {DataConfig} from "helpers/components/data_helpers/data_components";
import {DataElements} from "components/TrackingData/TrackingDataComponents";
import LayoutWrapper from "components/utility/layoutWrapper";
import FilterBox from "components/base/filter_box";
import DataView from "../base/data_view";
import {DisplayTag} from "components/UI/buttons";
import {getSpan} from "constants/layout/grids";
import {objectToKeyValList} from 'helpers/data/mapper'
import {setDeviceFilter} from 'helpers/containers/states/filters/device_filter'
import {INTEGRATION_PROVIDERS} from "model/manager/integration/integrations_map";


const StatusKeyVal = objectToKeyValList(DEVICE_STATUS)

const dataConfig = {
  "temperature": new DataConfig({unit: "unit.celcius", decimals: 2, label: "general.temperature"}),
  "humidity": new DataConfig({unit: "symbol.percent", decimals: 2, label: "general.humidity"}),
  "pressure": new DataConfig({unit: "unit.millibar", decimals: 2, label: "general.pressure"}),
}

const providerOptions = objectToKeyValList(INTEGRATION_PROVIDERS);

class Devices extends Component {

  defaultViewType = "table"
  filterBoxTitle = "device.find_devices"
  dataViewLayouts = [{key: 'table', sections:[{type: 'table', span: 24}]}]

  static propTypes = {
    companyId: PropTypes.string,
  }

  INITIAL_STATE = {
    StatusOptions: [],
  }

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
    this.state.columns =  this.getColumns()
    this.state.itemActions = this.getItemActions()
  }

  componentDidMount() {
    if (this.initFilterConditions() || this.props.view){
      this.setFilterConditions()
      this.setState({ready: true})
    }
    this.setOptions()
  }

  componentDidUpdate(prevProps)  {
    if (this.updateFilterConditions(prevProps) || this.props.view !== prevProps.view){
      this.setFilterConditions()
    }
  }

  initFilterConditions() {
    return this.props.companyId !== undefined
  }

  updateFilterConditions = (prevProps) => {
    return prevProps.companyId !== this.props.companyId
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
                                name: "device_name",
                                type: "textField",
                                formItemProps:{
                                    label : this.props.intl.formatMessage({id:"general.name"}),
                                    labelCol: DeviceNameFilterFormItemlabelCol,
                                    wrapperCol: DeviceNameFilterFormItemWrapperCol,
                                },
                                fieldProps:{
                                    placeholder: this.props.intl.formatMessage({id:"device.name"}),
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
                          {
                            name: "filter_provider",
                            type: "selectField",
                            formItemProps:{
                                label : this.props.intl.formatMessage({id:"general.device.provider"}),
                                labelCol: StatusFilterFormItemLabelCol,
                                wrapperCol: StatusFilterFormItemWrapperCol
                            },
                            fieldProps:{
                                placeholder: this.props.intl.formatMessage({id:"general.device.provider"}),
                                options: this.KeyValListToOptions(providerOptions),
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

setFilterConditions = (formValues = {}) => {
  this.setState(setDeviceFilter(formValues, this.props.companyId, this.props.view))
}


  getColumns = () => {
    return [
      {
        title: this.props.intl.formatMessage({id: "general.device"}),
        dataIndex: '',
        rowKey: 'name',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => a.profile.name - b.profile.name,
        width: '10%',
        render: (text, device, index) => (<div>
          <div>{device.profile.name}</div>
          <div><span>{device.profile.os}</span><span>{device.profile.brand}</span> <span>{device.profile.model}</span></div>
        </div>)
      },
      {
        title: this.props.intl.formatMessage({id: "general.device_type"}),
        rowKey: 'device_type',
        width: '10%',
        render: (text, device) => <div><div>{device.device_type}</div></div>,
      },
      {
        title: this.props.intl.formatMessage({id: "general.device.provider"}),
        rowKey: 'device.provider',
        width: '10%',
        render: (text, device) => <div><div>{device.profile.provider.provider}</div></div>,
      },
      {
        title: this.props.intl.formatMessage({id: "general.status"}),
        rowKey: 'status',
        width: '10%',
        render: (text, device) => <div>
          {DisplayTag(device_status(device.status))}
          </div>
      },
      {
        title: this.props.intl.formatMessage({id: "general.tracking_data"}),
        rowKey: 'track_data',
        width: '10%',
        render: (text, device) => <div>
          Track Data
          </div>,
      },
    ]
  }

  getItemActions = () => {
    return [
      {label: "general.details", type:"viewItem", itemTabKey: "details"},
      {label: "general.shipment_transport_resources", type:"viewItem", itemTabKey: "resources"},
      {label: "general.track_device", type:"viewItem", itemTabKey: "track_device"},
    ]
  }

  render() {


    const {viewType, columns, queryFilterConditions, resultsFilterConditions, itemActions} = this.state
    const filterInputs = this.getFilterInputs()

    return    <LayoutWrapper>
      <FilterBox
          title={this.props.intl.formatMessage({id: 'device.find_devices'})}
          formInputs={filterInputs}
          onSubmit={this.setFilterConditions}
      />
      {
      this.props.view? 
      (<DataView itemType={'device'}
                queryFilterConditions={queryFilterConditions}
                resultsFilterConditions={resultsFilterConditions}
                columns={columns}
                itemActions={itemActions}
                viewType={viewType}
                layouts={[{key: 'table', sections:[{type: 'table', span: 24}]}]}
      />) : ("")
    }
      
    </LayoutWrapper>
  }

}

Devices.propTypes = {
  intl: intlShape.isRequired
}

const mapStateToProps = state => {
  return {
    companyId: state.FB.company.companyId,
   
  }
}

export default compose(
    connect(mapStateToProps, {}),
    firestoreConnect()
)(injectIntl(Devices))