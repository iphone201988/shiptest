import React, {Suspense, PureComponent, lazy} from "react";
import {injectIntl, intlShape} from "react-intl";
import {PhoneOptions} from "constants/options/general";

const Select =  lazy(() => import("components/select"));
const DatePicker = lazy(() => import("components/uielements/datePicker"));
const DateRangepicker = React.lazy(() => import('components/uielements/datePicker').then(
    module => ({ default: module.DateRangepicker }))
);
const InputNumber = lazy(() => import("components/uielements/InputNumber"));
const Radio = lazy(() => import("components/uielements/radio"));
const RadioGroup = React.lazy(() => import('components/uielements/radio').then(
    module => ({ default: module.RadioGroup }))
);

const CheckboxGroup = React.lazy(() => import('components/uielements/checkbox').then(
    module => ({ default: module.CheckboxGroup }))
);

const PhoneInput = lazy(() => import("components/uielements/inputPhone"));

const Input = lazy(() => import("components/uielements/input"));
const AddressInput = lazy(() => import("../Location/address_input"));
const QuoteRequestReview = lazy(() => import("../Shipment/QuoteRequestReview"))

function nothing(x){}
const _ = require("underscore")


class FormField extends PureComponent {

    INITIAL_STATE = {
        fieldProps: null,
    }

    constructor(props) {
        super(props);
        this.state = { ...this.INITIAL_STATE };
    }



    componentDidMount() {
        if (this.props.fieldProps){
            this.setState({ fieldProps: this.props.fieldProps });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (! _.isEqual(prevProps.fieldProps != this.props.fieldProps)){
            this.setState({fieldProps: this.props.fieldProps})
        }
    }

    fieldValue = (key, val) => {

        const fieldVal = {}
        fieldVal[key] = val
        return fieldVal
    }

    onSelect = (value, option) =>{
        const {name} = this.props
        const {fieldProps} = this.state
        let fieldValue = undefined
        if (fieldProps.mode ==="multiple"){
            fieldValue = this.props.formRef.current.getFieldValue(name) || []
            fieldValue.push(value)
        }else{
            fieldValue = value
        }
        this.props.formRef.current.setFieldsValue(this.fieldValue(name, fieldValue))

        if (this.props.onSelect){
            this.props.onSelect(fieldValue, option)
        }

        if (this.props.onFormFieldChanged){
            this.props.onFormFieldChanged()
        }
    }

    onChange = (value, options={}) =>{
        const {name} = this.props
        try{
            if (options.setFormValue === true){
                if (value){
                    this.props.formRef.current.setFieldsValue(this.fieldValue(name, value))
                }
            }

            if (this.props.onChange){
                this.props.onChange(value, {name: name})
            }
            if (this.props.onFormFieldChanged){
                this.props.onFormFieldChanged()
            }

        }catch(e){
            // console.error(e.message)
        }
    }

    renderAddressInput = () => {
        return <AddressInput {... this.state.fieldProps} onSelect={this.onSelect}/>
    }

    renderDateRangePicker = () => {
        return <DateRangepicker {... (this.state.fieldProps || {})} showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" onOk={this.onSelect} />
    }

    renderNumberInput = () => {
        return <InputNumber {... (this.state.fieldProps || {})} onChange={this.onChange}></InputNumber>
    }

    renderTextInput = () => {
        return <Input  {... (this.state.fieldProps || {})} onChange={this.onChange}/>
    }

    renderPhoneInput = () => {

        return <PhoneInput  options={PhoneOptions} {... (this.state.fieldProps || {})} onChange={(val) => this.onChange(val, {setFormValue: true})}/>
    }

    renderSelect = () => {
        const options = (this.state.fieldProps || {}).options || []

        return  (
            <Select
                    {... (this.state.fieldProps || {})} 
                   onSelect={this.onSelect}
            >
                {options.map((e) => {
                    return <option value={e.value}> {e.label}</option>})}
            </Select>
        )

    }

    renderRadioGroup = () => {
        const options = (this.state.fieldProps || {}).options || []

        return (
            <RadioGroup
                onChange={this.onChange}
            > {options.map((e) => {return <Radio value={e.value}> {e.label}</Radio>})}
            </RadioGroup>
        )
    }

    renderCheckboxGroup = () => {
        return <CheckboxGroup {... (this.state.fieldProps || {})} onChange={(val) => this.onChange(val, {setFormValue: true})}/>
    }

    renderQuoteRequestReview = () =>{
        return (<QuoteRequestReview {... (this.state.fieldProps || {})} ></QuoteRequestReview>)
    }


    renderAutoComplete = () => {
    }

    renderInputField(){
        const {type} = this.props;

        let inputField = ''

        if (type === "addressField"){
            inputField =  this.renderAddressInput()
        }else if (type === "DateRangePickerField"){
            inputField = this.renderDateRangePicker()
        }else if (type === "textField"){
            inputField =  this.renderTextInput()
        }else if (type === "phoneField"){
            inputField = this.renderPhoneInput()
        }
        else if (type === "numberField"){
            inputField = this.renderNumberInput()
        }else if (type === "radioGroupField"){
            inputField = this.renderRadioGroup()
        }else if (type === "CheckboxGroup"){
            inputField = this.renderCheckboxGroup()
        }else if (type === "selectField"){
            inputField = this.renderSelect()
        }
        else if (type === "QuoteRequestReview"){
            inputField = this.renderQuoteRequestReview()
        }
        else {
            return <div></div>
        }

        return inputField
    }
}

FormField.propTypes = {
    intl: intlShape.isRequired
}

export default injectIntl(FormField);
