import React, {PureComponent, lazy} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {injectIntl, intlShape} from "react-intl";
import {ASSET_TYPE_VEHICLE} from "constants/options/carrier/assets";
import Box from "components/utility/box";
import {RadioButton, RadioGroup} from "components/uielements/radio";
import IntlMessages from "components/utility/intlMessages";
import LayoutWrapper from "components/utility/layoutWrapper";

const NewVehicle =  lazy(() => import("./new_vehicle"));
const NewTrailer =  lazy(() => import("./new_trailer"));

const assetTypesMap = {
  'vehicle': {"class": NewVehicle, "message_id": "carrier.asset.vehicles"},
  'trailer': {"class": NewTrailer, "message_id": "carrier.asset.trailers"},
}

class CarrierNewAsset extends PureComponent  {

  DEFAULT_ASSET_TYPE = ASSET_TYPE_VEHICLE

  INITIAL_STATE = {
    assetType: this.DEFAULT_ASSET_TYPE
  }

  constructor(props) {
    super(props);
    this.state = { ...this.INITIAL_STATE };
  }

  componentDidMount() 
  {
    if (this.props.assetType){
      this.setState({"assetType": this.props.assetType})
    }
  }

  componentDidUpdate(prevProps){
    if (prevProps.assetType !== this.props.assetType) {
      this.setState({assetType: this.props.assetType})
    }
  }

  onDone = () =>  {
    const {assetType} = this.state;
    if (this.props.onDone){
      this.props.onDone(assetType)
    }
  }

  handleReset = () => {
    this.setState(this.INITIAL_STATE)
  }

  renderTabContent = () => {
    const {assetType} = this.state

    if (assetType === "vehicle"){
      return <NewVehicle onDone={this.onDone}></NewVehicle>
    }else if (assetType === "trailer"){
      return <NewTrailer onDone={this.onDone}></NewTrailer>
    }else{
      return ""
    }

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
              {Object.keys(assetTypesMap).map(asset_type => {
                return <RadioButton value={asset_type}><IntlMessages id={assetTypesMap[asset_type].message_id}/></RadioButton>
              })}
            </RadioGroup>
            {this.renderTabContent()}
          </Box>
        </LayoutWrapper>
    )
  }
}

// const mapStateToProps = state => {
//   return {
//   }
// }

// const mapDispatchToProps = dispatch => {
//   return {
//   }
// }

CarrierNewAsset.propTypes = {
  intl: intlShape.isRequired
}

export default compose(connect())(injectIntl(CarrierNewAsset))

// export default connect()(AssetPage);