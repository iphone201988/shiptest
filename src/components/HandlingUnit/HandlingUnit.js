import React from "react";
import {Component} from "react";
import InputNumber from '../uielements/InputNumber';
import {Row, Col} from 'antd/es/grid/';

import {InputGroup} from "components/uielements/input";
import Card from "containers/Uielements/Card/card.style";
import {PropTypes} from "prop-types";
import HandleUnit from "model/shipment/handlingUnit"
import Icon from "antd/es/icon";
import Button from "../uielements/button";
import Select from "components/uielements/select";
import {DIMENSION_UNITS, WEIGHT_UNITS} from 'helpers/choices/math'
import IntlMessages from "components/utility/intlMessages";
import Checkbox from "../uielements/checkbox";

const _ = require('underscore')

export class HandlingUnit extends Component {

  constructor(props){
    const INITIAL_HANDLE_UNIT = {
      handlingUnits:{},
			LocationForms:{},
			PickupLocation:{},
			DropLocation: {},
      Initiated: false,
      default_weight_unit: 'lbs',
      default_dimension_unit: 'cm',
      default_packaging:'pallet'
    }

    super(props);
    this.state = { ...INITIAL_HANDLE_UNIT };
  }

  componentDidUpdate(prevProps) {
    if (! _.isEqual(this.props.handlingUnits, prevProps.handlingUnits)){
      this.setState({handlingUnits:  this.props.handlingUnits})
    }
		if (! _.isEqual(this.props.LocationForms, prevProps.LocationForms)){
			this.setState({LocationForms:  this.props.LocationForms})
		}
  }

	componentDidMount() {
		this.setState({handlingUnits: this.props.handlingUnits})
		this.setState({LocationForms:  this.props.LocationForms})

		if (Object.keys(this.props.handlingUnits).length < 1){
			this.addHandleUnit()
		}

	}

  onFieldChange = (handlingUnitKey, field, value) => {

    const {handlingUnits} = this.state
    handlingUnits[handlingUnitKey][field] = value
    this.setState({"handlingUnits": handlingUnits})
    if (typeof this.props.onChange != undefined){
      this.props.onChange(this.getHandlingUnits())
    }
  }

  getHandlingUnits = () => {
    return this.state.handlingUnits
  }

	addHandleUnit = () => {
		let {handlingUnits} = this.state
		const hu = new HandleUnit()
		handlingUnits[hu.id] = hu
		this.setState({handlingUnits: handlingUnits})
		if (typeof this.props.onChange != undefined){
			this.props.onChange(this.getHandlingUnits())
		}
	}

	removeHandleUnit = (handlingUnitKey) => {
		let {handlingUnits} = this.state
		if (Object.keys(handlingUnits).length >= 1){
			delete handlingUnits[handlingUnitKey]
		}
		this.setState({handlingUnits: handlingUnits})
		if (typeof this.props.onChange != undefined){
			this.props.onChange(this.getHandlingUnits())
		}
	}

  renderLocationSelect = (handlingUnitKey, type) => {

		const {LocationForms} = this.state
		let placeholder = ""
		let modelField = ""
		let defaultValue = LocationForms[handlingUnitKey] ? LocationForms[handlingUnitKey].id : undefined

		if (type === "Pickup"){
			placeholder = "Select Pickup Location"
			modelField = "PickupLocation"
		}
		else if (type === "Drop"){
			placeholder = "Select Drop Location"
			modelField = "DropLocation"
		}

		return (
			<Select
				onChange={(val) => {(this.onFieldChange(handlingUnitKey, modelField, val))}}
				style={{ width:"90%" }}
				placeholder={placeholder}
				defaultValue={defaultValue}
			>
				{Object.values(LocationForms).map((location) => {

					let label =  ""
					try{
						label = location.Address.label
					}catch (e) {
					}
					return <option value={location.id}> {label}</option>
				})}
			</Select>
		)
	}

  renderTypesSelect = (handlingUnitKey, types, modelField,
                       {translate=true, placeholder="", width=200, defaultValue=null}) => {

    const {handlingUnits} = this.state

    if (defaultValue && handlingUnitKey in handlingUnits){
      handlingUnits[handlingUnitKey][modelField] = defaultValue
    }

    return (
        <Select
            onChange={(val) => {(this.onFieldChange(handlingUnitKey, modelField, val))}}
            style={{ width: width }}
            placeholder={placeholder}
            defaultValue={defaultValue}
        >
          {types.map((e) => {
            let label = translate ? this.context.intl.formatMessage({id: e.value.name}) : e.value.name
            return <option value={e.key}> {label}</option>
          })}
        </Select>
    )

  }

