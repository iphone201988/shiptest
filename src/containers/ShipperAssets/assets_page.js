import React, {Component, lazy} from "react";
import { connect } from "react-redux";
import { RadioGroup, RadioButton } from "components/uielements/radio";

import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
import {ASSET_TYPE_VEHICLE} from "constants/options/carrier/assets";

const Assets =  lazy(() => import("./assets"));
const NewAsset =  lazy(() => import("./new_asset"));

class AssetPage extends Component {

	DEFAULT_ASSET_TYPE = ASSET_TYPE_VEHICLE

	INITIAL_STATE = {
		assetType: this.DEFAULT_ASSET_TYPE,
		newAssetVisible: false
	}


	constructor(props) {
		super(props);
		this.state = { ...this.INITIAL_STATE };
	}

	showNewAsset = () => {
		this.setState({newAssetVisible: true})
	}

	onNewAssetClose = (assetType=this.DEFAULT_ASSET_TYPE) => {
		this.setState({assetType: assetType})
	}

	renderTabContent = () => {
		const {assetType} = this.state
		let tabView = ""
		if (assetType === "new"){
			tabView = <NewAsset
				visible={true}
				onDone={this.onNewAssetClose}
			/>
		}else{
			tabView = <Assets assetType={assetType}/>
		}

		return tabView
	}
	
	render() {

		const {assetType} = this.state

		return (

			<LayoutWrapper>
				<Box>
					<RadioGroup
						buttonStyle="solid"
						id="assetType"
						name="assetType"
						value={assetType}
						onChange={event => {
							this.setState({assetType: event.target.value})
						}}
					>
						<RadioButton value="new"><IntlMessages id="general.actions.add_asset"/></RadioButton>
						<RadioButton value="vehicle"><IntlMessages id="carrier.asset.vehicles"/></RadioButton>
						<RadioButton value="trailer"><IntlMessages id="carrier.asset.trailers"/></RadioButton>
					</RadioGroup>
					{this.renderTabContent()}
				</Box>
			</LayoutWrapper>

		);
	}
}

export default connect()(AssetPage);