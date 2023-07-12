import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'


class Carriers extends Component {
	static propTypes = {
		uid: PropTypes.string,
		companyId: PropTypes.string,
		categories: PropTypes.arrayOf(PropTypes.string),
		// selectedCategory: PropTypes.string,
		selectCategory: PropTypes.func.isRequired,
	}

	renderCategory(category) {
		const styles = {
			padding: '1rem',
			cursor: 'pointer'
		}
		if (category === this.props.selectedCategory) {
			styles.backgroundColor = '#988afe'
		}
		return (
			<div
				key={category}
				style={styles}
				onClick={() => this.props.selectCategory(category)}>
				{category}
			</div >
		)
	}

	render() {
		const categoryItems = this.props.categories.map(
			(name) => this.renderCategory(name)
		)
		return (
			<div>
				<div>
					{categoryItems}
				</div>
				{/*<AddCategory />*/}
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		uid: state.FB.firebase.auth.uid,
		companyId: state.FB.company.companyId,
		categories: state.FB.company.carrier ? [state.FB.company.carrier.profile.name] : []
		// categories: state.FB.firestore.data["Carrier"] ? [state.FB.firestore.data["Carrier"].profile.name] : [],
		// selectedCategory: state.categories.selectedCategory
	}
}

const mapDispatchToProps = dispatch => {
	return {
		selectCategory: category => dispatch({ type: 'selectCategory', category })
	}
}

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	firestoreConnect((props) => {
			return [
				{
					collection: 'Carriers',
					doc: props.companyId,
					storeAs: "Carrier"
					// where: [
					// 	['uid', '==', props.uid]
					// ]
				}
			]
		}
	)
)(Carriers)