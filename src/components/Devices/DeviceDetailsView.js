import React from "react";
import {injectIntl, intlShape} from "react-intl";
import Card from "containers/Uielements/Card/card.style";
import {getSpan} from "constants/layout/grids";
import FormBox from "containers/base/form_box";
import {optionObjectToOptionsLabelValue} from "helpers/data/mapper";
import {notifySuccess, notifyError} from "../notification";
import {updateBillingProfile} from "helpers/firebase/firebase_functions/billing_profiles";


class DeviceDetailsView extends React.Component {

  constructor(props){
    const INITIAL_QUOTE = {
      is_shipper: false,
      device: props.device || null,
      loading: false,
	    formInputs: undefined,
    }

    super(props);
    this.state = { ...INITIAL_QUOTE };
  }

  componentDidMount() {
      this.setState({
          is_shipper: this.props.is_shipper
      })
		this.setOptions()
	}

	componentDidUpdate(prevProps) {
		if ((prevProps.device !== this.props.device || prevProps.is_shipper !== this.props.is_shipper)) {
		this.setState({device: this.props.device, is_shipper: this.props.is_shipper}, this.setOptions)
		}
	}

	setOptions = (options) => {
		this.setState({
		}, this.setFormInputs)
	}


  Loading = (loading) => {
		this.setState({loading: loading})
	}

  onSubmit = (values) =>{

	this.Loading(true)

	  const newBillingContactProfile = {
		  salutation: values.salutation,
		  full_name: `${values.first_name} ${values.last_name}`,
		  first_name: values.first_name,
		  last_name: values.last_name,
		  email: values.email,
		  phone: values.phone_number,
		  billing_address: values.billing_address,
	  }

	  const newBillingData = { contact_profile: newBillingContactProfile, id: this.state.billing_profile.id}
  
	  return updateBillingProfile(newBillingData).then(res => {
	  	notifySuccess("notification.success.update.billing_profile", this.props.intl)
	  	this.Loading(false)
	  	this.onCloseDetail()
	  }).catch(e => {
	  	notifyError("notification.fail.update.billing_profile", this.props.intl)
	  	this.Loading(false)
	  })
	};

  setFormInputs = () =>{

		const { device } = this.state


		const DeviceFormItemlabelCol = {
			xs: {span: 13},
			sm: {span: 11},
			md: {span: 9},
			lg: {span: 7},
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
					key: "update_billing_profile",
					title: this.props.intl.formatMessage({id:"shipment.actions.details"}),
					type: "detail",
					groups: [
						{
						name: "payment_profile",
						wrapperCol: {...getSpan(24)},
						groupWrapper:{
							type: "box",
							props: {size: "small", title: this.props.intl.formatMessage({id:"general.payment_profile"})}
						},
						items: [
								{
									name: "bank_name",
									type: "textField",
									formItemProps:{
										label : this.props.intl.formatMessage({id:"details"}),
										labelCol: DeviceFormItemlabelCol,
										wrapperCol: DeviceFormItemWrapperCol,
									},
									fieldProps:{
										disabled: true
									},
									wrapperCol: DeviceWrapperCol
								},
							]
						},
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
    }

		return (
      <div>
        <Card title={this.props.intl.formatMessage({id: "user.action.update_device"})}>
			{formInputs ?
			<FormBox
				title={"DeviceDetails"}
				formInputs={formInputs}
				onSubmit={this.onSubmit}
				onCloseDetail={this.onCloseDetail}
			/>: ""}
        </Card>
      </div>
			
		)
  }
}

DeviceDetailsView.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(DeviceDetailsView)

