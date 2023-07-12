import React, {PureComponent}  from "react";
import {injectIntl, intlShape}  from "react-intl";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import Loader from "components/utility/loader";
import {BoxWrapper} from "components/utility/box.style";
import FormBox from "../base/form_box";
import {optionObjectToOptionsLabelValue} from "helpers/data/mapper";
import {notifyError, notifySuccess} from "components/notification";
import {addDevice, getProviderDevices, importProviderDevices} from "helpers/firebase/firebase_functions/devices"
// import api from "../CompanyIntegrations/providers/api/keeptruckin_api"
import {INTEGRATION_PROVIDERS} from "model/manager/integration/integrations_map";
import Vehicle from "model/asset/vehicle"
// import Trailer from "model/asset/trailer"
import Device from "model/base/device"
import {FireQuery} from "helpers/firebase/firestore/firestore_collection";
import CompanyIntegration from "model/integration/company_integration";


class NewDevice extends PureComponent {

    constructor(props) {
        super(props);
        this.INITIAL_STATE = {
            provider: undefined,
            formInputs: undefined, 
            providerToken: undefined,
            providerDevices: undefined,
            IntegrationProvidersOptions: undefined,
            DevicesOptions: undefined,
            FBAssetID: undefined,
            allSelected: false,
            loading: false
        }
        this.state = { ...this.INITIAL_STATE };
    }

    componentDidMount() {
        this.setOptions()
    }

    loading = (value) => {
        this.setState({
          loading: value
        })
      }

    setOptions = (options) => {
        this.setState({
            IntegrationProvidersOptions: optionObjectToOptionsLabelValue(INTEGRATION_PROVIDERS, this.props.intl )
        }, this.setFormInputs)
    }

    onProviderSelect = (provider) => {
        // this.loading(true)
        this.setState({
            providerValue: provider
        })
        // For now do not load the list of saved devices.
        // return getProviderDevices(provider).then(res => {
        //         notifySuccess("notification.success.get_device", this.props.intl)
        //         this.setState({
        //             providerDevices: res,
        //             loading: false
        //         })
        //         this.getFBDevices()
        //         this.loading(false)
        //     }).catch(e => {
        //         notifyError("notification.fail.get_device", this.props.intl)
        //         this.loading(false)
        //     })
    }

    // onProviderSelect = (value) => {
    //     const companyId = this.props.companyId
    //         this.setState({
    //             providerValue: value
    //         })
    //         if (companyId) {
    //         const conditions = [new FireQuery('provider', '==', value), new FireQuery('company_account.id', '==', companyId)]
    //         CompanyIntegration.collection.query(conditions, this.onProviderChange, false)
    //     }
    // }

    getFBAsset = (asset) => {
        this.setState({
            FBAssetID : Object.keys(asset)[0]
        })
    }

    getFBDevices = async () => {
        const conditions = [new FireQuery('company_account.id', '==', this.props.companyId)]
        await Device.collection.query(conditions, this.checkDevicesSaved)
        return
    }

    checkDevicesSaved = (devices) => {
        const devicesOptions = []
        const FBDevicesId = []
        let FBDevice
        let providerDevice
        for (FBDevice in devices) {
            FBDevicesId.push(devices[FBDevice].profile.provider.device_id)
        }
        for (providerDevice of this.state.providerDevices) {
            if (!FBDevicesId.includes(providerDevice.profile.id)) {
                devicesOptions.push({label: providerDevice.profile.identifier, value: providerDevice.profile.id})
            }
        }
        this.setState({
            DevicesOptions: devicesOptions
        }, this.setFormInputs)
    }
    
    onAllSelectChange = (event) => {
        this.setState({
            allSelected: !this.state.allSelected
        }, this.setFormInputs)
    }

    setDeviceData = async (device) => {
        const provider = this.state.providerValue
        const deviceProfile = device.profile
        const deviceAssociations = device.associations
        let profile = {}
        let associations = {}
        let conditions = []
        
        profile.model = deviceProfile.model
        profile.provider = {
            provider: provider,
            device_id: deviceProfile.id,
            device_identifier: deviceProfile.identifier
        }
        
        associations.asset = deviceAssociations.asset
        associations.asset.provider_id = deviceAssociations.asset.id
        conditions = [new FireQuery('profile.vin', '==', deviceAssociations.asset.vin), new FireQuery('company_account.id', '==', this.props.companyId)]
        await Vehicle.collection.query(conditions, this.getFBAsset)
        associations.asset.id = this.state.FBAssetID
        associations.asset.type = "vehicle"

        const deviceData = {
            profile: profile,
            associations: associations,
            device_type: device.device_type
        }
        const newDevice = new Device(undefined, deviceData)
        return newDevice
    }
    
