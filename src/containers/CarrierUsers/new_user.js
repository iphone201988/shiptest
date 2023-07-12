import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {injectIntl, intlShape} from "react-intl";
import {compose} from "redux";
import {firebaseConnect} from "react-redux-firebase";
import Loader from "components/utility/loader";
import {BoxWrapper} from "components/utility/box.style";
import FormBox from "../base/form_box";
import {notifyError, notifySuccess} from "components/notification";
import {addUser} from "helpers/firebase/firebase_functions/users";
import User from "model/user/user";
import {ROLES} from "constants/options/user";

class UserForm extends PureComponent {

    constructor(props) {
        super(props);
        this.INITIAL_STATE = {
            formInputs: undefined, 
            user: undefined,
            loading: false,
            roles_options: Object.keys(ROLES).map(key => {
                return {label: this.props.intl.formatMessage({id: ROLES[key].name}) , value: key}
            })
        }
        this.state = { ...this.INITIAL_STATE };
    }

    componentDidMount() {
        if (this.props.user !== undefined){
            this.setState({user: this.props.user}, this.setOptions);
        }
        this.setOptions()
    }
    
    componentDidUpdate(prevProps){
        if (prevProps.user !== this.props.user){
            this.setState({user: this.props.user}, this.setOptions);
        }
    }
    
    setOptions = () => {
        this.setFormInputs()
    }

    setFormInputs = () =>{
        const {roles_options} = this.state

        const formInputs = {
            form_type: "regular",
            submit_label: this.props.intl.formatMessage({id:"general.submit"}),
            formProps:{
                layout: "horizontal",
            },
            sections: [
                {
                    key: "new_user",
                    size: "full",
                    title: this.props.intl.formatMessage({id:"general.email"}),
                    items: [
                        {
                            name: "email",
                            type: "textField",
                            formItemProps:{
                                initialValue: "",
                                rules:[{ type: 'email', required: true }],
                                label : this.props.intl.formatMessage({id:"general.email"}),
                                labelCol: {
                                    span: 2
                                },
                                wrapperCol: {
                                    span: 22
                                },
                            },
                            fieldProps:{
                                placeholder: this.props.intl.formatMessage({id:"general.email"}),
                            },
                        },
                        {
                            name: "first_name",
                            type: "textField",
                            formItemProps:{
                                rules:[],
                                label : this.props.intl.formatMessage({id:"general.first_name"}),
                                labelCol: {
                                    span: 2
                                },
                                wrapperCol: {
                                    span: 22
                                },
                            },
                            fieldProps:{
                                placeholder: this.props.intl.formatMessage({id:"general.first_name"}),
                            },
                        },
                        {
                            name: "last_name",
                            type: "textField",
                            formItemProps:{
                                rules:[],
                                label : this.props.intl.formatMessage({id:"general.last_name"}),
                                labelCol: {
                                    span: 2
                                },
                                wrapperCol: {
                                    span: 22
                                },
                            },
                            fieldProps:{
                                placeholder: this.props.intl.formatMessage({id:"general.last_name"}),
                            },
                        },
                        {
                            name: "phone_number",
                            type: "phoneField",
                            formItemProps:{
                                rules:[{required:true}],
                                label : this.props.intl.formatMessage({id:"general.phone_number"}),
                                labelCol: {
                                    span: 2
                                },
                                wrapperCol: {
                                    span: 22
                                },
                            },
                            fieldProps:{
                                placeholder: this.props.intl.formatMessage({id:"general.phone_number"}),
                            },
                        },
                        {
                            name: "roles",
                            type: "CheckboxGroup",
                            formItemProps:{
                                rules:[],
                                label : this.props.intl.formatMessage({id:"general.roles"}),
                                labelCol: {
                                    span: 2
                                },
                                wrapperCol: {
                                    span: 22
                                },
                            },
                            fieldProps:{
                                options: roles_options,
                                placeholder: this.props.intl.formatMessage({id:"general.roles"}),
                            },
                        },
                        ]
                }
            ]
        }
        this.setState({formInputs: formInputs})
    }

    loading = (loading) => {
        this.setState({loading: loading})
    }

    handleReset = () =>{

    }

    onDone = () => {
        if (this.props.onDone){
            this.handleReset()
            this.props.onDone()
        }
    }

    onSubmit = (values) => {
        this.loading(true)
        const roles = (values.roles || []).map(role =>  ({type: role}))

        let userData = {profile: {email: values.email ,first_name: values.first_name,
                last_name: values.last_name, phone: values.phone_number, domain: "carrier"}, roles: roles
        }
        const user = new User(undefined, userData)

        return addUser(user).then(res => {
            notifySuccess("notification.success.new_user", this.props.intl)
            this.onDone()
            this.loading(false)
        }).catch(e => {
            notifyError("notification.fail.new_user", this.props.intl)
            this.loading(false)
        })
    }

    render() {
        const {loading, formInputs} = this.state;

        if(loading){
            return <Loader></Loader>
        }
        return (
            <BoxWrapper>
                {formInputs ?
                    <FormBox
                        title={this.props.intl.formatMessage({id: 'users.actions.add_user'})}
                        formInputs={formInputs}
                        onSubmit={this.onSubmit}
                    />: ""}
            </BoxWrapper>
        )
    }
}

UserForm.propTypes = {
    intl: intlShape.isRequired,
};

const mapStateToProps = state => {
    return {
        user: state.FB.companyUser
    }
}

export default compose(
    connect(mapStateToProps, {}),
    firebaseConnect()
)(injectIntl(UserForm))
