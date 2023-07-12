import React, {PureComponent}  from "react";
import {injectIntl, intlShape}  from "react-intl";
import {compose} from "redux";
import {connect} from "react-redux";
import {PropTypes} from "prop-types";
import {firebaseConnect} from "react-redux-firebase";

import Tag from "antd/es/tag";

import IntlMessages from "components/utility/intlMessages";
import Notification from "components/notification";
import FilterBox from "components/base/filter_box";

import {
    UserFilterFormItemLabelCol, 
    UserFilterFormItemWrapperCol,
    UserFilterWrapperCol,
} from "helpers/containers/properties/user";

import CarrierUser from "model/user/carrier_user";
import {ROLES, user_account_status, USER_STATUS} from "constants/options/user";
import DataView from "../base/data_view";
import {disableUser} from "helpers/firebase/firebase_functions/users";
import {DisplayTag} from "components/UI/buttons";
import {getSpan} from "constants/layout/grids";
import {objectToKeyValList} from 'helpers/data/mapper'
import {setUserFilter} from 'helpers/containers/states/filters/user_filter'

const UserStatusKeyVal = objectToKeyValList(USER_STATUS)
const UserRolesKeyVal = objectToKeyValList(ROLES)

class Users extends PureComponent {

    defaultViewType = "table"
    INITIAL_STATE = {
        Users: [],
        queryFilterConditions: [],
        resultsFilterConditions: [],
        columns: [],
        itemActions: [],
        viewType: this.defaultViewType,
        selectedUser: undefined,
        userDetailsVisible: false,
        UserModifyVisible : false,
        NewUserVisible: false,
        Loading: true,
        UserStatusOptions: [],
        UserRolesOptions: [],
    }

    static propTypes = {
        companyId: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = {...this.INITIAL_STATE };
        this.state.columns =  this.getColumns()
        this.state.itemActions = this.getItemActions()
    }

    componentDidMount() {
        if (this.props.companyId){
            this.setFilterConditions()
        }
        this.setOptions()
    }

    componentDidUpdate(prevProps)  {
        if (prevProps.companyId !== this.props.companyId || prevProps.view !== this.props.view){
            this.setFilterConditions()
        }
    }

    setOptions = () => {

        this.setState({
            UserStatusOptions: this.KeyValListToOptions(UserStatusKeyVal),
            UserRolesOptions: this.KeyValListToOptions(UserRolesKeyVal),
        })
    }

    KeyValListToOptions = (KeyValList) => {
        return KeyValList.map(kv => {return {label: this.props.intl.formatMessage({id: kv.value.name}),value: kv.key}})
    }

    sortString = (a, b) => {
        return a.localeCompare(b)
    }

    sortName = (a, b) => {
        return this.sortString(a.profile.first_name, b.profile.first_name)
    }

    sortLastName = (a, b) => {
        return this.sortString(a.profile.last_name, b.profile.last_name)
    }

    userProfile = (user) => {
        return user.profile || {}
    }

    getColumns = () => {
        return [
            {
                title: this.props.intl.formatMessage({id: "general.first_name"}),
                rowKey: 'first_name',
                sorter: this.sortName,
                sortDirections: ['ascend', 'descend'],
                width: '15%',
                render: (text, user) => <span>{this.userProfile(user).first_name}</span>
            },
            {
                title: this.props.intl.formatMessage({id: "general.last_name"}),
                rowKey: 'last_name',
                sorter: this.sortName,
                sortDirections: ['ascend', 'descend'],
                width: '15%',
                render: (text, user) => <span>{this.userProfile(user).last_name}</span>
            },
            {
                title: this.props.intl.formatMessage({id: "general.status"}),
                dataIndex: '',
                rowKey: 'status',
                width: '15%',
                render: (text, user) => <div>{DisplayTag(user_account_status(user.account_status))}</div>,
            },
            {
                title: this.props.intl.formatMessage({id: "general.email"}),
                dataIndex: 'profile.email',
                rowKey: 'email',
                width: '15%',
                render: (text, user) => <span>{this.userProfile(user).email}</span>
                // render: text => <span>{text}</span>,
            },
            {
                title: this.props.intl.formatMessage({id: "general.roles"}),
                dataIndex: '',
                rowKey: 'roles',
                width: '20%',
                render: (text, user, index) => <span> {Object.values(user.roles).map(role => role ?
                    <Tag color="blue" key={role.type}>
                        <IntlMessages id={ROLES[role.type].name}/>
                    </Tag>: "")}</span>,
            }
        ]
    }

    disableUser = (user) => {

        if (user instanceof CarrierUser){
            disableUser({userId: user.id}).then((res)=> {
                Notification('success', this.props.intl.formatMessage({id: "carrier.user.delete_success"}))
            }).catch(e=>{
                Notification('error', this.props.intl.formatMessage({id: "carrier.user.delete_fail"}))
            })
        }
    }

    suspendedDisplayCondition = (user) => {
        return !([USER_STATUS.suspended.key].includes(user.account_status))
    }

