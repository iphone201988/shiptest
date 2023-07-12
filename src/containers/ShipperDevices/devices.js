import React from "react";
import {PropTypes} from "prop-types";
import {connect} from "react-redux";
import {compose} from "redux";
import {firestoreConnect} from "react-redux-firebase";
import {injectIntl, intlShape}  from "react-intl";

import {DataViewBaseComponent} from "../base/data_view_base_component";
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


const StatusKeyVal = objectToKeyValList(DEVICE_STATUS)

const dataConfig = {
  "temperature": new DataConfig({unit: "unit.celcius", decimals: 2, label: "general.temperature"}),
  "humidity": new DataConfig({unit: "symbol.percent", decimals: 2, label: "general.humidity"}),
  "pressure": new DataConfig({unit: "unit.millibar", decimals: 2, label: "general.pressure"}),
}

class Devices extends DataViewBaseComponent{

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
    this.state.columns =  this.getColumns()
    this.state.itemActions = this.getItemActions()
  }

  componentDidMount() {
    if (this.initFilterConditions()){
      this.setFilterConditions()
      this.setState({ready: true})
    }
    this.setOptions()
  }

  componentDidUpdate(prevProps)  {
    if (this.updateFilterConditions(prevProps)){
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
                        ]
                    }
                ]
            }
        ]
    }
    return filterInputs
}

setFilterConditions = (formValues = {}) => {
  this.setState(setDeviceFilter(formValues, this.props.companyId))
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
        title: this.props.intl.formatMessage({id: "general.status"}),
        rowKey: 'status',
        width: '10%',
        render: (text, device) => <div>{DisplayTag(device_status(device.status))}</div>
      },
      {
        title: this.props.intl.formatMessage({id: "general.tracking_data"}),
        rowKey: 'track_data',
        width: '10%',
        render: (text, device) => <div>{DataElements(device.track_data, dataConfig, {}, {}, this.props.intl)}</div>,
      },
    ]
  }

  getItemActions = () => {
    return [
      {label: "general.details", type:"viewItem"}
    ]
  }

  render() {
    const {viewType, columns, queryFilterConditions, resultsFilterConditions, itemActions, itemType} = this.state

    const filterInputs = this.getFilterInputs()

    return    <LayoutWrapper>
      <FilterBox
          title={this.props.intl.formatMessage({id: 'device.find_devices'})}
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