  renderDimensionInputs = (handlingUnitKey) => {
    const {handlingUnits} = this.state
    let handlingUnit = handlingUnits[handlingUnitKey]
    // let DimensionUnits = Object.keys(DIMENSION_UNITS).map(key => {return {key: key, value: DIMENSION_UNITS[key]}})
    let DimensionUnitName = ''
    try {
      DimensionUnitName = this.context.intl.formatMessage({id: DIMENSION_UNITS[this.props.DimensionUnit].name})
    }catch(e){}
    let WeightUnitName = ''
    try {
      WeightUnitName = this.context.intl.formatMessage({id: WEIGHT_UNITS[this.props.WeightUnit].name})
    }catch(e){}

    return (
        <InputGroup >
          <Col span={5}>
            <div>
              <b>{this.context.intl.formatMessage({id: "general.length"})}</b>({DimensionUnitName})
            </div>
              <InputNumber
                  min={0}
                  value={handlingUnit.length}
                  onChange={(val) => {(this.onFieldChange(handlingUnitKey, "length", val))}}
                  placeholder={this.context.intl.formatMessage({id: "general.length"})}
              />
          </Col>
          <Col span={5}>
            <div>
              <b>{this.context.intl.formatMessage({id: "general.width"})}</b>({DimensionUnitName})
            </div>
            <InputNumber
                min={0}
                value={handlingUnit.width}
                onChange={(val) => {(this.onFieldChange(handlingUnitKey, "width", val))}}
                placeholder={this.context.intl.formatMessage({id: "general.width"})}
            />
          </Col>
          <Col span={5}>
            <div>
              <b>{this.context.intl.formatMessage({id: "general.height"})}</b>({DimensionUnitName})
            </div>
            <InputNumber
                min={0}
                value={handlingUnit.height}
                onChange={(val) => {(this.onFieldChange(handlingUnitKey, "height", val))}}
                placeholder={this.context.intl.formatMessage({id: "general.height"})}
            />
          </Col>
          <Col span={5}>
            <div><b>{this.context.intl.formatMessage({id: "general.weight"})}</b>({WeightUnitName})</div>
            <InputNumber
                min={0}
                value={handlingUnit.weight}
                onChange={(val) => {(this.onFieldChange(handlingUnitKey, "weight", val))}}
                placeholder={this.context.intl.formatMessage({id: "general.weight"})}
            />
          </Col>
          {/*{this.renderTypesSelect(handlingUnitKey, DimensionUnits, "dimension_unit",*/}
              {/*{placeholder:"Units", defaultValue: handlingUnit.dimension_unit})}*/}
        </InputGroup>
    )
  }

  onCheckChange = (handlingUnitKey, field, e) => {
    this.onFieldChange(handlingUnitKey, field, e.target.checked)
  }

  renderHandlingUnit = (handlingUnitKey) => {
    const {handlingUnits, default_packaging} = this.state
    let handlingUnit = handlingUnits[handlingUnitKey]
    let PackageTypes = this.props["PackageTypes"] || []
    // let WeightUnits = Object.keys(WEIGHT_UNITS).map(key => {return {key: key, value: WEIGHT_UNITS[key]}})

    return (
        <Card>
          <InputGroup>
              <InputNumber
                  min={1}
                  value={handlingUnit.quantity}
                  onChange={(val) => {(this.onFieldChange(handlingUnitKey, "quantity", val))}}
                  placeholder={this.context.intl.formatMessage({id: "general.quantity"})}
              />
              {this.renderTypesSelect(handlingUnitKey, PackageTypes, "packaging_type",
                  {placeholder:"Packaging", defaultValue:default_packaging})}
          </InputGroup>

          {this.renderDimensionInputs(handlingUnitKey)}

          <InputGroup>
            <Checkbox
                onChange={e => {
                  this.onFieldChange(handlingUnitKey, "stackable", e.target.checked)}}>
              <IntlMessages id="shipment.packaging.stackable" />
            </Checkbox>
            <Checkbox onChange={e => {this.onFieldChange(handlingUnitKey, "hazardous", e.target.checked)}}>
              <IntlMessages id="shipment.packaging.hazardous" />
            </Checkbox>
          </InputGroup>
					<Row>
						<Col span={12}>{this.renderLocationSelect(handlingUnitKey, "Pickup")}</Col>
						<Col span={12}>{this.renderLocationSelect(handlingUnitKey, "Drop")}</Col>
					</Row>



          <Button type="dashed" onClick={() => this.removeHandleUnit(handlingUnitKey)} style={{ width: '60%' }}>
            <Icon type="minus" /> Remove Handling Unit
          </Button>

        </Card>
    )
  }

  render(){

    const {handlingUnits} = this.state


    const renderedHandlingUnits =  Object.keys(handlingUnits).map(key => {
      return (this.renderHandlingUnit(key))
    })

    return (
        <Card title={"Handling Units"}>
        {renderedHandlingUnits}
        <div>
          <Button type="dashed" onClick={this.addHandleUnit} style={{ width: '60%' }}>
            <Icon type="plus" /> Add Handling Unit
          </Button>
         </div>
        </Card>

    )
  }
}

HandlingUnit.contextTypes = {
  intl: PropTypes.object.isRequired,
};

