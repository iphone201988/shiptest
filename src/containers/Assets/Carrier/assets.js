import React, {Component}  from "react";
import {injectIntl, intlShape}  from "react-intl";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import { Popconfirm } from 'antd';

import {PropTypes} from "prop-types";
import Asset from "model/asset/asset";
import FilterBox from "components/base/filter_box";
import {
  ASSET_STATUS,
  ASSET_TYPE_TRAILER,
  ASSET_TYPE_VEHICLE,
  asset_status, 
  validNextAssetStatus,
  asset_active_status
} from "constants/options/carrier/assets";
import Notification from "components/notification";


import {
  AssetFilterFormItemLabelCol, 
  AssetFilterFormItemWrapperCol,
  AssetFilterWrapperCol,
} from "../assets_properties";

import Select from "components/uielements/select";
import {TRUCK_CLASSES} from "constants/options/vehicles";
import {TRAILER_TYPES} from "constants/options/shipping";
import {updateAssetStatus, updateAssetActive} from "helpers/firebase/firebase_functions/assets";
import DataView from "../../base/data_view";
import {DisplayTag} from "components/UI/buttons";
import {getSpan} from "constants/layout/grids";
import {objectToKeyValList} from 'helpers/data/mapper'
import {setAssetFilter} from 'helpers/containers/states/filters/asset_filter'
import {FireQuery} from "helpers/firebase/firestore/firestore_collection";


const AssetStatusKeyVal = objectToKeyValList(ASSET_STATUS)
const TruckClassKeyVal = objectToKeyValList(TRUCK_CLASSES)
const TrailerTypesKeyVal = objectToKeyValList(TRAILER_TYPES)


const ItemTypeMap = {'vehicle': "carrier_vehicle", 'trailer': "carrier_trailer"}

class Assets extends Component {

  static propTypes = {
    firebase: PropTypes.object,
    companyId: PropTypes.string,
    company: PropTypes.object,
    assets: PropTypes.arrayOf(PropTypes.object),
  }

  DEFAULT_ASSET_TYPE = "vehicle"

  INITIAL_STATE = {
    columns: [],
    queryFilterConditions: [],
    resultsFilterConditions: [],
    clientFilterConditions: [],
    viewType: "table",
    itemType: "",
    assetAssignVisible: false,
    AssetDetailsVisible: false,
    AssetModifyVisible: false,
    AssetStatusUpdateVisible: false,
    AssetStatusUpdateLoading: false,
    asset: undefined,
    AssetToModify: undefined,
    assetStatus: undefined,
    assetActive: true, 
    itemActions: [],
    assetLocation: undefined,
    assetLocationRadius: 100,
    AssetStatusOptions: [],
    TruckClassesOptions: [],
    TrailerTypesOptions: [],
  }

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
  }

  componentDidMount() {
    this.componentStateUpdate()
    this.setOptions();
  }

  componentDidUpdate(prevProps){
    if (prevProps !== this.props ){
      this.componentStateUpdate()
    }
  }

  KeyValListToOptions = (KeyValList) => {
    return KeyValList.map(kv => {return {label: this.props.intl.formatMessage({id: kv.value.name}),value: kv.key}})
  }

  setOptions = () => {
    this.setState({
        AssetStatusOptions: this.KeyValListToOptions(AssetStatusKeyVal),
        TruckClassesOptions: this.KeyValListToOptions(TruckClassKeyVal),
        TrailerTypesOptions: this.KeyValListToOptions(TrailerTypesKeyVal),
    })
    this.updateAssetActions()
  }

  componentStateUpdate = () => {
    this.setFilterConditions()
    this.updateColumns()
    this.updateAssetActions()
    this.updateItemType()
  }

  updateColumns = () => {
    this.setState({columns: this.getColumns()})
  }

  updateAssetActions = () => {
    this.setState({itemActions: this.getAssetActions()})
  }

  updateItemType = () => {
    const {assetType} = this.props
    this.setState({itemType:  ItemTypeMap[assetType] || ""})
  }

  FilterAssets = (assets) => {
    return assets.filter(asset => asset.isValid())
  }

  showAssetDetails = (asset) => {
    if (asset instanceof Asset){
      this.setState({AssetDetailsVisible: true, asset: asset})
    }
  }

  showAssetModify = (asset) => {
    if (asset instanceof Asset){
      this.setState({AssetModifyVisible: true, AssetToModify: asset})
    }
  }

  onChangeAssetStatus = (asset, status) => {
    this.setState({assetStatus: status, asset: asset})
  }

  updateAssetStatus = () => {
    const {assetStatus, asset} = this.state
    if (asset && asset.id && assetStatus){
      this.onUpdateAssetStatusSubmitting(true)

      updateAssetStatus({assetId: asset.id, status: assetStatus}).then(res => {
          Notification('success',  this.props.intl.formatMessage({id: "carrier.asset.updated.sucess"}))
          this.onUpdateAssetStatusSubmitting(false)
          this.onUpdateAssetStatusOpen(false)
      }).catch(e => {
        Notification('error',  this.props.intl.formatMessage({id: "feedback.alert.errorTitle"}))
        this.onUpdateAssetStatusSubmitting(false)
        this.onUpdateAssetStatusOpen(false)
      })

    }
  }

