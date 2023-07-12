import React, {PureComponent}  from "react";
import {injectIntl, intlShape}  from "react-intl";
import {compose} from "redux";
import {connect} from "react-redux";
import {PropTypes} from "prop-types";
import {firebaseConnect, firestoreConnect} from "react-redux-firebase";
import {FireQuery} from "helpers/firebase/firestore/firestore_collection";
import LayoutWrapper from "components/utility/layoutWrapper";
import FilterBox from "components/base/filter_box";
import DataView from "../base/data_view";
import CarrierUser from "model/user/carrier_user";


class ItemsView extends PureComponent {

    defaultViewType = "table"

    INITIAL_STATE = {
        queryFilterConditions: [],
        columns: [],
        itemActions: [],
        viewType: ItemsView.defaultViewType,
        selectedItem: undefined,
        itemDetailsVisible: false,
        itemModifyVisible : false,
        newItemVisible: false,
        loading: true,
        filterInputs: []
    }

    static propTypes = {
        companyId: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = { ...this.INITIAL_STATE };
        this.state.columns =  this.getColumns()
        this.state.itemActions = this.getItemActions()
    }

    componentDidMount() {
        if (this.props.companyId){
            this.setFilterConditions()
        }
    }

    componentDidUpdate(prevProps)  {
        if (this.updateFilterConditions(prevProps)){
            this.setFilterConditions()
        }
    }

    updateFilterConditions = (prevProps) => {
        return prevProps.companyId != this.props.companyId
    }

    setFilterConditions = (formValues={}) => {
        const queryFilterConditions = [new FireQuery('company_account.id', '==', this.props.companyId)]
        const resultsFilterConditions = []

        this.setState({queryFilterConditions: queryFilterConditions, resultsFilterConditions: resultsFilterConditions})
    }

    sortString = (a, b) => {
        return a.localeCompare(b)
    }

    getColumns = () => {
        return []
    }

    showItemDetails = () => {
        this.setState({itemDetailsVisible: true})
    }

    hideItemDetails = () => {
        this.setState({itemDetailsVisible: false})
    }

    showItemModify = () => {
        this.setState({itemModifyVisible: true})
    }

    hideItemModify = () => {
        this.setState({itemModifyVisible: false})
    }

    loading = (loading) => {
        this.setState({loading: loading})
    }

    getItemActions = () => {
        return [
        ]
    }

    render() {
        return <LayoutWrapper>
            <FilterBox
                title={this.props.intl.formatMessage({id: 'general.actions.find_users'})}
                formInputs={filterInputs}
                onSubmit={this.setFilterConditions}
            />
            <DataView collectionModel={CarrierUser}
                      queryFilterConditions={queryFilterConditions}
                      resultsFilterConditions={resultsFilterConditions}
                      columns={columns}
                      itemActions={itemActions}
                      viewType={viewType}
                      layouts={[{key: 'table', sections:[{type: 'table', span: 24}]}]}
            />
        </LayoutWrapper>
    }

}