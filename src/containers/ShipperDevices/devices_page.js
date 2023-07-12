import React, { Component } from "react";
import { connect } from "react-redux";
import { RadioGroup, RadioButton } from "components/uielements/radio";

import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
import Devices from "./devices";
import {COMPANY_DEVICES, USER_DEVICES} from "constants/options/carrier/devices";

class DevicePage extends Component {

	INITIAL_STATE = {
		view: COMPANY_DEVICES
	}

	constructor(props) {
		super(props);
		this.state = { ...this.INITIAL_STATE };
	}

	renderTabContent = () => {
		const {view} = this.state
		let tabView = ""
		if (view === "new") {
			tabView = ""
		}
		else{
			tabView = <Devices view={view}/>
		}

		return tabView
	}


	render() {

		const {view} = this.state

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
						<RadioButton value={COMPANY_DEVICES}><IntlMessages id="device.company_devices"/></RadioButton>
						<RadioButton value={USER_DEVICES}><IntlMessages id="device.user_devices"/></RadioButton>
					</RadioGroup>
					<Devices view={view}/>
				</Box>
			</LayoutWrapper>

		);
	}
}

export default connect()(DevicePage);