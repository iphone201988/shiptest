import React, {PureComponent} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {injectIntl, intlShape} from "react-intl";

import FormBox from "../../base/form_box";
import {optionObjectToOptionsLabelValue} from "helpers/data/mapper";
import {SHIPMENT_DOCUMENT_TYPES} from "constants/options/documents";
import NewVehicleDocument from "./new_vehicle_document"
import {BoxWrapper} from "components/utility/box.style";


class NewVehicleDocumentSelect extends PureComponent  {

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

    setOptions = (options) => {
        this.setState({ documentOptions: optionObjectToOptionsLabelValue(SHIPMENT_DOCUMENT_TYPES, this.props.intl)},  this.setFormInputs)
    }

    onDocumentTypeSelected = (value) => {
        console.log(value)
        this.setState({documentType: value})
    }

    setFormInputs = () =>{

        const {documentOptions} = this.state
        console.log('document options', documentOptions)
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
                                options: [{label: 'Vehicle Registration', value: 'vehicle_registration'}],
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
        const {assetId} = this.props
        if (Object.keys(SHIPMENT_DOCUMENT_TYPES).includes(documentType)){
            return <NewVehicleDocument type={documentType} onDone={this.onDone} assetId={assetId}></NewVehicleDocument>
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

NewVehicleDocumentSelect.propTypes = {
    intl: intlShape.isRequired
}

export default compose(connect())(injectIntl(NewVehicleDocumentSelect))
