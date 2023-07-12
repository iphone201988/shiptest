import React from "react";
import {PropTypes} from "prop-types";
import {compose} from "redux";
import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {injectIntl, intlShape} from "react-intl"
import {
	Drawer, Col, Row,
} from 'antd';
import {
	PICKUP_SERVICES,
	DELIVERY_SERVICES,
} from "constants/options/shipping";
import Map from "components/HereMaps/base_map"
import {
	renderShipmentDetails, renderShipmentFreightMode,
	renderShipmentRate
} from "components/Shipment/ShipmentComponents";
import Card from "../Uielements/Card/card.style";
import QuoteOffer from "model/shipment/quote_offer";


class QuoteOfferDrawer extends React.Component {

	static propTypes = {
		firebase: PropTypes.object,
		companyId: PropTypes.string,
		fetchQuoteOffers: PropTypes.func.isRequired,
	}

	constructor(props){
		const INITIAL_QUOTE = {
			quoteOffer: null,
			visible: false,
			quote_id: props.quote_id,
			quote_request_id: props.quote_request_id,
			PICKUP_SERVICES: PICKUP_SERVICES,
			DELIVERY_SERVICES: DELIVERY_SERVICES,
			remove_map: props.remove_map || false,
			Submitting: false,
		}

		super(props);
		this.state = { ...INITIAL_QUOTE };
	}

	componentDidMount() {
		if (this.props.quote_id){
			this.setQuoteOffer(this.props.quote_id)
		}

		if (this.props.visible){
			this.setState({ visible: this.props.visible });
		}
	}

	componentDidUpdate(prevProps) {

		if (prevProps.quote_id !== this.props.quote_id){
			this.setQuoteOffer(this.props.quote_id)
		}

		if (prevProps.visible !==  this.props.visible){
			this.setState({ visible: this.props.visible });
		}
	}

	setQuoteOffer = (quote_id) => {
		if (quote_id.length > 0){
			QuoteOffer.collection.get(quote_id, this.onQuoteOfferChange, false)
			this.setState({quote_id: quote_id})
		}

	}

	onQuoteOfferChange = (quoteOffer) => {
		this.setState({quoteOffer: quoteOffer})
	}

	onClose = () => {
		this.setState({
			visible: false,
			remove_map: true,
		});
		if (this.props.onClose){
			this.props.onClose()
		}
	};

	render() {
		const {quoteOffer, remove_map, visible } = this.state

		if (!(quoteOffer instanceof QuoteOffer)){
			return (<div></div>)
		}

		return (

			<Drawer
				width="80%"
				placement="right"
				closable={true}
				onClose={this.onClose}
				visible={visible}
				destroyOnClose={true}
			>
				<Card title={this.props.intl.formatMessage({id: 'shipment.quote_offer.title'})}>
					{renderShipmentFreightMode(quoteOffer, this.props.intl.formatMessage, {showTrailerTypes: true})}
					{renderShipmentRate(quoteOffer.rate, "carrier", this.props.intl.formatMessage)}

				</Card>

				<Card title={this.props.intl.formatMessage({id: 'shipment.itinerary.title'})}>
					<Row type="flex" justify="space-around" align="middle">
						<Col xs={24} sm={24} md={12} lg={12} xl={12}>
							{renderShipmentDetails(quoteOffer, this.props.intl.formatMessage)}
						</Col>
						<Col xs={24} sm={24} md={12} lg={12} xl={12}>
							<Map routeLocations={quoteOffer.locations} width={"100%"} height={"400px"} remove_map={remove_map}></Map>
						</Col>
					</Row>
				</Card>
			</Drawer>
		)

	}
}

const mapStateToProps = (state, props) => {
	return {
		firebase: state.FB.firebase,
		companyId: state.FB.company.companyId,
	}
}

QuoteOfferDrawer.propTypes = {
	intl: intlShape.isRequired
}


export default compose(
	connect(mapStateToProps, {}),
	firestoreConnect(
	)
)(injectIntl(QuoteOfferDrawer))