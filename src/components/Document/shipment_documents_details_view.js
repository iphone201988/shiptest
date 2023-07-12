import React, {Component}  from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import {injectIntl, intlShape}  from "react-intl";
import {BoxWrapper} from "components/utility/box.style";
import FormBox from "containers/base/form_box";
import Document, {FileAttachmentsData} from "model/document/document";
import {addDocument, updateDocument} from "helpers/firebase/firebase_functions/documents";
import {notifyError, notifySuccess} from "../notification";
import {optionObjectToOptionsLabelValue} from "helpers/data/mapper";
import {statesAndProvinces} from "constants/geolocations";
import * as DOC_TYPES from "constants/options/documents";

class DocumentDetailsView extends Component {

    constructor(props){
        super(props);
    }

    state = {
        formInputs: undefined,
        clickUpload: false
    }

    componentDidMount() {
        this.setOptions()
        console.log(statesAndProvinces)
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.clickUpload !== prevState.clickUpload && this.state.clickUpload) {
            this.setFormInputs()
        }
    }

    setOptions = () => {
        const {document} = this.props

        let CATEGORY_TYPE = undefined
        if (document.type === "bol"){
            CATEGORY_TYPE = DOC_TYPES.BOL_TYPES
            this.setBolFormInputs()
        }
        if (CATEGORY_TYPE){
            this.setState({
                DocCategoryType: optionObjectToOptionsLabelValue(CATEGORY_TYPE, this.props.intl),
            }, this.setBolFormInputs)
        }
    }

    Loading = (loading) => {
        this.setState({loading: loading})
    }

    setFormInputs = () => {
        const {document} = this.props
        let CATEGORY_TYPE = undefined
        this.KeyValListToOptionsLocations()

        if (document.type === "bol"){
            CATEGORY_TYPE = DOC_TYPES.BOL_TYPES
            this.setBolFormInputs()
        }
    }

    KeyValListToOptionsLocations = () => {
        const locations = optionObjectToOptionsLabelValue(statesAndProvinces, this.props.intl)
        return locations
    }

    setBolFormInputs = () => {
        const {clickUpload, DocCategoryType} = this.state
        const {document} = this.props
        const filePath = document.attachments_path

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
                                initialValue: document.name || ""
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
                                initialValue: document.category || ""
                            },
                            fieldProps:{
                                options: DocCategoryType,
                                placeholder: this.props.intl.formatMessage({id:"document.category.placeholder"}),
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
                                initialValue: document.reference || ""
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
                                initialValue: document.information || ""
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
                                initialValue:  document.tags || []
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
                                        required: false
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
                                initialFiles: document.attachments,
                                clickUpload: clickUpload,
                                filePath: filePath,
                                onSuccess: this.onSubmitAfterUpload,
                                name: 'files',
                                multiple: true,
                                openFileDialogOnClick: true
                            },
                        }
                    ]
                }
            ]
        }

        this.setState({formInputs: formInputs})

    }

    onClickSubmit = (values) => {
        // let save the form values in a state.
        this.setState({clickUpload: true, formValues: values, loading: true})
    }

    onDone = () => {
        if (this.props.onCloseDetail){
            this.props.onCloseDetail()
        }
    }

    onSubmitAfterUpload = (values) => {
        // let use the form values from state
        try{
            const {formValues} = this.state
            const {document} = this.props

            const filesRef = values.filesRef || []
            const filePath = document.attachments_path

            if(document.type === "bol") {
                const new_document = new Document(document.id, {
                    name: formValues.name,
                    type: document.type,
                    category: formValues.category,
                    tags: formValues.tags || [],
                    information: formValues.information || "",
                    reference: formValues.reference || "",
                    attachments: filesRef.map(fileRef => new FileAttachmentsData({file_name: fileRef.ref.name, full_path: fileRef.ref.fullPath})),
                    attachments_path: document.attachments_path
                })
                return updateDocument(new_document).then(res => {
                    notifySuccess("notification.success.new_document", this.props.intl)
                    this.onDone()
                    this.Loading(false)
                }).catch(e => {
                    notifyError("notification.fail.new_document", this.props.intl)
                    this.Loading(false)
                })    
            }
        }catch (e){
            console.error(e)
            notifyError("notification.fail.new_document", this.props.intl)
            this.Loading(false)
        }
    }


    render() {
        const {formInputs} = this.state

        return (
            <BoxWrapper>
                {formInputs ?
                    <FormBox
                        title={this.props.intl.formatMessage({id: 'document.view_details.title'})}
                        formInputs={formInputs}
                        onSubmit={this.onClickSubmit}
                    />: ""}
            </BoxWrapper>
        )
    }
}

DocumentDetailsView.propTypes = {
    intl: intlShape.isRequired
}

const mapStateToProps = state => {
    return {
        firebase: state.FB.firebase,
        companyId: state.FB.company.companyId,
    }
}

export default compose(
    connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(DocumentDetailsView))
