import React from "react";
import { Icon } from 'antd';
import Form from '../uielements/form'
import Input from '../uielements/input'
import Button from '../uielements/button'
import Select from "../uielements/select";
import {PropTypes} from "prop-types";
import IntlMessages from "components/utility/intlMessages";
import {injectIntl} from "react-intl";

const uuidv1 = require('uuid/v1');

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

const INITIAL_STATE = {
  initialCarrierAuthorities:{},
  ready: false
}

export class DynamicAuthorityFormInputs extends React.Component {

  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    this.setCarrierAuthorities()
  }

  componentDidUpdate(prevProps){
    if (prevProps.AuthorityList !== this.props.AuthorityList ||
        prevProps.CarrierAuthorities !== this.props.CarrierAuthorities ||
        prevProps.AuthoritySelectFieldName !== this.props.AuthoritySelectFieldName ||
        prevProps.form !== this.props.form
    )
    {
      this.setCarrierAuthorities()
    }

  }

  handleCarrierAuthoritySelect = (carrierAuthorityKey, value) => {
    const {form} = this.props
    var CarrierAuthoritiesMap = form.getFieldValue('CarrierAuthoritiesMap');
    CarrierAuthoritiesMap[carrierAuthorityKey].carrier_authority = value
    form.setFieldsValue({CarrierAuthoritiesMap: CarrierAuthoritiesMap})
  }

  AuthorityListSelect = (carrierAuthorityKey, items, initial_value) => {
    const { getFieldDecorator } = this.props.form
    const AuthorityOptions = Object.values(items).map((item) =>(
      <option value={item.key}><IntlMessages id={item.name}/></option>
    ))

    return getFieldDecorator(uuidv1(), {
      initialValue: initial_value,
    })(

        <Select style={{ width: 70 }}
                onChange={(value)=>{this.handleCarrierAuthoritySelect(carrierAuthorityKey, value)}}>
        {AuthorityOptions}
        </Select>
    );
  }

  removeAuthority = (key) => {
    const {form} = this.props
    var CarrierAuthoritiesMap = form.getFieldValue('CarrierAuthoritiesMap');
    delete CarrierAuthoritiesMap[key]
    form.setFieldsValue({CarrierAuthoritiesMap: CarrierAuthoritiesMap})
  }

  changeCarrierAuthority = (key, value) => {
    const {form} = this.props
    var CarrierAuthoritiesMap = form.getFieldValue('CarrierAuthoritiesMap');
    CarrierAuthoritiesMap[key].authority_id = value
    form.setFieldsValue({CarrierAuthoritiesMap: CarrierAuthoritiesMap})
  }

  renderAuthorityItem = (key, carrierAuthority) => {
    const {AuthorityList} = this.props

    return (
        <FormItem
            {...(formItemLayout)}
            label="Authority"
            required={false}
            key={key}
            validateTrigger={['onChange', 'onBlur']}
            initialValue={carrierAuthority.authority_id}
            rules= {[{
              required: true,
              whitespace: true,
              message: "",
            }]}
        >
              <Input addonBefore={this.AuthorityListSelect(key, AuthorityList, carrierAuthority.carrier_authority)}
                     onChange={(event)=>{this.changeCarrierAuthority(key, event.target.value)}}
                     style={{ width: '60%', marginRight: 8 }} />
          <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => {this.removeAuthority(key)}}
          />
        </FormItem>
    )
  }

  addCarrierAuthority = (key, CarrierAuthority) => {
    const {form} = this.props
    var CarrierAuthoritiesMap = form.current.getFieldValue("CarrierAuthoritiesMap")
    const match = Object.values(CarrierAuthoritiesMap).filter(ca=>
      ca.authority_id === CarrierAuthority.authority_id && ca.carrier_authority === CarrierAuthority.carrier_authority)
    if (match.length === 0){
      CarrierAuthoritiesMap[key]=CarrierAuthority
      form.setFieldsValue({CarrierAuthoritiesMap: CarrierAuthoritiesMap})
    }
  }

  addNewAuthority = () => {
    let key =uuidv1()
    let carrierAuthority = {carrier_authority:"", authority_id: "", state: ""}
    this.addCarrierAuthority(key, carrierAuthority)
  }


  setCarrierAuthorities = () => {
    this.setState({ready: true})
  }

  render() {
    const {form} = this.props
    const { ready } = this.state

    if (ready){

      const CarrierAuthoritiesMap  = form.current.getFieldValue('CarrierAuthoritiesMap');

      const AuthoritiesItems = Object.keys(CarrierAuthoritiesMap).map(key =>{
        let carrierAuthority = CarrierAuthoritiesMap[key]
        return (
            this.renderAuthorityItem(key, carrierAuthority)
        )
      })

      return (
          <div>

            {AuthoritiesItems}
            <FormItem {...formItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={this.addNewAuthority} style={{ width: '60%' }}>
                <Icon type="plus" /> Add field
              </Button>
            </FormItem>

          </div>
      );

    }else{
      return '';
    }


  }
}

DynamicAuthorityFormInputs.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(DynamicAuthorityFormInputs)