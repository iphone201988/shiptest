import {Component} from "react";
import PropTypes from "prop-types";
import IntlMessages from 'components/utility/intlMessages';
import React from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";

const INITIAL_STATE = {}

class LogoutLink extends Component {
	static propTypes = {
		auth: PropTypes.object,
		firebase: PropTypes.shape({
			login: PropTypes.func.isRequired,
		}),
	}

	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
	}

	render(){

		const {className} = this.props

		return (
			// eslint-disable-next-line
			<a className={className || ""} onClick={this.props.firebase.logout}>
				<IntlMessages id="topbar.logout" />
			</a>
		)
	}
}

const mapStateToProps = state => {
	return { auth: state.FB.firebase.auth }
}

const mapDispatchToProps = dispatch => {
	return {
		clearFirestore: () => dispatch({ type: '@@reduxFirestore/CLEAR_DATA' })
	}
}

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	firebaseConnect()
)(LogoutLink)
