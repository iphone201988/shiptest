import {PureComponent} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {injectIntl, intlShape} from "react-intl";
import {BoxWrapper} from "components/utility/box.style";
import FormBox from "../base/form_box";

import Loader from "components/utility/loader";
import {firebaseConnect} from "react-redux-firebase";

export class Authorities extends PureComponent {

    INITIAL_STATE = {
        formInputs: undefined
    }
    constructor(props) {
        super(props);
        this.state = {...this.INITIAL_STATE};
    }

    componentDidMount() {
        this.setOptions()
    }

    componentDidUpdate(prevProps) {
        this.setOptions()
    }

    setOptions = () => {
		this.setFormInputs()
	}

    setFormInputs = () =>{
        const {roles_options, carrier} = this.state

        const formInputs = {
            form_type: "regular",
            submit_label: this.props.intl.formatMessage({id:"general.submit"}),
            formProps:{
                layout: "horizontal",
                // initialValues: carrier ? {company_name: (carrier.profile.name)} : {}
            },
            sections: [
                {
                    key: "company",
                    size: "full",
                    title: this.props.intl.formatMessage({id:"general.email"}),
                    items: [
                        {
                            name: "company_name",
                            type: "textField",
                            formItemProps:{
                                initialValue: (carrier ?  carrier.profile.name :""),
                                rules:[
                                    {
                                        required: true,
                                        message: this.props.intl.formatMessage({id: 'carrier.signup.validation.enter_company'}),
                                    }
                                ],
                                label : this.props.intl.formatMessage({id:"general.company_name"}),
                                labelCol: {
                                    span: 2
                                },
                                wrapperCol: {
                                    span: 22
                                },
                            },
                            fieldProps:{
                                placeholder: this.props.intl.formatMessage({id:"general.company_name"}),
                            },
                        },
                    ]
                }]
        }
        this.setState({formInputs: formInputs})
    }

    render() {
        const {loading, formInputs} = this.state;

        if (loading) {
            return <Loader></Loader>
        }

        return (
            <BoxWrapper>
                {formInputs ?
                    <FormBox
                        title={this.props.intl.formatMessage({id: 'company'})}
                        formInputs={formInputs}
                        onSubmit={this.onSubmit}
                    /> : ""}
            </BoxWrapper>
        )
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firebaseConnect()
)(injectIntl(Authorities))

