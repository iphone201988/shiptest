import React, {PureComponent}  from "react";
import {PropTypes} from "prop-types";
import LayoutWrapper from "components/utility/layoutWrapper";
import Loader from "components/utility/loader";
import FilterBox from "components/base/filter_box";
import DataView from "../base/data_view";

export class DataViewBaseComponent extends PureComponent {

    defaultViewType = "table"
    collectionModel = undefined
    filterBoxTitle = "_"
    dataViewLayouts = [{key: 'table', sections:[{type: 'table', span: 24}]}]

    INITIAL_STATE = {
        queryFilterConditions: [],
        resultsFilterConditions: [],
        collectionModel: this.collectionModel,
        columns: [],
        itemActions: [],
        viewType: this.defaultViewType,
        selectedItem: undefined,
        itemDetailsVisible: false,
        itemModifyVisible : false,
        newItemVisible: false,
        loading: false,
        filterInputs: [],
        ready: false
    }

    static propTypes = {
        companyId: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = { ...this.INITIAL_STATE };
    }

    componentDidMount() {
        if (this.initFilterConditions()){
            this.setFilterConditions()
        }
    }

    componentDidUpdate(prevProps)  {
        if (this.updateFilterConditions(prevProps)){
            this.setFilterConditions()
        }
    }

    initFilterConditions() {
        return true
    }

    updateFilterConditions = (prevProps) => {
        //return prevProps.companyId != this.props.companyId
        return true
    }

    sortString = (a, b) => {
        return a.localeCompare(b)
    }

    // getColumns = () => {
    //     return []
    // }

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

        const {collectionModel, queryFilterConditions, resultsFilterConditions, columns, viewType, itemActions, filterInputs, ready} = this.state

        if (!ready){
            return <Loader></Loader>
        }

        return <LayoutWrapper>
            <FilterBox
                title={this.props.intl.formatMessage({id: this.filterBoxTitle})}
                formInputs={filterInputs}
                onSubmit={this.setFilterConditions}
            />
            <DataView collectionModel={collectionModel}
                      queryFilterConditions={queryFilterConditions}
                      resultsFilterConditions={resultsFilterConditions}
                      columns={columns}
                      itemActions={itemActions}
                      viewType={viewType}
                      layouts={this.dataViewLayouts}
            />
        </LayoutWrapper>
    }

}