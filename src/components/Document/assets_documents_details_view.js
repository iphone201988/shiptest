import React, {Component}  from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import {injectIntl, intlShape}  from "react-intl";
import {BoxWrapper} from "components/utility/box.style";
import FormBox from "containers/base/form_box";
import {FileAttachmentsData} from "model/document/document";
import {updateDocument} from "helpers/firebase/firebase_functions/documents";
import {notifyError, notifySuccess} from "../notification";
import {optionObjectToOptionsLabelValue} from "helpers/data/mapper";
import {CANADIAN_PROVINCES, US_STATES, statesAndProvinces} from "constants/geolocations";
import VehicleRegistrationDocument from "model/document/vehicle_registration_document"
import moment from 'moment'

const COUNTRY_REGIONS_MAP = {
    'canada': CANADIAN_PROVINCES,
    'usa': US_STATES,
}

const defaultCountry = 'canada'

class DocumentDetailsView extends Component {

    constructor(props){
        super(props);
        this.INITIAL_STATE = {
            formInputs: undefined,
            clickUpload: false,    
            countryStatesOptions: optionObjectToOptionsLabelValue(COUNTRY_REGIONS_MAP[defaultCountry], this.props.intl),
        }
        this.state = { ...this.INITIAL_STATE}
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
    }

    Loading = (loading) => {
        this.setState({loading: loading})
    }

    onCountrySelect = (country) => {
        const countryRegions = COUNTRY_REGIONS_MAP[country]
        if (countryRegions){
            this.setState({countryStatesOptions : optionObjectToOptionsLabelValue(countryRegions, this.props.intl)})
        }
    }


    getFormInputs = () => {
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
                                initialValue: document.visibility || 'private'
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
                                label : this.props.intl.formatMessage({id:"checkout.billingform.country"}),
                                labelCol: {
                                    span: 4
                                },
                                wrapperCol: {
                                    span: 20
                                },
                                initialValue: document.country || ""
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
                                initialValue: statesAndProvinces[document.province_state] ? this.props.intl.formatMessage({id : statesAndProvinces[document.province_state].name}) : document.province_state
                            },
                            fieldProps:{
                                showSearch: true,
                                options: this.state.countryStatesOptions,
                                placeholder: this.props.intl.formatMessage({id:"general.province_state"}),
                            },
                        },{
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
                                initialValue: document.permit_number || ""
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
                                initialValue: document.license_plate || ""
                            },
                            fieldProps:{
                                placeholder: this.props.intl.formatMessage({id:"carrier.vehicle.license_plate"}),
                            },
                        },
                        {
                            name: "effective_date",
                            type: "DateRangePickerField",
                            formItemProps:{
                                label : this.props.intl.formatMessage({id:"general.effective_to_expiry_date"}),
                                labelCol: {
                                    span: 4
                                },
                                wrapperCol: {
                                    span: 20
                                },
                                initialValue: [moment(document.effective_to_expiry_date[0]) ,moment(document.effective_to_expiry_date[1])] || ""
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
                            },
                    ]
                }
            ]
        }
        return formInputs
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
            if(document.type === "vehicle_registration") {
                const new_document = new VehicleRegistrationDocument(document.id, {
                    name: 'Vehicle Document', 
                    type: this.props.type,
                    visibility: formValues.visibility,
                    country: formValues.country,
                    province_state: formValues.province_state || "",
                    permit_number: formValues.permit_number || "",
                    license_plate: formValues.license_plate || "",
                    effective_to_expiry_date: formValues.effective_to_expiry_date || "",
                    attachments: filesRef.map(fileRef => new FileAttachmentsData({file_name: fileRef.ref.name, full_path: fileRef.ref.fullPath})),
                    attachments_path: document.attachments_path,
                    associated_resource: {id: this.props.shipmentId, type:"asset"},
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
        const formInputs = this.getFormInputs()
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
