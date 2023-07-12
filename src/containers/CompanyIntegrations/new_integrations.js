import React, {PureComponent}  from "react";
import {injectIntl, intlShape}  from "react-intl";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import Loader from "components/utility/loader";
import {BoxWrapper} from "components/utility/box.style";
import FormBox from "../base/form_box";
import {optionObjectToOptionsLabelValue} from "helpers/data/mapper";
import {getIntegrationProvider, INTEGRATION_PROVIDERS, INTEGRATION_CATEGORIES} from "model/manager/integration/integrations_map";


class NewIntegration extends PureComponent {

    constructor(props) {
        super(props);
        this.INITIAL_STATE = {
            formInputs: undefined, 
            integrationCategories: [],
            integrationProviders:[],
            providerAuthorizeForm: "",
            authorizeFormVisible: false,
            providerAuthorizeUrl: ""
        }
        this.state = { ...this.INITIAL_STATE };
    }

    componentDidMount() {
        this.setOptions()
    }

    componentDidUpdate() {
        // this.setOptions()
    }

    setOptions = (options) => {
        this.setState({
            integrationCategories: optionObjectToOptionsLabelValue(INTEGRATION_CATEGORIES, this.props.intl),
            integrationProviders: optionObjectToOptionsLabelValue(INTEGRATION_PROVIDERS, this.props.intl )
        }, this.setFormInputs)
    }

    onSubmit = (values) => {
        const  authForm = this.integrationAuthorizeProvider(values.provider)
        this.setState({
            providerAuthorizeForm: authForm,
            authorizeFormVisible: true
        })
    }

    integrationAuthorizeProvider = (provider) => {
        const providerMap =  getIntegrationProvider(provider) ;
        const api = providerMap.api
        return window.location.replace(api.getAuthorizeUrl());
    }

    setFormInputs = () =>{
        const {integrationCategories, integrationProviders} = this.state

        const formInputs = {
            form_type: "regular",
            submit_label: this.props.intl.formatMessage({id:"integration.action.add"}),
            formProps:{
                layout: "horizontal",
            },
            sections: [
                {
                    key: "new_integration",
                    size: "full",
                    title: this.props.intl.formatMessage({id:"general.type"}),
                    items: [
                        {
                            name: "provider",
                            type: "selectField",
                            formItemProps:{
                                hasFeedback: true,
                                label : this.props.intl.formatMessage({id:"integration.providers"}),
                                labelCol: {
                                    span: 2
                                },
                                wrapperCol: {
                                    span: 22
                                },
                            },
                            fieldProps:{
                                placeholder: this.props.intl.formatMessage({id:"integration.providers.select"}),
                                options: integrationProviders,
                                // onSelect: (value, option) => this.onSelectProvider(value)
                            },
                        }
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
                {/*<Modal visible={authorizeFormVisible}>{providerAuthorizeForm}</Modal>*/}

            </BoxWrapper>
        )
    }
}

const mapStateToProps = state => {
    return {
        companyId: state.FB.company.companyId,
    }
}

NewIntegration.propTypes = {
    intl: intlShape.isRequired
}

export default compose(
    connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(NewIntegration))
