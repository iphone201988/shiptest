import React from "react";
import {PropTypes} from "prop-types";
import {injectIntl} from "react-intl";
import CompanyLocation from "model/location/company_location";
import CompanyLocationDetailsView from "./CompanyLocationDetailsView";
import CompanyLocationResourcesView from "./CompanyLocationResourcesView";
import { RadioGroup, RadioButton } from "../../uielements/radio";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
import Card from "containers/Uielements/Card/card.style";
import Map from "../../HereMaps/base_map";
import {Col} from 'antd/es/grid/';

class CompanyLocationDrawer extends React.PureComponent {
  state = { visible: false };

  constructor(props){
    const INITIAL_QUOTE = {
      is_shipper: false,
      company_location: null,
      remove_map: false,
      detailsView: undefined
    }

    super(props);
    this.state = { ...INITIAL_QUOTE };
  }

  componentDidMount() {
    this.setState(
      {
        company_location: this.props.company_location,
        is_shipper: this.props.is_shipper,
        detailsView: this.props.itemTabKey
      })
  }

  componentDidUpdate(prevProps) {

    if ((this.props.company_location instanceof CompanyLocation)
      && (prevProps.company_location !== this.props.company_location || prevProps.is_shipper !== this.props.is_shipper)) {
      this.setState(
        {
          company_location: this.props.company_location,
          is_shipper: this.props.is_shipper,
          detailsView: this.props.itemTabKey
        })
    }
  }

  onCloseDetail = () => {
		this.props.onCloseDetail()
	}

  renderView = (detailsView) => {
    if (detailsView === "details") {
      // console.log('i am this.props.company_location.account.id from CompanyLocationDrawer', this.props.company_location.account.id);
      return (
        <>
            <CompanyLocationDetailsView is_shipper={this.state.is_shipper} onCloseDetail={this.onCloseDetail} company_location={this.state.company_location}  />
        </> 
      )
    } else if (detailsView === "resources") {
       return (<Card>
        <CompanyLocationResourcesView
          company_location={this.state.company_location}
          onCloseDetail={this.onCloseDetail}
          />
      </Card>
       )
    } else if (detailsView === "map") {
      return (
        <Card title={this.props.intl.formatMessage({id: 'general.map'})}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Map map_id={"company_details"} company_location={this.state.company_location} zoom_to={this.state.company_location} width={"100%"} height={"400px"} ></Map>
          </Col>
        </Card>
      )
    }
  }

  render() {
    const {company_location, detailsView } = this.state
    // console.log('i am props', this.props);
    // console.log('i am this.props.company_location.account.id from CompanyLocationDrawer', this.props.company_location.account.id);
    // console.log('i am id from CompanyLocationDrawer', this.state.company_location.id);


    if (company_location === null){
      return ("")
    }

    return (
      <div>
      <Box>
        <RadioGroup
          buttonStyle="solid"
          id="CompanyLocationDetails"
          name="CompanyLocationDetails"
          value={detailsView}
          onChange={event => {
            this.setState({detailsView: event.target.value})
          }}
        >
          <RadioButton value="details"><IntlMessages id="company_location.details.title"/></RadioButton>
          <RadioButton value="resources"><IntlMessages id="general.shipment_transport_resources"/></RadioButton>
          <RadioButton value="map"><IntlMessages id="general.map"/></RadioButton>
        </RadioGroup>
        {
          this.renderView(detailsView)
        }
      </Box>
    </div>
    );
  }
}

CompanyLocationDrawer.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(CompanyLocationDrawer)