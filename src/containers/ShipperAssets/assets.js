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
  validNextAssetStatus
} from "constants/options/carrier/assets";
import Notification from "components/notification";


import {
  AssetFilterFormItemLabelCol, 
  AssetFilterFormItemWrapperCol,
  AssetFilterWrapperCol,
} from "../Assets/assets_properties";

import Select from "components/uielements/select";
import {TRUCK_CLASSES} from "constants/options/vehicles";
import {TRAILER_TYPES} from "constants/options/shipping";
import Modal from "components/feedback/modal";

import {updateAssetStatus} from "helpers/firebase/firebase_functions/assets";
import DataView from "../base/data_view";
import {DisplayTag} from "components/UI/buttons";
import {getSpan} from "constants/layout/grids";
import {objectToKeyValList} from 'helpers/data/mapper'
import {setAssetFilter} from 'helpers/containers/states/filters/asset_filter'


const AssetStatusKeyVal = objectToKeyValList(ASSET_STATUS)
const TruckClassKeyVal = objectToKeyValList(TRUCK_CLASSES)
const TrailerTypesKeyVal = objectToKeyValList(TRAILER_TYPES)


const ItemTypeMap = {'vehicle': "shipper_vehicle", 'trailer': "shipper_trailer"}

class Assets extends Component {

  static propTypes = {
    firebase: PropTypes.object,
    companyId: PropTypes.string,
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
    assetType: ASSET_TYPE_VEHICLE,
    assetAssignVisible: false,
    AssetDetailsVisible: false,
    AssetModifyVisible: false,
    AssetStatusUpdateVisible: false,
    AssetStatusUpdateLoading: false,
    asset: undefined,
    AssetToModify: undefined,
    assetStatus: undefined,
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
    this.state.assetType =  props.assetType || this.state.assetType
    // this.setState({columns: this.getTrailerColumns()})
  }

  componentDidMount() {

    if (this.props.assetType ){
      this.setState({assetType: this.props.assetType}, this.onAssetTypeUpdate)
    }
    this.setOptions()
  }

  componentDidUpdate(prevProps){

    if (prevProps.assetType !== this.props.assetType ){
      this.setState({assetType: this.props.assetType}, this.onAssetTypeUpdate)
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
  }

  onAssetTypeUpdate = () => {
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
 //!! this is where we are updating item type's state
  updateItemType = () => {
    const {assetType} = this.state
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

  trackAsset = (asset) => {

  }

  deleteAsset = (asset) => {
    if (asset instanceof Asset){
      this.Loading(true)
      // ShipperService.deleteShipperAsset(asset.id, this.props.firebase.auth()).then((res)=> {
      //   this.Loading(false)
      //   Notification('success', this.props.intl.formatMessage({id: "shipper.asset.delete_success"}))
      // }).catch(e=>{
      //   Notification('error', this.props.intl.formatMessage({id: "shipper.asset.delete_fail"}))
      //   this.Loading(false)
      // })
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
          Notification('success',  this.props.intl.formatMessage({id: "shipper.asset.updated.sucess"}))
          this.onUpdateAssetStatusSubmitting(false)
          this.onUpdateAssetStatusOpen(false)
      }).catch(e => {
        Notification('error',  this.props.intl.formatMessage({id: "feedback.alert.errorTitle"}))
        this.onUpdateAssetStatusSubmitting(false)
        this.onUpdateAssetStatusOpen(false)
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
          placeholder={this.props.intl.formatMessage({id: "shipper.vehicle.make.placeholder"})}
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
      {label: "general.details", type:"viewItem"},
    ]
  }

  // TODO: delete
  assetActions = (asset) => {
    const {AssetStatusUpdateVisible} = this.state
    return (
      <div>
        {/* eslint-disable-next-line */}
        <li><a onClick={()=> {this.showAssetDetails(asset)}}>
          {this.props.intl.formatMessage({id: "general.details"})}</a>
        </li>
        <li>
          {/* eslint-disable-next-line */}
          <a onClick={()=> {this.showAssetModify(asset)}}>
            {this.props.intl.formatMessage({id: "general.update"})}</a>
        </li>
				<li>
          {/* eslint-disable-next-line */}
          <a onClick={() => this.onUpdateAssetStatusOpen(true)}>{this.props.intl.formatMessage({id: "general.action.change_status"})}</a>
          <Modal
            visible={AssetStatusUpdateVisible}
            onClose={()=>{this.onUpdateAssetStatusOpen(false)}}
            title="Change Status"
            okText="OK"
            confirmLoading={this.state.AssetStatusUpdateLoading}
            onOk={this.updateAssetStatus}
            onCancel={()=>{this.onUpdateAssetStatusOpen(false)}}
          >
            {this.changeAssetStatusContent(asset)}
          </Modal>
				</li>
				<li>
          {/* eslint-disable-next-line */}
					<a onClick={()=> {this.trackAsset(asset)}}>
						{this.props.intl.formatMessage({id: "general.action.track_asset"})}</a>
				</li>
        <li>
          <li>
            <Popconfirm title={this.props.intl.formatMessage({id:"shipper.asset.delete_confirm"})}
                        onConfirm={() => {this.deleteAsset(asset)}} okText={this.props.intl.formatMessage({id:"general.answer.yes"})}
                        cancelText={this.props.intl.formatMessage({id:"general.answer.no"})}
            >
              <a href="/#">{this.props.intl.formatMessage({id: "general.delete"})}</a>
            </Popconfirm>
          </li>
        </li>

      </div>
    )
  }

  getColumns = () => {
    const {assetType} = this.state

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
        render: (text, asset) => <div>{DisplayTag(asset_status(asset.status))}</div>,
      },
    ]
  }

  getTrailerColumns = () => {
    return [
      // {
      //   title: 'Action',
      //   key: 'x',
      //   width: '5%',
      //   dataIndex: '',
      //   render: (text, asset, index) => (<span>
      //     <div>
      //       <div>
		// 					<Popover
      //           content={this.assetActions(asset)}  placement="bottom"
      //         ><Icon type="more" style={{ fontSize: '2.0vw', color: 'black' }} theme="outlined" /> </Popover>
      //       </div>
      //     </div>
      //   </span>)
      // },
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
        render: (text, asset) => <div>{DisplayTag(asset_status(asset.status))}</div>,
      }
    ]
  }

  getFilterInputs = () =>{
    const { assetType, AssetStatusOptions, TruckClassesOptions, TrailerTypesOptions } =  this.state

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

    const { assetType } = this.state
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
    companyId: state.FB.company.companyId,
  }
}

export default compose(
    connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(Assets))

