import React, { Component, lazy } from "react";
import { connect } from "react-redux";
import { RadioGroup, RadioButton } from "components/uielements/radio";

import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
import {COMPANY_DEVICES, USER_DEVICES, NEW_DEVICE } from "constants/options/carrier/devices";

const NewDevice =  lazy(() => import("./new_device"));
const Devices =  lazy(() => import("./devices"));


class DevicePage extends Component {

	INITIAL_STATE = {
		view: COMPANY_DEVICES
	}

	constructor(props) {
		super(props);
		this.state = { ...this.INITIAL_STATE };
	}

	onNewDevicesClose = () => {
		this.setState({view: COMPANY_DEVICES})
	  }

	renderTabContent = () => {
		const {view} = this.state
		let tabView = ""
		if (view === "new_device") {
			tabView = <NewDevice onDone={this.onNewDevicesClose} />
		}
		if(view === "active_devices") {
			tabView = <Devices view={view}/>
		}

		if(view === "inactive_devices") {
			tabView = <Devices view={view}/>
		}

		

		return tabView
	}


	render() {

		const {view} = this.state

		// console.log('i am view', view);

		return (

			<LayoutWrapper>
				<Box>
					<RadioGroup
						buttonStyle="solid"
						id="view"
						name="view"
						value={view}
						onChange={event => {
							this.setState({view: event.target.value})
						}}
					>
						<RadioButton value={NEW_DEVICE}><IntlMessages id="carrier.action.add_device"/></RadioButton>
						<RadioButton value={COMPANY_DEVICES}><IntlMessages id="device.active_devices"/></RadioButton>
						<RadioButton value={USER_DEVICES}><IntlMessages id="device.inactive_devices"/></RadioButton>
					</RadioGroup>
					{this.renderTabContent()}
				</Box>
			</LayoutWrapper>

		);
	}
}

export default connect()(DevicePage);