updateAssetActive = (item) => {
    console.log(item)
    if (item) {
      updateAssetActive({assetId: item.id, active: item.active}).then(res => {
        Notification('success',  this.props.intl.formatMessage({id: "carrier.asset.updated.sucess"}))
    }).catch(e => {
      Notification('error',  this.props.intl.formatMessage({id: "feedback.alert.errorTitle"}))
      console.log(e)
    })
    }
  }

  onUpdateAssetStatusOpen = (visible) => {
    this.setState({ AssetStatusUpdateVisible: visible})
  }

  onUpdateAssetStatusSubmitting = (submitting) => {
    this.setState({ AssetStatusUpdateLoading: submitting})
  }


  changeAssetStatusContent = (asset) => {
    return (
      <div>
        <div>{asset.profile.name}</div>
        <div><span>{asset.profile.make}</span> <span>{asset.profile.model}</span></div>
        <Select
          showSearch
          onChange={(value) => this.onChangeAssetStatus(asset, value)}
          placeholder={this.props.intl.formatMessage({id: "carrier.vehicle.make.placeholder"})}
          style={{ width: "100%" }}
          defaultValue={asset.status}
        >
          {Object.keys(ASSET_STATUS).map(status => {
            return <option value={status} disabled={!validNextAssetStatus(asset.status, status)}>
              {this.props.intl.formatMessage({id: `${ASSET_STATUS[status].name}` })}</option>
          })}
        </Select>

      </div>
    )
  }

  getAssetActions = () => {
    return [
      {label: "general.details", type:"viewItem", itemTabKey: "details"},
      {label: "general.documents", type:"viewItem", itemTabKey: "documents"},
      {label: "general.track_asset", type:"viewItem", itemTabKey: "tracking"},
      {label: this.props.active ? "general.set_inactive" : "general.set_active", confirm_text:this.props.active ? "general.ask_inactive" : "general.ask_active",type: "confirm", callback: this.updateAssetActive }
    ]
  }

  getColumns = () => {
    const {assetType} = this.props

    if (assetType === ASSET_TYPE_VEHICLE){
      return this.getVehiclesColumns()
    }else if (assetType === ASSET_TYPE_TRAILER){
      return this.getTrailerColumns()
    }else{
      return []
    }

  }

  getVehiclesColumns = () => {
    return [
      {
        title: this.props.intl.formatMessage({id: "general.asset"}),
        dataIndex: '',
        rowKey: 'name',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => a.profile.name - b.profile.name,
        width: '10%',
        render: (text, asset, index) => (<div>
          <div>{asset.profile.name}</div>
          <div><span>{asset.profile.make}</span> <span>{asset.profile.model}</span></div>
        </div>)
      },
      {
        title: this.props.intl.formatMessage({id: "carrier.asset.vin"}),
        rowKey: 'vin',
        width: '10%',
        render: (text, asset) => <span>{asset.profile.vin}</span>,
      },
      {
        title: this.props.intl.formatMessage({id: "carrier.vehicle.license_plate"}),
        rowKey: 'license_plate_number',
        width: '10%',
        render: (text, asset) => <div><div>{asset.profile.license_plate_number}</div></div>,
      },
      {
        title: this.props.intl.formatMessage({id: "general.status"}),
        rowKey: 'status',
        width: '10%',
        render: (text, asset) => <div>{DisplayTag(asset_active_status(asset.active))}</div>,
      },
    ]
  }

  getTrailerColumns = () => {
    return [
      {
        title: this.props.intl.formatMessage({id: "general.asset"}),
        dataIndex: '',
        rowKey: 'name',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => a.profile.name - b.profile.name,
        width: '10%',
        render: (text, asset, index) => (<div>
          <div>{asset.profile.name}</div>
          <div><span>{asset.profile.make}</span> <span>{asset.profile.model}</span></div>
        </div>)
      },
      {
        title: this.props.intl.formatMessage({id: "carrier.asset.vin"}),
        rowKey: 'vin',
        width: '10%',
        render: (text, asset) => <span>{asset.profile.vin}</span>,
      },
      {
        title: this.props.intl.formatMessage({id: "carrier.vehicle.license_plate"}),
        rowKey: 'license_plate_number',
        width: '10%',
        render: (text, asset) => <div><div>{asset.profile.license_plate_number}</div></div>,
      },
      {
        title: this.props.intl.formatMessage({id: "general.status"}),
        rowKey: 'status',
        width: '10%',
        render: (text, asset) => <div>{DisplayTag(asset_active_status(asset.active))}</div>,
      }
    ]
  }

  getFilterInputs = () =>{
    const { AssetStatusOptions, TruckClassesOptions, TrailerTypesOptions } =  this.state
    const { assetType } = this.props

    const truckClasses = {
      name: "truck_classes",
      type: "selectField",
      formItemProps:{
          label : this.props.intl.formatMessage({id:"carrier.vehicle.class"}),
          labelCol: AssetFilterFormItemLabelCol,
          wrapperCol: AssetFilterFormItemWrapperCol
      },
      fieldProps:{
          options: TruckClassesOptions,
          placeholder: this.props.intl.formatMessage({id:"carrier.vehicle.class"}),
      },
      wrapperCol: AssetFilterWrapperCol
    }

    const trailerTypes = {
      name: "trailer_types",
      type: "selectField",
      formItemProps:{
          label : this.props.intl.formatMessage({id:"trailer.type"}),
          labelCol: AssetFilterFormItemLabelCol,
          wrapperCol: AssetFilterFormItemWrapperCol
      },
      fieldProps:{
          options: TrailerTypesOptions,
          placeholder: this.props.intl.formatMessage({id:"trailer.type.select"}),
      },
      wrapperCol: AssetFilterWrapperCol
    }

    let TruckOrTrailerFilter
    if (assetType === "vehicle") {
      TruckOrTrailerFilter = truckClasses
    }
    if (assetType === "trailer") {
      TruckOrTrailerFilter = trailerTypes
    }
    const filterInputs = {
        form_type: "regular",
        submit_label: this.props.intl.formatMessage({id:"general.search"}),
        formProps:{
            layout: "horizontal",
        },

        sections: [
            {
            key: "find_quotes",
            title: this.props.intl.formatMessage({id:"general.find_quote"}),
            groups: [
                {
                name: "find_quotes",
                wrapperCol: {...getSpan(24)},
                groupWrapper:{
                    type: "box",
                },
                items: [
                            {
                              name: "asset_name",
                              type: "textField",
                              formItemProps:{
                                  label : this.props.intl.formatMessage({id:"general.name"}),
                                  labelCol: AssetFilterFormItemLabelCol,
                                  wrapperCol: AssetFilterFormItemWrapperCol
                              },
                              fieldProps:{
                                  placeholder: this.props.intl.formatMessage({id:"general.asset.name"}),
                              },
                              wrapperCol: AssetFilterWrapperCol
                            },
                            {
                              name: "asset_VIN",
                              type: "textField",
                              formItemProps:{
                                  label : this.props.intl.formatMessage({id:"carrier.trailer.vin"}),
                                  labelCol: AssetFilterFormItemLabelCol,
                                  wrapperCol: AssetFilterFormItemWrapperCol
                              },
                              fieldProps:{
                                  placeholder: this.props.intl.formatMessage({id:"carrier.trailer.vin"}),
                              },
                              wrapperCol: AssetFilterWrapperCol
                            },
                            TruckOrTrailerFilter,
                            {
                                name: "filter_status",
                                type: "selectField",
                                formItemProps:{
                                    label : this.props.intl.formatMessage({id:"general.status"}),
                                    labelCol: AssetFilterFormItemLabelCol,
                                    wrapperCol: AssetFilterFormItemWrapperCol
                                },
                                fieldProps:{
                                    options: AssetStatusOptions,
                                    placeholder: this.props.intl.formatMessage({id:"general.status"}),
                                },
                                wrapperCol: AssetFilterWrapperCol
                            },
                        ]
                    }
                ]
            }
        ]
    }
    return filterInputs
}

  setFilterConditions = (formValues = {}) =>{

    const { assetType } = this.props
    formValues.active = this.props.active
    this.setState(setAssetFilter(formValues, assetType, this.props.companyId))
  }

  onAssetDetailsClose = () => {
    this.setState({AssetDetailsVisible: false})
  }

  onAssetModifyClose = () => {
    this.setState({AssetModifyVisible: false})
  }


  render() {
    const {itemType, itemActions, columns, queryFilterConditions, resultsFilterConditions, viewType} = this.state

    const filterInputs = this.getFilterInputs()
    if ((columns || []).length > 0){
      return (

          <div>
            <FilterBox
                title={this.props.intl.formatMessage({id: 'general.actions.find_assets'})}
                formInputs={filterInputs}
                onSubmit={this.setFilterConditions}
            />
        <DataView itemType={itemType}
                  dataItems={this.props.assets}
                  queryFilterConditions={queryFilterConditions}
                  resultsFilterConditions={resultsFilterConditions}
                  columns={columns}
                  itemActions={itemActions}
                  viewType={viewType}
                  layouts={[{key: 'table', sections:[{type: 'table', span: 24}]}]}
                  
                />
              </div>
            )
      } else {
        return ""
    }
  }
}

Assets.propTypes = {
  intl: intlShape.isRequired
}

const mapStateToProps = state => {
  return {
    firebase: state.FB.firebase,
    comp: state.FB.company,
    company: state.FB.company.company,
    companyId: state.FB.company.companyId,
  }
}

export default compose(
    connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(Assets))

