import React from "react";
import {injectIntl, intlShape} from "react-intl";
import {SALUTATIONS} from "constants/options/general";
import {PAYMENT_ACTIONS} from "constants/options/money";
import {optionObjectToOptionsLabelValue} from "helpers/data/mapper";
import {notifySuccess, notifyError} from "../../components/notification";
import {updateBillingProfile} from "helpers/firebase/firebase_functions/billing_profiles";
import {RadioButton, RadioGroup} from "../../components/uielements/radio";
import IntlMessages from "../../components/utility/intlMessages";
import Box from "components/utility/box";
import BillingProfileUpdate from "./BillingProfileUpdate";
import ShipperPaymentAccountUpdate from "./ShipperPaymentAccountUpdate";


class BillingProfileDetailsView extends React.Component {

  constructor(props){
    const INITIAL_STATE = {
      is_shipper: false,
      billing_profile: props.billing_profile || null,
      loading: false,
			formInputs: undefined,
			SalutationOptions: undefined,
			PaymentActionsOptions: undefined,
			detailsView: props.itemTabKey || 'details'
		}

    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
		this.setOptions()
	}

	componentDidUpdate(prevProps) {
	}

	setOptions = () => {
		this.setState({
			SalutationOptions: optionObjectToOptionsLabelValue(SALUTATIONS, this.props.intl),
			PaymentActionsOptions: optionObjectToOptionsLabelValue(PAYMENT_ACTIONS, this.props.intl),
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

  onCloseDetail = () => {
		this.props.onCloseDetail()
	}


	renderView = () => {
		const {detailsView, billing_profile} = this.state
		if (detailsView === "details"){
			return <BillingProfileUpdate billing_profile={billing_profile} />
		}else if (detailsView === "payment_account"){
			return <ShipperPaymentAccountUpdate billing_profile={billing_profile}/>
		}
	}

  render() {
    const {detailsView} = this.state
		return (

			<div>
				<Box>
					<RadioGroup
						buttonStyle="solid"
						id="BillingProfileDetails"
						name="BillingProfileDetails"
						value={detailsView}
						onChange={event => {
							this.setState({detailsView: event.target.value})
						}}
					>
						<RadioButton value="details"><IntlMessages id="billing.profile"/></RadioButton>
						<RadioButton value="payment_account"><IntlMessages id="payment.setup"/></RadioButton>
					</RadioGroup>
					{this.renderView()}
				</Box>
			</div>
			
		)
  }
}

BillingProfileDetailsView.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(BillingProfileDetailsView)

