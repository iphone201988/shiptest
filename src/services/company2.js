import React from 'react';
import CompanyRequest from "helpers/backend/company";
import {handle_backend_response} from "helpers/error/error_handler";

const { createContext, useContext } = React;

const AuthContext = createContext(null);

export const CompanyServiceProvider = (props) => {
	const value = {
		addCompanyLocation: props.addCompanyLocation || addCompanyLocation,
	};

	return (
		<CompanyServiceProvider.Provider value={value}>
			{props.children}
		</CompanyServiceProvider.Provider>
	);
};

export const useCompanyServiceProvider = () => {
	return useContext(AuthContext);
};

const addCompanyLocation = (LocationData, auth) => {
	return CompanyRequest.addCompanyLocation(LocationData, auth).then(handle_backend_response)
		.then(res => res.json())
		.catch(e=> {
			console.log(e.message)
			throw e
		})
}




// import CompanyRequest from "helpers/backend/company";
// import {handle_backend_response} from "helpers/error/error_handler";
// import {compose} from "redux";
// import { connect } from "react-redux";
// import {firebaseConnect} from "react-redux-firebase";
// import {PureComponent} from "react";
// import {PropTypes} from "prop-types";
//
// class CompanyService2 extends PureComponent{
//
// 	static propTypes = {
// 		firebase: PropTypes.object
// 	}
//
// 	addCompanyLocation = (LocationData) => {
//
// 		return CompanyRequest.addCompanyLocation(LocationData, this.props.firebase.auth()).then(handle_backend_response)
// 			.then(res => res.json())
// 			.catch(e=> {
// 				console.log(e.message)
// 				throw e
// 			})
// 	}
// }
//
// const mapStateToProps = state => {
// 	return {
// 		firebase: state.FB.firebase
// 	}
// }
//
// export default compose(
// 	connect(mapStateToProps),
// 	firebaseConnect()
// )(CompanyService2)