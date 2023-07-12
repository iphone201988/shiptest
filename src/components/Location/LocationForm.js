import {Component} from "react";
import React from "react";
import {injectIntl, intlShape}  from "react-intl";
import {PropTypes} from "prop-types";
import IntlMessages from "components/utility/intlMessages";

import Select from "../uielements/select";
import DatePicker from '../uielements/datePicker';
import {objectToKeyValList} from "helpers/data/mapper";
import AddressInput from "../Location/address_input";

import {dateTimeFormat} from "constants/variables";
import Button from "antd/es/button";
import Icon from "antd/es/icon";
import {COMPANY_LOCATION_TYPES} from "constants/options/location";
import Card from "containers/Uielements/Card/card.style";
import Input from "../uielements/input";

const moment = require('moment-timezone');
export var nanoid = require('nanoid');

const _ = require('underscore')

class LocationFormObject{

	constructor(data={}){
		this.id = nanoid(10)
		this.Address = data.Address || ""
		this.AddressInfo =  data.AddressInfo || ""
		this.LocationType = data.LocationType || ""
		this.Pickups = data.Pickups || []
		this.Drops = data.Drops || []
		this.BeforeLocations = this.BeforeLocations || []
		this.EarliestDateTime = data.EarliestDateTime || ""
		this.LatestDateTime = data.LatestDateTime || ""
		this.is_start = data.is_start || false
		this.is_end = !data.is_start ? data.is_end || false : false
	}
}

const LocationTypesOptions = objectToKeyValList(COMPANY_LOCATION_TYPES)

class LocationForm extends Component {

	constructor(props){
		const INITIAL_VALUES = {
			LocationForms: {},
			Initiated: false
		}

		super(props);
		this.state = { ...INITIAL_VALUES };
	}

	UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
		if (! _.isEqual(this.props.LocationForms, nextProps.LocationForms)){
			this.setState({LocationForms:  nextProps.LocationForms})
		}
	}

	componentDidMount() {
		this.setState({LocationForms: this.props.LocationForms})

		if (Object.keys(this.props.LocationForms).length < 1){
			this.addCompanyLocationForm({is_start: true})
			this.addCompanyLocationForm({is_end: true})
		}
	}

	onFieldChange = (LocationFormKey, field, value) => {

		const {LocationForms} = this.state
		LocationForms[LocationFormKey][field] = value
		this.setState({"LocationForms": LocationForms})
		if (typeof this.props.onChange != undefined){
			this.props.onChange(this.state.LocationForms)
		}
	}

	addCompanyLocationForm = (data={}) => {

		let {LocationForms} = this.state
		const locationForm = new LocationFormObject(data)
		LocationForms[locationForm.id] = locationForm
		this.setState({LocationForms: LocationForms})
		if (typeof this.props.onChange != undefined){
			this.props.onChange(this.state.LocationForms)
		}
	}

	removeLocationForm = (LocationFormKey) => {
		let {LocationForms} = this.state
		if (Object.keys(LocationForms).length >= 1){
			delete LocationForms[LocationFormKey]
		}
		this.setState({LocationForms: LocationForms})
		if (typeof this.props.onChange != undefined){
			this.props.onChange(this.state.LocationForms)
		}
	}

	removeLocationForm = (LocationFormKey) => {

		let {LocationForms} = this.state
		if (Object.keys(LocationForms).length >= 1){
			delete LocationForms[LocationFormKey]
		}
		this.setState({LocationForms: LocationForms})
		if (typeof this.props.onChange != undefined){
			this.props.onChange(this.state.LocationForms)
		}
	}

	renderLocationTypesSelect = (LocationFormKey, Value) => {

		return (
			<Select
				onChange={(val) => {this.onFieldChange(LocationFormKey, "LocationType", val)}}
				style={{ width: 400 }}
				placeholder="Location type"
				value={Value}
			>
				{LocationTypesOptions.map((e) => {
					return <option value={e.key}> { this.props.intl.formatMessage({id: e.value.name})}</option>
				})}
			</Select>
		)
	}

	onAddressSelect = (value) => {
		this.setState({"PickupAddress": value})
	}

	renderLocationForm = (LocationFormKey) => {

		let {LocationForms} = this.state
		let LocationForm = LocationForms[LocationFormKey]
		const card_title = LocationForm.is_start ? this.props.intl.formatMessage({ id: "shipment.origin.title" }) :
			this.props.intl.formatMessage({ id: "shipment.destination.title" })

		return (

			<Card title={card_title}>
				<AddressInput onSelect={(value) => {
					this.onFieldChange(LocationFormKey, "Address", value)
				}} Value={LocationForm.Address}></AddressInput>
				<Input placeholder={"Additional Address Info"}
							 onChange={(event) => {this.onFieldChange(LocationFormKey, "AddressInfo", event.target.value)}}
							 value={LocationForm.AddressInfo} >
				</Input>
				{this.renderLocationTypesSelect(LocationFormKey, LocationForm.LocationType)}<br/>
				<DatePicker
					placeholder={this.props.intl.formatMessage({id: 'shipment.earliest_arrival_datetime.title'})}
					showTime={{defaultValue: moment('08:00:00', 'HH:mm:ss')}}
					format={dateTimeFormat}
					value={LocationForm.EarliestDateTime}
					onChange={(value) => {
						this.onFieldChange(LocationFormKey, "EarliestDateTime", value)
					}}
				/>
				<DatePicker
					placeholder={this.props.intl.formatMessage({id: 'shipment.latest_arrival_datetime.title'})}
					showTime={{defaultValue: moment('17:00:00', 'HH:mm:ss')}}
					format={dateTimeFormat}
					value={LocationForm.LatestDateTime}
					onChange={(value) => {
						this.onFieldChange(LocationFormKey, "LatestDateTime", value)
					}}
					size="Large"
				/>
				{!(LocationForm.is_start || LocationForm.is_end) ?
				<Button type="dashed" onClick={() => this.removeLocationForm(LocationFormKey)} style={{ width: '60%' }}>
					<Icon type="minus" /> <IntlMessages id="location.action.remove"/>
				</Button> : ""}
			</Card>
		);
	}

	render(){

		const {Initiated, LocationForms} = this.state
		const renderedLocationForms =  Object.keys(LocationForms).map(key => {
			return (this.renderLocationForm(key))
		})

		return (
			<div>
				{renderedLocationForms}
				<div>
					<Button type="dashed" onClick={this.addCompanyLocationForm} style={{ width: '60%' }}>
						<Icon type="plus" /> <IntlMessages id="location.action.remove"/>
					</Button>
				</div>
			</div>

		)
	}

}

LocationForm.propTypes = {
	intl: intlShape.isRequired
}

export default injectIntl(LocationForm)