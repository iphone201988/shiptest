import React, {lazy, Component} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import {injectIntl, intlShape} from "react-intl";

import {notifyError, notifySuccess} from "components/notification";
import {BoxWrapper} from "components/utility/box.style";
import FormBox from "../../base/form_box";
import {optionObjectToOptionsLabelValue} from "helpers/data/mapper";
import {FileAttachmentsData} from "model/document/document";
import {addDocument} from "helpers/firebase/firebase_functions/documents";
import {CANADIAN_PROVINCES, US_STATES} from "constants/geolocations";
import VehicleRegistrationDocument from "model/document/vehicle_registration_document"
export const nanoid = require('nanoid');

const DOC_TYPES = require("constants/options/documents")
const COUNTRY_REGIONS_MAP = {
    'canada': CANADIAN_PROVINCES,
    'usa': US_STATES,
}

const defaultCountry = 'canada'

class NewVehicleDocument extends Component {

    constructor(props) {
        super(props);
        this.INITIAL_STATE = {
            assetId: undefined,
            documentId: undefined,
            formInputs: undefined,
            formValues: undefined,
            RedirectPage: false,
            loading: false,
            clickUpload: false,
            DocCategoryType:undefined,
            filePath: "",
            countryStatesOptions: optionObjectToOptionsLabelValue(COUNTRY_REGIONS_MAP[defaultCountry], this.props.intl),
        }
        this.state = {...this.INITIAL_STATE};
    }

    componentDidMount() {
        const docId = nanoid(5)
        if (this.props.assetId){
            this.setState({filePath: `Vehicles/${this.props.assetId}/Documents/${docId}`})
        }
    }

    componentDidUpdate(prevProps, prevState) {
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
            const document = new VehicleRegistrationDocument(undefined, {
                name: 'Vehicle Document', 
                type: this.props.type,
                visibility: formValues.visibility,
                country: formValues.country,
                province_state: formValues.province_state || "",
                permit_number: formValues.permit_number || "",
                license_plate: formValues.license_plate || "",
                effective_to_expiry_date: formValues.effective_to_expiry_date || "",
                attachments: filesRef.map(fileRef => new FileAttachmentsData({file_name: fileRef.ref.name, full_path: fileRef.ref.fullPath})),
                associated_resource: {id: this.props.assetId, type:"asset"},
                attachments_path: filePath
            })
            console.log('date', document)
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
    onCountrySelect = (country) => {
        const countryRegions = COUNTRY_REGIONS_MAP[country]
        if (countryRegions){
            this.setState({countryStatesOptions : optionObjectToOptionsLabelValue(countryRegions, this.props.intl)})
        }
    }


    getFormInputs = () =>{

        const {clickUpload, filePath} = this.state
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
                            name: "visibility",
                            type: "selectField",
                            formItemProps:{
                                rules:[
                                    {
                                        required: true
                                    }
                                ],
                                label : 'Visibility',
                                labelCol: {
                                    span: 4
                                },
                                wrapperCol: {
                                    span: 20
                                },
                                initialValue: 'private'
                            },
                            fieldProps:{
                                options: [{label: 'Private', value: 'private'}, {label: 'Public', value: 'public'}],
                                placeholder: this.props.intl.formatMessage({id:"carrier.vehicle.name"}),
                            },
                        },
                        {
                            name: "country",
                            type: "selectField",
                            formItemProps:{
                                rules:[
                                    {
                                        required: true
                                    }
                                ],
                                initialValue: defaultCountry,

                                label : this.props.intl.formatMessage({id:"checkout.billingform.country"}),
                                labelCol: {
                                    span: 4
                                },
                                wrapperCol: {
                                    span: 20
                                },
                            },
                            fieldProps:{
                                onSelect: this.onCountrySelect,
                                options: [{label: this.props.intl.formatMessage({id:"geo.country.canada"}), value: "canada"}, {label: this.props.intl.formatMessage({id:"geo.country.us"}), value: "usa"}],
                                placeholder: this.props.intl.formatMessage({id:"checkout.billingform.country"}),
                            },
                        },
                        {
                            name: "province_state",
                            type: "selectField",
                            formItemProps:{
                                rules:[
                                    {
                                        required: false
                                    }
                                ],
                                label : this.props.intl.formatMessage({id:"general.province_state"}),
                                labelCol: {
                                    span: 4
                                },
                                wrapperCol: {
                                    span: 20
                                },
                            },
                            fieldProps:{
                                showSearch: true,
                                options: this.state.countryStatesOptions,
                                placeholder: this.props.intl.formatMessage({id:"general.province_state"}),
                            },
                        },
                        {
                            name: "permit_number",
                            type: "textField",
                            formItemProps:{
                                rules:[
                                    {
                                        required: false
                                    }
                                ],
                                label : this.props.intl.formatMessage({id:"general.permit_number"}),
                                labelCol: {
                                    span: 4
                                },
                                wrapperCol: {
                                    span: 20
                                },
                            },
                            fieldProps:{
                                placeholder: this.props.intl.formatMessage({id:"general.permit_number"}),
                            },
                        },
                        {
                            name: "license_plate",
                            type: "textField",
                            formItemProps:{
                                label : this.props.intl.formatMessage({id:"carrier.vehicle.license_plate"}),
                                labelCol: {
                                    span: 4
                                },
                                wrapperCol: {
                                    span: 20
                                },
                            },
                            fieldProps:{
                                placeholder: this.props.intl.formatMessage({id:"carrier.vehicle.license_plate"}),
                            },
                        },
                        {
                            name: "effective_to_expiry_date",
                            type: "DateRangePickerField",
                            formItemProps:{
                                label : this.props.intl.formatMessage({id:"general.effective_to_expiry_date"}),
                                labelCol: {
                                    span: 4
                                },
                                wrapperCol: {
                                    span: 20
                                },
                            },
                            fieldProps:{
                                //{... (this.state.fieldProps || {})} showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" onOk={this.onSelect}
                                showTime: {},
                                format: "YYYY-MM-DD",
                                placeholder: this.props.intl.formatMessage({id:"general.address.placeholder.additional_info"}),
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
        return formInputs
        // this.setState({formInputs: formInputs})
    }

    render() {

        const { loading } = this.state
        const formInputs = this.getFormInputs()
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

NewVehicleDocument.propTypes = {
    intl: intlShape.isRequired
}

export default compose(connect(), firebaseConnect())(injectIntl(NewVehicleDocument))