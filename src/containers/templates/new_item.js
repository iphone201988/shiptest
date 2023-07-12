import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {injectIntl, intlShape} from "react-intl";
import {compose} from "redux";
import {firebaseConnect} from "react-redux-firebase";
import Loader from "components/utility/loader";
import {BoxWrapper} from "components/utility/box.style";
import FormBox from "../base/form_box";


class newItem extends PureComponent {

    constructor(props) {
        super(props);
        this.INITIAL_STATE = {
            formInputs: undefined,
            formUpdated: false,
            loading: false,
        }
        this.state = { ...this.INITIAL_STATE };
    }

    componentDidMount() {
        this.setOptions()
    }

    componentDidUpdate(prevProps){
        this.setOptions()
    }

    setOptions = () => {
        this.setFormInputs()
    }

    setFormInputs = () =>{
        const formInputs = {}
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
                        title={this.props.intl.formatMessage({id: ''})}
                        formInputs={formInputs}
                        onSubmit={this.onSubmit}
                        onFormFieldChanged={this.onFormFieldChanged}
                    />: ""}
            </BoxWrapper>
        )
    }
}

newItem.propTypes = {
    intl: intlShape.isRequired,
};

const mapStateToProps = state => {
    return {}
}

export default compose(
    connect(mapStateToProps, {}),
    firebaseConnect()
)(injectIntl(newItem))
