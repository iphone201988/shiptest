import React, {lazy, Component} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import {injectIntl, intlShape} from "react-intl";

import {notifyError, notifySuccess} from "components/notification";
import {BoxWrapper} from "components/utility/box.style";
import FormBox from "../base/form_box";
import {optionObjectToOptionsLabelValue} from "helpers/data/mapper";
import Document, {FileAttachmentsData} from "model/document/document";
import {addDocument} from "helpers/firebase/firebase_functions/documents";
import {SHIPMENT_DOCUMENT_TYPES} from "constants/options/documents";

export const nanoid = require('nanoid');

const DOC_TYPES = require("constants/options/documents")

class NewShipmentDocument extends Component {

    constructor(props) {
        super(props);
        this.INITIAL_STATE = {
            shipmentId: undefined,
            formInputs: undefined,
            formValues: undefined,
            RedirectPage: false,
            loading: false,
            clickUpload: false,
            DocCategoryType:undefined,
            filePath: ""
        }
        this.state = {...this.INITIAL_STATE};
    }

    componentDidMount() {
        this.setOptions()
        const filePath = `Shipments/${this.props.shipmentId || ""}/Documents/${nanoid(5)}`
        this.setState({filePath: filePath})
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.clickUpload != prevState.clickUpload && this.state.clickUpload) {
            this.setFormInputs()
        }

    }

    setOptions = (options) => {

        let CATEGORY_TYPE = undefined
        if (this.props.type === "bol"){
            CATEGORY_TYPE = DOC_TYPES.BOL_TYPES
        }
        if (CATEGORY_TYPE){
            this.setState({
                DocCategoryType: optionObjectToOptionsLabelValue(CATEGORY_TYPE, this.props.intl),
            }, this.setFormInputs)
        }

    }

    onDone = () => {
        if (this.props.onDone){
            this.props.onDone()
        }
    }

    Loading = (loading) => {
        this.setState({loading: loading})
    }

    onClickSubmit = (values) => {
        // let save the form values in a state.
        this.setState({clickUpload: true, formValues: values, loading: true})
    }

    onSubmitAfterUpload = (values) => {
        // let use the form values from state
        try{
            const {formValues, filePath} = this.state
            const filesRef = values.filesRef || []

            const document = new Document(undefined, {
                name: formValues.name,
                type: this.props.type,
                category: formValues.category,
                tags: formValues.tags || [],
                information: formValues.information || "",
                reference: formValues.reference || "",
                attachments: filesRef.map(fileRef => new FileAttachmentsData({file_name: fileRef.ref.name, full_path: fileRef.ref.fullPath})),
                associated_resource: {id: this.props.shipmentId, type:"shipment"},
                attachments_path: filePath
            })
            return addDocument(document).then(res => {
                notifySuccess("notification.success.new_document", this.props.intl)
                this.Loading(false)
                this.onDone()
            }).catch(e => {
                notifyError("notification.fail.new_document", this.props.intl)
                this.Loading(false)
            })
        }catch (e){
            console.error(e)
            notifyError("notification.fail.new_document", this.props.intl)
            this.Loading(false)
        }

    }

    setFormInputs = () =>{

        const {DocCategoryType, clickUpload, filePath} = this.state
        const DocType = SHIPMENT_DOCUMENT_TYPES[this.props.type] || {name: ""}

        const formInputs = {
            form_type: "regular",
            submit_label: this.props.intl.formatMessage({id:"general.submit"}),
            formProps:{
                layout: "horizontal"
            },
            sections: [
                {
                    name: "name",
                    size: "full",
                    items: [
                        {
                            name: "name",
                            type: "textField",
                            formItemProps:{
                                rules:[
                                    {
                                        required: true
                                    }
                                ],
                                label : this.props.intl.formatMessage({id:"document.field.name.label"}),
                                labelCol: {
                                    span: 4
                                },
                                wrapperCol: {
                                    span: 20
                                },
                                initialValue: this.props.intl.formatMessage({id:DocType.default_name}),
                            },
                            fieldProps:{
                                placeholder: this.props.intl.formatMessage({id:"carrier.vehicle.name"}),
                            },
                        },
                        {
                            name: "category",
                            type: "selectField",
                            formItemProps:{
                                rules:[
                                    {
                                        required: true
                                    }
                                ],
                                label : this.props.intl.formatMessage({id:"document.field.category.label"}),
                                labelCol: {
                                    span: 4
                                },
                                wrapperCol: {
                                    span: 20
                                },
                                initialValue: 'straight'
                            },
                            fieldProps:{
                                options: DocCategoryType,
                                placeholder: this.props.intl.formatMessage({id:"document.field.type.placeholder"}),
                            },
                        },
                        {
                            name: "reference",
                            type: "textField",
                            formItemProps:{
                                rules:[
                                    {
                                        required: false
                                    }
                                ],
                                label : this.props.intl.formatMessage({id:"document.field.reference.label"}),
                                labelCol: {
                                    span: 4
                                },
                                wrapperCol: {
                                    span: 20
                                },
                            },
                            fieldProps:{
                                placeholder: this.props.intl.formatMessage({id:"document.field.reference.placeholder"}),
                            },
                        },{
                            name: "information",
                            type: "textField",
                            formItemProps:{
                                rules:[
                                    {
                                        required: false
                                    }
                                ],
                                label : this.props.intl.formatMessage({id:"document.field.information.label"}),
                                labelCol: {
                                    span: 4
                                },
                                wrapperCol: {
                                    span: 20
                                },
                            },
                            fieldProps:{
                                placeholder: this.props.intl.formatMessage({id:"document.field.information.placeholder"}),
                            },
                        },
                        {
                            name: "tags",
                            type: "tagField",
                            formItemProps:{
                                label : this.props.intl.formatMessage({id: 'document.field.tags.label'}),
                                labelCol: {
                                    span: 4
                                },
                                wrapperCol: {
                                    span: 20
                                },
                            },
                            fieldProps:{
                                placeholder: this.props.intl.formatMessage({id: 'document.field.tags.placeholder'}),
                            },
                        },
                        {
                            name: "attachments",
                            type: "filesUploader",
                            formItemProps:{
                                rules:[
                                    {
                                        required: true
                                    }
                                ],
                                label : this.props.intl.formatMessage({id:"document.field.attachments.label"}),
                                labelCol: {
                                    span: 4
                                },
                                wrapperCol: {
                                    span: 20
                                },
                            },
                            fieldProps:{
                                clickUpload: clickUpload,
                                filePath: filePath,
                                onSuccess: this.onSubmitAfterUpload,
                                name: 'files',
                                multiple: true,
                                showUploadList: {
                                    showDownloadIcon: true,
                                    downloadIcon: 'download ',
                                    showRemoveIcon: true,
                                    // removeIcon: <StarOutlined onClick={e => console.log(e, 'custom removeIcon event')} />,
                                },
                            },
                        }
                    ]
                }
            ]
        }
        this.setState({formInputs: formInputs})
    }

    render() {

        const {formInputs,loading} = this.state

        return (
            <BoxWrapper>
                {formInputs ?
                    <FormBox
                        title={this.props.intl.formatMessage({id: 'users.actions.add_document'})}
                        formInputs={formInputs}
                        onSubmit={this.onClickSubmit}
                        loading={loading}
                    />: ""}
            </BoxWrapper>
        )

    }
}

NewShipmentDocument.propTypes = {
    intl: intlShape.isRequired
}

export default compose(connect(), firebaseConnect())(injectIntl(NewShipmentDocument))