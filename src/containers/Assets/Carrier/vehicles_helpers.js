import {DisplayTag} from "components/UI/buttons";
import {asset_active_status} from "constants/options/carrier/assets";
import React from "react";
import {AssetFilterFormItemLabelCol, AssetFilterFormItemWrapperCol, AssetFilterWrapperCol} from "../assets_properties";
import {getSpan} from "constants/layout/grids";


class VehicleHelper{

  static getColumns = () => {
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

  static   getFilterInputs = () =>{
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


}