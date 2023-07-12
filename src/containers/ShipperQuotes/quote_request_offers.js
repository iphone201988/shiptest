import React, { PureComponent }  from "react";
import { injectIntl, intlShape }  from "react-intl";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";

import LayoutWrapper from "components/utility/layoutWrapper";
import PageHeader from "components/utility/pageHeader";
import IntlMessages from "components/utility/intlMessages";
import Scrollbars from "components/utility/customScrollBar";
import { Box } from "components/tables/Table.style";
import CardWrapper from "components/tables/Table.style";
import ShipmentService from "../../services/shipment"
import { QUOTE_OFFER_STATUS, SHIPMENT_STATE } from "constants/options/shipping";
import QuoteOffer from "model/shipment/quote_offer";
import QuoteOfferDrawer from "./quote_offer_drawer";
import { DeliveryCellInfo, PickupCellInfo } from "components/Shipment/ShipmentComponents";
import {Capitalize} from "helpers/data/string";
import Carrier from "model/carrier/carrier";
import {mapFirestoreResultsToModelList} from "helpers/firebase/firestore_model";
import DataView from "../base/data_view";
import {FireQuery} from "helpers/firebase/firestore/firestore_collection";

const _ = require("underscore")

class QuoteRequestOffers extends PureComponent {

	INITIAL_STATE = {
		viewType: 'table',
		queryFilterConditions: [],
		resultsFilterConditions: [],
		loading: false,
		New: true,
		columns: [],
		quoteRequest: null,
		itemActions: [],
		quoteOffer: null,
		QuoteOfferReviewAcceptVisible: false,
		QuoteModifyVisible: false,
		QuoteRequestOffers: [],
		Carriers: []
	}

	constructor(props) {
		super(props);
		this.state = { ...this.INITIAL_STATE };
		this.state.quoteRequest =  props.quoteRequest
		this.state.columns = this.getColumns() || []
		this.state.itemActions = this.getItemActions()

	}

	componentDidMount() {
		this.setFilterConditions()
	}

	componentDidUpdate(prevProps, nextContext) {
		if (!_.isEqual(prevProps.quoteRequest, this.props.quoteRequest)){
			this.setState({
				quoteRequest: this.props.quoteRequest,
			}, () => {this.setFilterConditions()})
		}

		// if (!_.isEqual(prevProps.QuoteRequestOffers,this.props.QuoteRequestOffers)){
		// 	this.setState({
		// 		QuoteRequestOffers: this.props.QuoteRequestOffers
		// 	})
		// }
		if (!_.isEqual(prevProps.Carriers, this.props.Carriers)){
			this.setState({
				Carriers: this.props.Carriers
			})
		}
	}

	setFilterConditions = (formValues = {}) => {

		const {quoteRequest} = this.props

		const queryFilterConditions =  [new FireQuery('type', '==', SHIPMENT_STATE.quote_offer.key),
		new FireQuery('quote_request', '==', quoteRequest.id)
		]
		const resultsFilterConditions = []

		this.setState({queryFilterConditions: queryFilterConditions, resultsFilterConditions: resultsFilterConditions})
	}

	quoteOfferReviewAcceptDisplayCondition = (quote) => {
		return quote.status === QUOTE_OFFER_STATUS.pending.key
	}

	getItemActions = () => {
		return [
			// {label: "general.review_accept", callback: this.showQuoteOfferReviewAccept,
			// 	displayCondition: this.quoteOfferReviewAcceptDisplayCondition},
		]
	}


	getColumns = () => {
		return [
			{
				title: this.props.intl.formatMessage({id: "general.review_accept"}),
				dataIndex: '',
				rowKey: 'id',
				width: '10%',
				//eslint-disable-next-line
				render: (text, quote) => <a onClick={() => this.showQuoteOfferReviewAccept(quote)}>
					{this.props.intl.formatMessage({id: "general.review_accept"})}
				</a>
			},
			{
				title: this.props.intl.formatMessage({id: "carrier.title"}),
				dataIndex: '',
				rowKey: 'id',
				width: '10%',
				render: (text, quote) => <span>
					{quote.carrier}
				</span>,
			},
			{
				title: this.props.intl.formatMessage({id: "shipment.pickup.title"}),
				dataIndex: '',
				rowKey: 'origin',
				width: '20%',
				render: (text, quote) => <div>{PickupCellInfo(quote)}</div>
			},
			{
				title: Capitalize(this.props.intl.formatMessage({id: "shipment.delivery.title"})),
				dataIndex: '',
				rowKey: 'origin',
				width: '20%',
				render: (text, quote) => <div>{DeliveryCellInfo(quote)}</div>
			}
		]
	}

	onQuoteOfferReviewAcceptClose = () =>{
		this.setState({QuoteOfferReviewAcceptVisible: false})
	}

	onQuoteModifyClose = () => {
		this.setState({QuoteModifyVisible: false})
	}

	showQuoteOfferReviewAccept = (quote) => {
		this.setState({QuoteOfferReviewAcceptVisible: true, quoteOffer: quote})
	}

	AcceptQuoteOffer = (record) => {
		ShipmentService.acceptQuoteOffer(record.id)
	}

	render() {

		const {queryFilterConditions, resultsFilterConditions, quoteRequest,
			QuoteOfferReviewAcceptVisible, quoteOffer, viewType, columns, itemActions} = this.state

		if (!quoteRequest){
			return('')
		}

		let table =    <LayoutWrapper>
			<PageHeader>
				<IntlMessages id="shipping.sidebar.quote_offers"/>
			</PageHeader>
			<Box>
				<div className="TableBtn">
				</div>

				<CardWrapper title={this.props.intl.formatMessage({id: "general.quotes"})}>

						<div>
							<div className="Table">
								<Scrollbars style={{width: '100%'}}>
									<DataView itemType={"shipper_quote_offer"}
											  queryFilterConditions={queryFilterConditions}
											  resultsFilterConditions={resultsFilterConditions}
											  columns={columns}
											  itemActions={itemActions}
											  viewType={viewType}
											  layouts={[{key: 'table', sections:[{type: 'table', span: 24}]}]}
									/>
									
								</Scrollbars>
								
							</div>
							{quoteOffer instanceof QuoteOffer ?
							<QuoteOfferDrawer
								view={this.props.view}
								visible={QuoteOfferReviewAcceptVisible}
								quote={quoteOffer}
								onClose={this.onQuoteOfferReviewAcceptClose}
								is_shipper={true}
							/>: ""}

						</div>
						{/*)*/}
					{/*) :  <HelperText text="No Quotes"/>}*/}
				</CardWrapper>
			</Box>
		</LayoutWrapper>
		return (table)

	}
}

QuoteRequestOffers.propTypes = {
	intl: intlShape.isRequired
}

const mapStateToProps = state => {
	return {
		Carriers: state.FB.firestore.data.Carriers ? mapFirestoreResultsToModelList(state.FB.firestore.data.Carriers, Carrier, true) : {},
	}
}

const mapDispatchToProps = dispatch => {
	return {
	}
}

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	firestoreConnect(

	)
)(injectIntl(QuoteRequestOffers))