    onSubmit = async (values) => {
        const {providerValue} = this.state
        this.loading(true)

        //version to import all devices
        // const data = {
        //     provider: providerValue
        // }
        //
        // importProviderDevices(data).then(res => {
        //     notifySuccess("notification.success.add__device", this.props.intl)
        //     this.onDone()
        // }).catch(e => {
        //     notifyError("notification.fail.add__device", this.props.intl)
        // })


        // Keep this as commented  in case we want to select the devices to import
        const allDevices = this.state.providerDevices
        const devices = []

        // for (const device of allDevices) {
        //     let deviceData
        //     if (values.devices.includes(device.profile.id)) {
        //         deviceData = await this.setDeviceData(device)
        //         devices.push(deviceData)
        //     }
        // }

        const data = {
            provider: providerValue,
            devices: values.devices
        }
        importProviderDevices(data).then(res => {
            notifySuccess("notification.success.add__device", this.props.intl)
            this.onDone()
        }).catch(e => {
            this.loading(false)
            notifyError("notification.fail.add__device", this.props.intl)
        })

        return
    }


    setFormInputs = () =>{
        const { IntegrationProvidersOptions, DevicesOptions, allSelected } = this.state

        let items
        const optionsValues = []

        if (DevicesOptions) {
            for (let option of DevicesOptions) {
                optionsValues.push(option.value)
            }
        }

        if (DevicesOptions) {
            items = [
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
                        options: IntegrationProvidersOptions,
                        onSelect: this.onProviderSelect
                    },
                },
                {
                    name: "select_all",
                    type: "Checkbox",
                    formItemProps:{
                        label : this.props.intl.formatMessage({id:"general.select_all"}),
                        labelCol: {
                            span: 2
                        },
                        wrapperCol: {
                            span: 22
                        },
                        onChange: this.onAllSelectChange
                    },
                    fieldProps:{
                        placeholder: this.props.intl.formatMessage({id:"general.select_all"}),
                    },
                },
                {
                    name: "devices",
                    type: "CheckboxGroup",
                    formItemProps:{
                        // checked: allSelected ? optionsValues : "",
                        label : this.props.intl.formatMessage({id:"general.devices"}),
                        labelCol: {
                            span: 2
                        },
                        wrapperCol: {
                            span: 22
                        },
                    },
                    fieldProps:{
                        options: DevicesOptions,
                        placeholder: this.props.intl.formatMessage({id:"general.devices"}),
                    },
                }
            ]
        } else {
            items = [
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
                        options: IntegrationProvidersOptions,
                        onSelect: this.onProviderSelect
                    },
                }
            ]
        }

        const formInputs = {
            form_type: "regular",
            submit_label: this.props.intl.formatMessage({id:"device.action.add"}),
            formProps:{
                layout: "horizontal",
            },
            sections: [
                {
                    key: "new_device",
                    size: "full",
                    title: this.props.intl.formatMessage({id:"general.type"}),
                    items: items
                }
            ]
        }
        this.setState({formInputs: formInputs})
    }

    loading = (loading) => {
        this.setState({loading: loading})
    }

    onDone = () => {
        if (this.props.onDone){
            this.props.onDone()
        }
        this.loading(false)
    }

    render() {
        const {loading, formInputs} = this.state;
    
        return (
            <BoxWrapper>
                {formInputs ?
                    <FormBox
                        title={this.props.intl.formatMessage({id: 'device.new_device'})}
                        formInputs={formInputs}
                        onSubmit={this.onSubmit}
                    />: ""}
                    { loading ?
                        <Loader /> : ""
                    }

            </BoxWrapper>
        )
    }
}

const mapStateToProps = state => {
    return {
        companyId: state.FB.company.companyId,
    }
}

NewDevice.propTypes = {
    intl: intlShape.isRequired
}

export default compose(
    connect(mapStateToProps, {}), firebaseConnect()
)(injectIntl(NewDevice))

