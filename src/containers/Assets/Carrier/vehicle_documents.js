import React, {Component}  from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import {injectIntl, intlShape}  from "react-intl";
import Documents from "components/Document/documents"

class VehicleDocuments extends Component {
    
    render() {
        const {assetId} = this.props
        return (<Documents associated_resource={{id: assetId, type: "asset"}}></Documents>)
    }
}

VehicleDocuments.propTypes = {
intl: intlShape.isRequired
}

const mapStateToProps = state => {
    return {
        firebase: state.FB.firebase,
        companyId: state.FB.company.companyId,
    }
}

export default compose(
    connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(VehicleDocuments))
