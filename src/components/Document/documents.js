import React, {Component}  from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import {injectIntl, intlShape}  from "react-intl";
import {PropTypes} from "prop-types";
import DataView from "containers/base/data_view";
import {FireQuery} from "helpers/firebase/firestore/firestore_collection";
import {DOCUMENTS_TYPES} from "constants/options/documents";
import {getOptionOrDefault} from "constants/variables";

class Documents extends Component {

    static propTypes = {
        firebase: PropTypes.object,
        companyId: PropTypes.string,
    }

    INITIAL_STATE = {
        documents: [],
        queryFilterConditions: [],
        resultsFilterConditions: [],
        itemActions: [],
        ready: false,
    }

    constructor(props) {
        super(props);
        this.state = { ...this.INITIAL_STATE };
        this.state.itemActions = this.getItemActions()
        this.state.columns =  this.getColumns()
        this.state.documentType = "document"
    }

    componentDidMount() {
        if (this.props.companyId){
            this.setFilterConditions()
        }
        if (this.props.associated_resource.type === "asset") {
            this.setState({documentType : "vehicle_registration_documents"})
        }
    }

    componentDidUpdate(prevProps)  {
        if (prevProps.companyId !== this.props.companyId){
            this.setFilterConditions()
        }
    }

    setFilterConditions = (formValues={}) => {
        const {queryFilterConditions} = this.state
        const {associated_resource} = this.props

        queryFilterConditions.push(new FireQuery('company_account.id', '==', this.props.companyId))
        if (associated_resource && associated_resource.id && associated_resource.type){
            queryFilterConditions.push(new FireQuery('associated_resource.id', '==', associated_resource.id))
            queryFilterConditions.push(new FireQuery('associated_resource.type', '==', associated_resource.type))
        }

        this.setState({queryFilterConditions: queryFilterConditions, ready: true})
    }

    getItemActions = () => {
        return [
            {label: "general.details", type: "viewItem"},
        ]
    }

    getFilterInputs = () =>{

    }

    getColumns = () => {
        let columns = [
                {
                    title: this.props.intl.formatMessage({id: "general.name"}),
                    dataIndex: 'name',
                    key: 'name',
                    width: '20%',
                    render: ""
                },
                {
                    title: this.props.intl.formatMessage({id: "general.type"}),
                    dataIndex: 'type',
                    key: 'type',
                    width: '20%',
                    render: (text, item) => (<>
                        {this.props.intl.formatMessage({id: getOptionOrDefault(DOCUMENTS_TYPES, item.type).name  ||  ""})}
                    </>)
                },
        ]
        if (this.props.associated_resource.type === "shipment"){
            columns.push(            {
                title: this.props.intl.formatMessage({id: "general.category"}),
                dataIndex: 'category',
                key: 'category',
                width: '20%',
            },
)
        }
        return columns
    }

    render(){

        const {columns, queryFilterConditions, resultsFilterConditions, itemActions, ready, documentType} = this.state

        if ( ready && (columns || []).length > 0){
            return (
                <div>
                    <DataView itemType={documentType}
                              queryFilterConditions={queryFilterConditions}
                              resultsFilterConditions={resultsFilterConditions}
                              columns={columns}
                              itemActions={itemActions}
                              layouts={[{key: 'table', sections:[{type: 'table', span: 24}]}]}
                    />
                </div>
            )
        }else{
            return ""
        }
    }

}

Documents.propTypes = {
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
)(injectIntl(Documents))
