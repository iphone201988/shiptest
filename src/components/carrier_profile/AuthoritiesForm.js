import React from "react";
import {Component} from "react";
import Input, {InputGroup} from "components/uielements/input";
import {PropTypes} from "prop-types";
import Icon from "antd/es/icon";
import Button from "../uielements/button";
import Select from "components/uielements/select";
import IntlMessages from "components/utility/intlMessages";
import {ElementListToDict} from "helpers/data/mapper";
import {CARRIER_AUTHORITIES} from "constants/options/carrier/authorities"
import CarrierAuthorityId from "model/carrier/authority/carrier"


const uuidv1 = require('uuid/v1');

const _ = require('underscore')

export class AuthoritiesForm extends Component {

	constructor(props){
		const INITIAL = {
			Authorities:{},
			Initiated: false,
		}

		if (props.Authorities){
			INITIAL['Authorities'] = ElementListToDict(props.Authorities)
		}

		super(props);
		this.state = { ...INITIAL };
	}

	componentDidMount() {
		let {Initiated, Authorities} = this.state

		if (!Initiated){
			if (Authorities.length == 0){
				this.addAuthority()
			}
			this.setState({"Initiated": true})
		}
	}

	componentDidUpdate(prevProps) {
		if (! _.isEqual(this.props.Authorities, prevProps.Authorities)){
			this.setState({Authorities:  ElementListToDict(prevProps.Authorities)})
		}
	}

	updateAuthorities = (Authorities) => {
		this.setState({"Authorities": Authorities})
		if (typeof this.props.onChange != undefined){
			this.props.onChange(Object.values(this.state.Authorities).map(authority => {return authority}))
		}
	}

	onFieldChange = (key, field, value) => {
		const {Authorities} = this.state
		Authorities[key][field] = value
		this.updateAuthorities(Authorities)
	}

	addAuthority= () => {
		let {Authorities} = this.state
		Authorities[uuidv1()] = new CarrierAuthorityId()
		this.updateAuthorities(Authorities)
	}

	removeAuthority = (Key) => {
		let {Authorities} = this.state
		if (Object.keys(Authorities).length >= 1){
			delete Authorities[Key]
		}
		this.updateAuthorities(Authorities)
	}


	AuthorityListSelect = (Key, initial_value) =>
		(
			<Select style={{ width: 70 }}
							defaultValue={initial_value}
							onChange={(value)=>{this.onFieldChange(Key, "carrier_authority", value)}}>
				{Object.values(CARRIER_AUTHORITIES).map((item) =>(
					<option value={item.key}><IntlMessages id={item.name}/></option>
				))}
			</Select>
		)


	renderAuthorityItem = (key, carrierAuthority) => {

		return (
			<div>

				<Input addonBefore={this.AuthorityListSelect(key, carrierAuthority.carrier_authority)}
							 onChange={(event)=>{this.onFieldChange(key, "authority_id", event.target.value)}}
							 // changeCarrierAuthority(key, event.target.value)}}
							 defaultValue={carrierAuthority.authority_id}
							 style={{ width: '60%', marginRight: 8 }} />

				<Icon
					className="dynamic-delete-button"
					type="minus-circle-o"
					onClick={() => {this.removeAuthority(key)}}
				/>
			</div>
		)
	}

	render() {

		const { Authorities} = this.state;
		const {Initiated} = this.state

		if (Initiated){

			const AuthoritiesItems = Object.keys(Authorities).map(key =>{
				let carrierAuthority = Authorities[key]
				return (
					this.renderAuthorityItem(key, carrierAuthority)
				)
			})

			return (
				<div>

					{AuthoritiesItems}
					<div>
						<Button type="dashed" onClick={this.addAuthority} style={{ width: '60%' }}>
							<Icon type="plus" /> <IntlMessages id="carrier.action.add_authority"/>
						</Button>
					</div>

				</div>
			);
		}else{
			return '';
		}
	}
}