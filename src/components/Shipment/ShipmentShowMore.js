import React from "react";
import IntlMessages from "components/utility/intlMessages";

import {injectIntl, intlShape}  from "react-intl";

class ShipmentDeliveryCell extends React.Component {
	INITIAL_STATE = {
		showMore: false,
	}

	constructor(props){
		super(props);
		this.state = { ...this.INITIAL_STATE };
		this.destinationsInfo = []
	}
	toggle = () => {
		this.setState({ showMore: !this.state.showMore});
	}
	countByCity = (destinations) => {
		const counts = {};
		destinations.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
		return counts;
		}
	setDestinationsInfo = (destinations) => {
			let modifiedDestinations = [];
			const countDupes = this.countByCity(destinations)
			Object.keys(countDupes).forEach(function(count) {
				if (countDupes[count] > 1) {
          modifiedDestinations.unshift(<div><div>{count} ({countDupes[count]} <IntlMessages id="general.stops"></IntlMessages>)</div> </div>)
				} else {
          modifiedDestinations.unshift(<div><div>{count}</div></div>)
				}
			})
			if(countDupes[this.props.address] >1) {
				modifiedDestinations.splice(-1, 1, <div><div>{this.props.address} ({countDupes[this.props.address]} <IntlMessages id="general.stops"></IntlMessages>) | {this.props.time}</div></div>)
			} else {
				modifiedDestinations.splice(-1, 1, <div><div>{this.props.address} | {this.props.time}</div></div>)
			}
			this.destinationsInfo = modifiedDestinations
	}
	getRenderedItems() {
		if (this.state.showMore) {
			return this.destinationsInfo;
		}
		return this.destinationsInfo.slice(this.destinationsInfo.length-1,this.destinationsInfo.length)
	}
  getMessage() {
    return (<div>{this.props.destinations.length - 1} <IntlMessages id="shipment.show_more"></IntlMessages></div>)
  }
	componentDidMount() {
		this.setDestinationsInfo(this.props.destinations)
	}
	render(){
		return(
			<div>
				{this.getRenderedItems().map((item, id) => (
				<div key={id}>{item}</div>
				))}
				{this.destinationsInfo.length > 1?
				<a onClick={this.toggle}>
					{this.state.showMore ? <IntlMessages id="shipment.show_less"></IntlMessages> : this.getMessage()}
				</a> : <div></div>
				}
			</div>
		)
	}
}

ShipmentDeliveryCell.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(ShipmentDeliveryCell)