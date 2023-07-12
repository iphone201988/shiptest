import React from "react";
import {injectIntl, intlShape} from "react-intl";
import { RadioGroup, RadioButton } from "../uielements/radio";
import IntlMessages from "components/utility/intlMessages";
import Card from "containers/Uielements/Card/card.style";
import Box from "components/utility/box";
import CompanyAccount from "model/company/company";
import { renderDetails } from "./CompanyComponents";

class CompanyDetailsView extends React.Component {

  constructor(props){
    const INITIAL_QUOTE={
      domain: null,
      company: props.company || null,
      detailsView: undefined,
      // formInputs: undefined
    }

    super(props);
    this.state = {
      ...INITIAL_QUOTE, domain: this.props.domain
    };

  }

  componentDidMount() {
    this.setOptions()
  }

  componentDidUpdate(prevProps) {
    if((this.props.company instanceof CompanyAccount) & (prevProps.company !== this.props.company)) {
      this.setState({company: this.props.company, domain: this.state.domain})
    }
  }

  KeyValListToOptions = (KeyValList) => {
		return KeyValList.map(kv => {return {label: this.props.intl.formatMessage({id: kv.value.name}),value: kv.key}})
	}

  setOptions = () => {
    this.setState({
		 detailsView: this.props.itemTabKey,
		})
  }

  onCloseDetail = () => {
		this.props.onCloseDetail()
	}

  renderView = (detailsView, company) => {
    if(detailsView === "details" && company) {
      return (
        <>
          <Card title={this.props.intl.formatMessage({id: `${company.profile.name}`})}>
            {renderDetails(company, this.props.intl.formatMessage)}
          </Card>
          {/* <Card title={this.props.intl.formatMessage({id: 'shipment.itinerary.title'})}>
            {renderShipmentItinerary(shipment, this.props.intl.formatMessage)}
          </Card> */}
        </>
      )
    }
  }

  render() {

    let { company, detailsView } = this.state ;

    if(!company){
      return (
        <div>
          "No company from CompanyDetailsView"
        </div>
      )
    }

    return(
      <div>
        <Box>
          <RadioGroup
            buttonStyle="solid"
            id="CompanyDetails"
            name="CompanyDetails"
            value={detailsView}
            onChange={event => {
              this.setState({detailsView: event.target.value})
            }}
            >
              <RadioButton value="details"> <IntlMessages id="general.company_details"/></RadioButton>
            </RadioGroup>
             {this.renderView(detailsView, company)} 
        </Box>
      </div>
    )
  }

}


 CompanyDetailsView.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(CompanyDetailsView)
