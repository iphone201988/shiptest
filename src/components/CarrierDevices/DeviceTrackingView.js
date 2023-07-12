import React from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import {injectIntl, intlShape} from "react-intl";
import {getSpan} from "constants/layout/grids";
import FormBox from "containers/base/form_box";
import {notifyError, notifySuccess} from "components/notification";
import {trackDeviceData, trackDevicesData} from "helpers/firebase/firebase_functions/devices"
import { DeviceTracking } from "containers/CarrierDevices/device_tracking"


class DeviceTrackingView extends React.Component {
	static propTypes = {
		companyId: PropTypes.string,
	  };
    constructor(props){
		const INITIAL_QUOTE = {
			device: null,
			formInputs: undefined
		}

		super(props);
		this.state = { 
			...INITIAL_QUOTE,
		};
	}

    componentDidMount(){
       if(this.props.device){
		   this.setState({device: this.props.device}, this.setOptions)
	   }
	}

	componentDidUpdate(prevProps) {

		if (this.props.device !== prevProps.device) {
			this.setState({device: this.props.device}, this.setOptions)
		}
	}

	setOptions = () => {
		this.setFormInputs()
	}

	onSubmit = (values) =>{

		const { device } = this.state
        const trackingData = {
            device_id: device.id,
            tracking_data: {
                speed: "88"
            }
        }

		return trackDevicesData(trackingData).then(res => {
			this.onCloseDetail()
			notifySuccess("notification.success.tracking_data", this.props.intl)
			}).catch(e => {
				notifyError("notification.fail.tracking_data", this.props.intl)
			})

		// return trackDeviceData(trackingData).then(res => {
		// 	this.onCloseDetail()
		// 	notifySuccess("notification.success.tracking_data", this.props.intl)
		// 	}).catch(e => {
		// 		notifyError("notification.fail.tracking_data", this.props.intl)
		// 	})
	};

	setFormInputs = () =>{

		const { device } =  this.state

		const DeviceFormItemLabelCol = {
		xs: {span: 15},
		sm: {span: 13},
		md: {span: 11},
		lg: {span: 9},
	}
	
		const DeviceFormItemWrapperCol = {
		xs: {span: 10},
		sm: {span: 12},
		md: {span: 14},
		lg: {span: 16},
	}
	
		const DeviceWrapperCol = {
		xs: {span: 22},
		sm: {span: 16},
		md: {span: 10},
		lg: {span: 10},
	}
	
		
		const formInputs = {
			form_type: "regular",
			submit_label: this.props.intl.formatMessage({id:"general.update"}),
			formProps:{
				layout: "horizontal",
			},
	
			sections: [
				{
				key: "device_detail",
				title: this.props.intl.formatMessage({id:"general.device_detail"}),
				type: "detail",
				groups: [
					{
					name: "device_detail",
					wrapperCol:{...getSpan(24)},
					groupWrapper:{
						type: "box",
					},
					items: [
                                {
                                    name: "device_origin",
                                    type: "addressField",
                                    formItemProps:{
                                        label : this.props.intl.formatMessage({id:"general.origin_location"}),
                                        labelCol: DeviceFormItemLabelCol,
                                        wrapperCol: DeviceFormItemWrapperCol,
                                        initialValue: device.origin,
                                    },
                                    fieldProps:{
                                    },
                                    wrapperCol: DeviceWrapperCol
                                },
							]
						}
					]
				}
			]
		}
		this.setState({formInputs: formInputs})
	}

    onCloseDetail = () => {
		this.props.onCloseDetail()
	}

    render() {
        const {device, formInputs} = this.state
		
        if (device === null){
            return (<div></div>)
        }else{
					return (<DeviceTracking device={device}/>
		)
    }
}
}

const mapStateToProps = (state) => {
	return {
	  companyId: state.FB.company.companyId,
	};
  };
  
  DeviceTrackingView.propTypes = {
	  intl: intlShape.isRequired
  }

  export default compose(
	connect(mapStateToProps, {}),
	firestoreConnect()
  )(injectIntl(DeviceTrackingView));