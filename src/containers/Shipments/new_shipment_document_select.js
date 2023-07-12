import React, {PureComponent} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {injectIntl, intlShape} from "react-intl";
import FormBox from "../base/form_box";
import {optionObjectToOptionsLabelValue} from "helpers/data/mapper";
import {SHIPMENT_DOCUMENT_TYPES} from "constants/options/documents";
import NewShipmentDocument from "./new_shipment_document"
import {BoxWrapper} from "components/utility/box.style";


class NewShipmentDocumentSelect extends PureComponent  {

    INITIAL_STATE = {
        documentType: undefined,
        documentOptions: [],
        formInputs: {}
    }

    constructor(props) {
        super(props);
        this.state = { ...this.INITIAL_STATE };
    }

    componentDidMount() {
        this.setOptions()
    }

    componendtDidUpdate() {
        this.setFormInputs()
    }

    setOptions = (options) => {
        this.setState({ documentOptions: optionObjectToOptionsLabelValue(SHIPMENT_DOCUMENT_TYPES, this.props.intl)},  this.setFormInputs)
    }

    onDocumentTypeSelected = (value) => {
        this.setState({documentType: value})
    }

    setFormInputs = () =>{

        const {documentOptions} = this.state

        const formInputs = {
            form_type: "regular",

            formProps:{
                layout: "horizontal"
            },
            sections: [
                {
                    type: "noButtons",
                    name: "name",
                    size: "full",
                    items: [
                        {
                            name: "name",
                            type: "selectField",
                            formItemProps: {
                                rules: [
                                    {
                                        required: true
                                    }
                                ],
                                label: this.props.intl.formatMessage({id: "document.field.type.label"}),
                                labelCol: {
                                    span: 4
                                },
                                wrapperCol: {
                                    span: 20
                                },
                            },
                            fieldProps:{
                                onSelect: this.onDocumentTypeSelected,
                                placeholder: this.props.intl.formatMessage({id:"document.field.type.label"}),
                                options: documentOptions,
                            },
                        }]
                }
                ]
        }
        this.setState({formInputs: formInputs})
    }


    onDone = () =>  {
        if (this.props.onDone){
            this.props.onDone()
        }
    }

    handleReset = () => {
        this.setState(this.INITIAL_STATE)
    }

    renderTabContent = () => {
        const {documentType} = this.state
        const {shipmentId} = this.props

        if (Object.keys(SHIPMENT_DOCUMENT_TYPES).includes(documentType)){
            return <NewShipmentDocument type={documentType} onDone={this.onDone} shipmentId={shipmentId}></NewShipmentDocument>
        }else{
            return ""
        }
    }

    render() {
        const {formInputs} = this.state
        return (
            <BoxWrapper>
                {formInputs ?
                    <FormBox
                        title={this.props.intl.formatMessage({id: 'documents.shipment.title'})}
                        formInputs={formInputs}
                    />: ""
                }
                {this.renderTabContent()}
            </BoxWrapper>
        )
    }
}

NewShipmentDocumentSelect.propTypes = {
    intl: intlShape.isRequired
}

export default compose(connect())(injectIntl(NewShipmentDocumentSelect))
