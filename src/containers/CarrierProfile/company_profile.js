import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from 'redux'
import { firebaseConnect } from 'react-redux-firebase'
import {PropTypes} from "prop-types";
import {CARRIER_AUTHORITIES} from "constants/options/carrier/authorities"
import {injectIntl, intlShape} from "react-intl";
import {BoxWrapper} from "components/utility/box.style";
import FormBox from "../base/form_box";
import {objectToKeyValList} from 'helpers/data/mapper'
import {updateCompany} from "../../helpers/firebase/firebase_functions/company";
import {notifyError, notifySuccess} from "../../components/notification";

const AuthoritiesKeyVal = objectToKeyValList(CARRIER_AUTHORITIES)

const INITIAL_STATE = {
  formInputs: undefined,
  CompanyAccountStatus:'',
  CompanyName:null,
  AllCarrierAuthorities: Object.values(CARRIER_AUTHORITIES),
  CarrierAuthorities:[],
  CarrierAuthority:'',
  AuthorityNumber:'',
  CompanyPhoneNumber:null,
  CompanyAddress:null,
  CompanyWebsite:null,
  FormReady: false,
  company: null,
  loading: false,
  AuthoritiesOptions: [],
};

class CompanyProfile extends Component {
  static propTypes = {
    companyId: PropTypes.string,
    company:PropTypes.object,
    firebase: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount()
  { 
    if (this.props.company){
      this.setOptions()
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.company && prevProps.company !== this.props.company){
      this.setOptions()
    }
  }

  KeyValListToOptions = (KeyValList) => {
		return KeyValList.map(kv => {return {label: this.props.intl.formatMessage({id: kv.value.name}),value: kv.key}})
	}

  setOptions = () => {
    this.setState(
        {
          company: this.props.company,
          AuthoritiesOptions: this.KeyValListToOptions(AuthoritiesKeyVal),
        }, this.setFormInputs)
  }

  onAddressSelected= (address) => {
    this.setState({CompanyAddress: address})
  }

  onSubmit = (values) =>{
    const { company_name, company_address, company_phone, company_website, carrier_authority, authority_id } = values

    // const authorities = this.state.company.profile.carrier_authority_ids
    // const auth = authorities[0]
    // auth.authority_id = authority_id
    // auth.carrier_authority = carrier_authority
    // authorities[0] = auth
		
		const newCompanyProfile = {
			...this.state.company.profile,
			name: company_name,
			address: company_address,
			phone: company_phone,
			website: company_website,
      carrier_authority_ids: [{
        authority_id: authority_id,
        carrier_authority: carrier_authority,
      }]
		}

    const newCompany = {
      id: this.props.companyId,
      profile: newCompanyProfile
    }

    return updateCompany(newCompany).then(res => {
			notifySuccess("notification.success.update_companyProfile", this.props.intl)
			this.onDone()
			this.loading(false)
			}).catch(e => {
				notifyError("notification.fail.update_companyProfile", this.props.intl)
				this.loading(false)
      })
	};

  setFormInputs = () =>{

    const { AuthoritiesOptions, company } = this.state

    const formInputs = {
      form_type: "regular",
      submit_label: this.props.intl.formatMessage({id:"general.update"}),
      formProps:{
        layout: "horizontal",
      },
      sections: [
        {
          key: "company",
          size: "full",
          type: "onlySubmit",
          items: [
            {
              name: "company_name",
              type: "textField",
              formItemProps:{
                initialValue: company.profile?.name,
                rules:[
                  {
                    required: true,
                    message: this.props.intl.formatMessage({id: 'carrier.signup.validation.enter_company'}),
                  }
                ],
                label : this.props.intl.formatMessage({id:"general.company_name"}),
                labelCol: {
                  span: 3
                },
                wrapperCol: {
                  span: 18
                },
              },
              fieldProps:{
                placeholder: this.props.intl.formatMessage({id:"general.company_name"}),
              },
            },
            {
              name: "company_address",
              type: "addressField",
              formItemProps:{
                initialValue: company?.profile?.address,
                rules:[
                  {
                    required: true,
                    message: this.props.intl.formatMessage({id: 'carrier.signup.validation.enter_company'}),
                  }
                ],
                label : this.props.intl.formatMessage({id:"general.address"}),
                labelCol: {
                  span: 3
                },
                wrapperCol: {
                  span: 18
                },
              },
              fieldProps:{
                name: "company_address",
                onSelect: this.onAddressSelected,
                placeholder: this.props.intl.formatMessage({id:"general.address"}),
              },
            },
            {
              name: "company_phone",
              type: "phoneField",
              formItemProps:{
                initialValue: company?.profile?.phone,
                rules:[
                  {
                    required: true,
                    message: this.props.intl.formatMessage({id: 'carrier.signup.validation.enter_company'}),
                  }
                ],
                label : this.props.intl.formatMessage({id:"general.phone_number"}),
                labelCol: {
                  span: 3
                },
                wrapperCol: {
                  span: 18
                },
              },
              fieldProps:{
                name: "company_address",
                placeholder: this.props.intl.formatMessage({id:"general.phone_number"}),
              },
            },
            {
              name: "company_website",
              type: "textField",
              formItemProps:{
                initialValue: company?.profile?.website,
                rules:[
                  {
                    required: false,
                    // message: this.props.intl.formatMessage({id: 'carrier.signup.validation.enter_company'}),
                  }
                ],
                label : this.props.intl.formatMessage({id:"general.website"}),
                labelCol: {
                  span: 3
                },
                wrapperCol: {
                  span: 18
                },
              },
              fieldProps:{
                name: "company_address",
                placeholder: this.props.intl.formatMessage({id:"general.website"}),
              },
            },
            {
              name: "carrier_authority",
              type: "selectField",
              formItemProps:{
                  initialValue: company.profile.carrier_authority_ids[0]?.carrier_authority,
                  label : this.props.intl.formatMessage({id: 'carrier.signup.authority'}),
                  labelCol: {
                    span: 3
                  },
                  wrapperCol: {
                    span: 18
                  },
              },
              fieldProps:{
                placeholder: this.props.intl.formatMessage({id: 'carrier.signup.authority'}),
                options: AuthoritiesOptions
              },
            },
            {
              name: "authority_id",
              type: "textField",
              formItemProps:{
                initialValue: company?.profile?.carrier_authority_ids[0]?.authority_id,
                label : this.props.intl.formatMessage({id: 'carrier.signup.authority_number'}),
                labelCol: {
                  span: 3
                },
                wrapperCol: {
                  span: 18
                },
              },
              fieldProps:{
                placeholder: this.props.intl.formatMessage({id: 'carrier.signup.authority_number'}),
              },
            },
          ]
        },
      ]
    }
    this.setState({formInputs: formInputs})
  }

  render()
  {
    const {formInputs} = this.state;

    return (
        <BoxWrapper>
          {formInputs ?
              <FormBox
                  title={this.props.intl.formatMessage({id: 'company'})}
                  formInputs={formInputs}
                  //! onSubmit fn called !!
                  onSubmit={this.onSubmit}
              /> : ""}
        </BoxWrapper>
    )
  }
}

CompanyProfile.propTypes = {
  intl: intlShape.isRequired
}

const mapStateToProps = state => {
  return {
    companyId: state.FB.company.companyId,
    company: state.FB.company.company,
    firebase: state.FB.firebase
  }
}

const mapDispatchToProps = dispatch => {
  return {
    clearFirestore: () => dispatch({ type: '@@reduxFirestore/CLEAR_DATA' })
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firebaseConnect()
)(injectIntl(CompanyProfile))

