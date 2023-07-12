import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {injectIntl, intlShape} from "react-intl";
import {compose} from "redux";
import {firebaseConnect} from "react-redux-firebase";
import Loader from "components/utility/loader";
import {BoxWrapper} from "components/utility/box.style";
import FormBox from "../base/form_box";
import {notifyError, notifySuccess} from "components/notification";
import {addRate} from "helpers/firebase/firebase_functions/rates";
import CarrierTransportRate from "model/rate/carrier_transport_rate";
import {ROLES} from "constants/options/user";

class NewCarrierRateForm extends PureComponent {

    constructor(props) {
        super(props);
        this.INITIAL_STATE = {
            formInputs: undefined, 
            rate: undefined,
            loading: false,
            roles_options: Object.keys(ROLES).map(key => {
                return {label: this.props.intl.formatMessage({id: ROLES[key].name}) , value: key}
            })
        }
        this.state = { ...this.INITIAL_STATE };
    }

    componentDidMount() {
        this.setOptions()
    }

    setOptions = () => {
        this.setFormInputs()
    }

    setFormInputs = () =>{

        const formInputs = {
            form_type: "regular",
            submit_label: this.props.intl.formatMessage({id:"general.submit"}),
            formProps:{
                layout: "horizontal",
            },
            sections: [
                {
                    key: "new_rate",
                    size: "full",
                    title: this.props.intl.formatMessage({id:"carrier.rates.rates"}),
                    items: [
                        {
                            name: "fuel_baseline",
                            type: "numberField",
                            formItemProps:{
                                initialValue: 0,
                                rules:[
                                        {
                                            required: true
                                        }
                                ],
                                label : this.props.intl.formatMessage({id:"carrier.rates.fuel_baseline"}),
                                labelCol: {
                                    span: 3
                                },
                                wrapperCol: {
                                    span: 21
                                },
                            },
                            fieldProps:{
                                placeholder: this.props.intl.formatMessage({id:"carrier.rates.fuel_baseline"}),
                            },
                        },
                        {
                            name: "fuel_economy",
                            type: "numberField",
                            formItemProps:{
                                rules:[{required: true}],
                                label : this.props.intl.formatMessage({id:"carrier.rates.fuel_economy"}),
                                labelCol: {
                                    span: 3
                                },
                                wrapperCol: {
                                    span: 21
                                },
                            },
                            fieldProps:{
                                placeholder: this.props.intl.formatMessage({id:"carrier.rates.fuel_economy"}),
                            },
                        },
                        {
                            name: "origin",
                            type: "addressField",
                            formItemProps:{
                                hasFeedback: true,
                                label : this.props.intl.formatMessage({id:"location.origin"}),
                                labelCol: {
                                    span: 3
                                },
                                wrapperCol: {
                                    span: 21
                                },
                            },
                            fieldProps:{
                                placeholder: this.props.intl.formatMessage({id:"general.address.placeholder.search_select"}),
                            },
                        },
                        {
                            name: "destination",
                            type: "addressField",
                            formItemProps:{
                                hasFeedback: true,
                                label : this.props.intl.formatMessage({id:"location.destination"}),
                                labelCol: {
                                    span: 3
                                },
                                wrapperCol: {
                                    span: 21
                                },
                            },
                            fieldProps:{
                                placeholder: this.props.intl.formatMessage({id:"general.address.placeholder.search_select"}),
                            },
                        },
                        {
                            name: "linehaul",
                            type: "numberField",
                            formItemProps:{
                                rules:[
                                    {
                                        required: true
                                    }
                                ],
                                label : this.props.intl.formatMessage({id:"carrier.rates.linehaul"}),
                                labelCol: {
                                    span: 3
                                },
                                wrapperCol: {
                                    span: 21
                                },
                            },
                            fieldProps:{
                                placeholder: this.props.intl.formatMessage({id:"carrier.rates.linehaul"}),
                            },
                        },
                        {
                            name: "min_linehaul",
                            type: "numberField",
                            formItemProps:{
                                rules:[
                                    {
                                        required: true
                                    }
                                ],
                                label : this.props.intl.formatMessage({id:"carrier.rates.min_linehaul"}),
                                labelCol: {
                                    span: 3
                                },
                                wrapperCol: {
                                    span: 21
                                },
                            },
                            fieldProps:{
                                placeholder: this.props.intl.formatMessage({id:"carrier.rates.min_linehaul"}),
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

        let rateData = {
            origin: values.origin,
            destination: values.destination,
            rate_info: {
                fuel_rate: {
                    baseline: values.fuel_baseline,
                    economy: values.fuel_economy
                },
                linehaul_rate: {
                    min_linehaul: values.min_linehaul, 
                    linehaul: values.linehaul || 0, is_dynamic:values.is_dynamic || false
                }
            }
        }

        const rate = new CarrierTransportRate(undefined, rateData)
        return addRate(rate).then(res => {
            notifySuccess("notification.success.new_rate", this.props.intl)
            this.onDone()
            this.loading(false)
        }).catch(e => {
            notifyError("notification.fail.new_rate", this.props.intl)
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
                        title={this.props.intl.formatMessage({id: 'carrier.rates.find_rate'})}
                        formInputs={formInputs}
                        onSubmit={this.onSubmit}
                    />: ""}
            </BoxWrapper>
        )
    }
}

NewCarrierRateForm.propTypes = {
    intl: intlShape.isRequired,
};

const mapStateToProps = state => {
    return {}
}

export default compose(
    connect(mapStateToProps, {}),
    firebaseConnect()
)(injectIntl(NewCarrierRateForm))