    getItemActions = () => {
        return [
            {label: "general.details", type:"viewItem", itemTabKey: "details"},
            {label: "general.shipment_transport_resources", type:"viewItem", itemTabKey: "resources"},
            {confirm_text: "carrier.user.delete_confirm", label:"general.delete", type:"confirm", callback: this.disableUser, displayCondition: this.suspendedDisplayCondition},
        ]
    }

    getFilterInputs = () =>{
        const { UserStatusOptions, UserRolesOptions } =  this.state

        let statusFilterDisabled
        let statusPlaceHolder
        if (this.props.view === "active") {
            statusFilterDisabled = true
            statusPlaceHolder = this.props.intl.formatMessage({id:"user.status.active.name"})
        } else if (this.props.view === "all") {
            statusFilterDisabled = false
            statusPlaceHolder = this.props.intl.formatMessage({id:"general.status"})
        }

        const filterInputs = {
            form_type: "regular",
            submit_label: this.props.intl.formatMessage({id:"general.search"}),
            formProps:{
                layout: "horizontal",
            },
            sections: [
                {
                key: "find_users",
                title: this.props.intl.formatMessage({id:"general.actions.find_users"}),
                groups: [
                    {
                    name: "find_users",
                    wrapperCol: {...getSpan(24)},
                    groupWrapper:{
                        type: "box",
                    },
                    items: [
                                {
                                    name: "user_first_name",
                                    type: "textField",
                                    formItemProps:{
                                        label : this.props.intl.formatMessage({id:"general.first_name"}),
                                        labelCol: UserFilterFormItemLabelCol,
                                        wrapperCol: UserFilterFormItemWrapperCol,
                                    },
                                    fieldProps:{
                                        placeholder: this.props.intl.formatMessage({id:"general.first_name"}),
                                    },
                                    wrapperCol: UserFilterWrapperCol
                                },
                                {
                                    name: "user_last_name",
                                    type: "textField",
                                    formItemProps:{
                                        label : this.props.intl.formatMessage({id:"general.last_name"}),
                                        labelCol: UserFilterFormItemLabelCol,
                                        wrapperCol: UserFilterFormItemWrapperCol,
                                    },
                                    fieldProps:{
                                        placeholder: this.props.intl.formatMessage({id:"general.last_name"}),
                                    },
                                    wrapperCol: UserFilterWrapperCol
                                },
                                {
                                    name: "user_email",
                                    type: "textField",
                                    formItemProps:{
                                        label : this.props.intl.formatMessage({id:"general.email"}),
                                        labelCol: UserFilterFormItemLabelCol,
                                        wrapperCol: UserFilterFormItemWrapperCol,
                                    },
                                    fieldProps:{
                                        placeholder: this.props.intl.formatMessage({id:"general.email"}),
                                    },
                                    wrapperCol: UserFilterWrapperCol
                                },
                                {
                                    name: "user_status",
                                    type: "selectField",
                                    formItemProps:{
                                        label : this.props.intl.formatMessage({id:"general.status"}),
                                        labelCol: UserFilterFormItemLabelCol,
                                        wrapperCol: UserFilterFormItemWrapperCol
                                    },
                                    fieldProps:{
                                        placeholder: statusPlaceHolder,
                                        options: UserStatusOptions,
                                        disabled: statusFilterDisabled,
                                    },
                                    wrapperCol: UserFilterWrapperCol
                                },
                                {
                                    name: "user_roles",
                                    type: "selectField",
                                    formItemProps:{
                                        label : this.props.intl.formatMessage({id:"general.roles"}),
                                        labelCol: UserFilterFormItemLabelCol,
                                        wrapperCol: UserFilterFormItemWrapperCol
                                    },
                                    fieldProps:{
                                        mode: "multiple",
                                        options: UserRolesOptions,
                                        placeholder: this.props.intl.formatMessage({id:"general.roles"}),
                                    },
                                    wrapperCol: UserFilterWrapperCol
                                },
                            ]
                        }
                    ]
                }
            ]
        }
        return filterInputs
    }

    setFilterConditions = (formValues={}) => {
        const {view} = this.props
        this.setState(setUserFilter(formValues, view, this.props.companyId, "carrier_user"))
    }

    render() {
        const {viewType, columns, queryFilterConditions, resultsFilterConditions, itemActions} = this.state

        const filterInputs = this.getFilterInputs()

        return    <div>
            <FilterBox
                title={this.props.intl.formatMessage({id: 'general.actions.find_users'})}
                formInputs={filterInputs}
                onSubmit={this.setFilterConditions}
            />
            {/* DataView is the actual table of users(in this case) being displayed */}
            <DataView itemType={"carrier_user"}
                      dataItems={this.props.users}
                      queryFilterConditions={queryFilterConditions}
                      resultsFilterConditions={resultsFilterConditions}
                      columns={columns}
                      itemActions={itemActions}
                      viewType={viewType}
                      layouts={[{key: 'table', sections:[{type: 'table', span: 24}]}]}
            />
        </div>


    }
}

Users.propTypes = {
    intl: intlShape.isRequired
}


const mapStateToProps = state => {
    return {
        companyId: state.FB.company.companyId,
    }
}

export default compose(
    connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(Users))
