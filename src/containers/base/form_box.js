import {injectIntl, intlShape} from "react-intl";
import React, {Component, lazy} from "react";
import { v4 as uuidv4 } from 'uuid';
import {Row, Col} from 'antd';
import Layout from "antd/es/layout";
import Form from "components/uielements/form";
import Button from "components/uielements/button";
import Tabs, { TabPane } from 'components/uielements/tabs';
import IntlMessages from "components/utility/intlMessages";
import {Box} from "components/base/filter.style";
import Card from "../Uielements/Card/card.style";
import {KeyValtoObject} from "helpers/data/mapper";
import DataView from "../base/data_view";
import {LayoutContentWrapper} from "components/utility/layoutWrapper.style";
import {PhoneOptions} from "constants/options/general";
import "constants/options/phoneStyles.less";


const Select =  lazy(() => import("components/uielements/select"));
// const DatePicker = lazy(() => import("components/uielements/datePicker"));
const DateRangepicker = React.lazy(() => import('components/uielements/datePicker').then(
  module => ({ default: module.DateRangepicker }))
);
const TimeRangepicker = React.lazy(() => import('components/uielements/timePicker').then(
  module => ({ default: module.TimeRangepicker }))
);
const InputNumber = lazy(() => import("components/uielements/InputNumber"));
const Radio = lazy(() => import("components/uielements/radio"));
const RadioGroup = React.lazy(() => import('components/uielements/radio').then(
  module => ({ default: module.RadioGroup }))
);
const Checkbox = React.lazy(() => import('components/uielements/checkbox'))
const InfoBubble = React.lazy(() => import('components/utility/InfoBubble'))

const CheckboxGroup = React.lazy(() => import('components/uielements/checkbox').then(
  module => ({ default: module.CheckboxGroup }))
);
const PhoneInput = lazy(() => import("components/uielements/inputPhone"));
const Slider = lazy(() => import("components/uielements/slider"));
const Input = lazy(() => import("components/uielements/input"));
const AddressInput = lazy(() => import("components/Location/address_input"));
const QuoteRequestReview = lazy(() => import("components/Shipment/QuoteRequestReview"))
const AuthoritiesForm = lazy(() => import("components/carrier_profile/dynamicAuthorityFormInputs") )
const FilesUploader = React.lazy(() =>import("components/files/files_uploader"))

let cloneDeep = require('lodash.clonedeep');

class FormBox extends Component {

    formRef = React.createRef();

    INITIAL_STATE = {
        initialized: false,
        formInputs: {},
        currentFormInputs: {},
        currentStep: 0,
        filterForm: undefined,
        loading: false,
        enabledLoading: true,
        change: false,
        itemSetsFields: {groups:{}, fields:{}}
    }


    constructor(props) {
        super(props);
        this.state = { ...this.INITIAL_STATE };
    }

    componentDidMount() {
        if (this.props.formInputs){
            this.onFormInputSet()

        }
        if (this.props.enabledLoading !== undefined){
            this.setState({enabledLoading:this.props.enabledLoading});
        }

        if (this.props.loading){
            this.setState({loading:this.props.loading});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.enabledLoading !== prevProps.enabledLoading){
            this.setState({enabledLoading:this.props.enabledLoading});
        }

        if (this.props.loading !== prevProps.loading){
            this.setState({loading:this.props.loading});
        }

        if (this.props.formInputs !== prevProps.formInputs) {
            this.onFormInputSet()
        }

        if (this.state.currentStep !== prevState.currentStep){
            this.onTabChange(this.state.currentStep )
        }
    }

    loading = (loading) => {
        this.setState({loading: loading})
    }

    onFinish = (values) => {
        const { enabledLoading, itemSetsFields } = this.state
        this.loading(enabledLoading)
        values = { ...values, itemSetsFields: itemSetsFields }
        if (this.props.onSubmit) {
            this.props.onSubmit(values).then(() => {
                this.loading(false)
                this.resetForm();
            }).catch(err => { this.loading(false) }).finally(() => { this.loading(false) })
        } else {
            this.loading(false)
        }
    }

    onFormInputSet = () => {
        if(this.props.formInputs){
            this.setState({ formInputs: this.props.formInputs}, this.setFormInputs)
        }
    }

    setFormInputs = () => {
        const {formInputs, itemSetsFields} = this.state
        const currentForm = cloneDeep(formInputs)

        if (!itemSetsFields.groups){
            itemSetsFields.groups = {}
        }
        const sections = currentForm.sections || []
        sections.map(section => (section.groups || []).map(group => this.setGroup(group)))
        this.setState({currentFormInputs: currentForm, initialized: true})
    }

    setNextStep = (nextStep) => {
        // this.setState({currentStep: nextStep})
        this.formRef.current.validateFields().then(values =>{
            this.setState({currentStep: nextStep})
        }).catch(err => console.error)
    }

    nextStep = () => {
        const {currentStep} = this.state
        this.setNextStep(currentStep+1)
    }

    prevStep = () => {
        const {currentStep} = this.state
        this.setNextStep(currentStep-1)
    }

    onStepTabClicked = (index, e) => {
        this.setNextStep(parseInt(index, 10))
    }

    onTabChange = (activeKey) => {
        const {formInputs, itemSetsFields} = this.state
        const sections = formInputs.sections || []
        const section = sections[activeKey]

        if (typeof section.onEnter == 'function') {
            const value = {form: this.formRef.current, itemSetsFields: itemSetsFields}
            section.onEnter(value)
        }
    }

    onCloseDetail = () => {
        this.props.onCloseDetail()
    }

    onFormFieldChanged = () => {
        if (this.props.onFormFieldChanged){
            this.props.onFormFieldChanged()
        }
    }

    onChangeSlider = (value, options={}) =>{
        const fieldProps = options.fieldProps || {}

        try{
            if (options.setFormValue === true){
                if (value){
                    this.formRef.current.setFieldsValue(value)
                    // this.formRef.current.setFieldsValue(this.fieldValue(fieldProps.name, value))
                }
            }

            if (fieldProps.onChange){
                this.props.onChange(value, {name: fieldProps.name})
            }
            if (fieldProps.onFormFieldChanged){
                options.onFormFieldChanged()
            }

        }catch(e){
            // console.error(e.message)
        }
    }

    onChange = (value, options={}) =>{
        const fieldProps = options.fieldProps || {}
        try{
            if (options.setFormValue === true){
                if (value){
                    this.formRef.current.setFieldsValue(value)
                    // this.formRef.current.setFieldsValue(this.fieldValue(fieldProps.name, value))
                }
            }

            if (fieldProps.onChange){
                this.props.onChange(value, {fieldName: fieldProps.name})
            }
            if (fieldProps.onFormFieldChanged){
                options.onFormFieldChanged()
            }

        }catch(e){
            // console.error(e.message)
        }


    }

    onSelect = (value, option={}) =>{
        const fieldProps = option.fieldProps || {}

        let fieldValue = undefined
        if (fieldProps.mode ==="multiple"){
            fieldValue = this.formRef.current.getFieldValue(fieldProps.name) || []
        }else{
            fieldValue = value
        }
        if (this.formRef.current){
            this.formRef.current.setFieldsValue(this.fieldValue(fieldProps.name, fieldValue))
        }

        //
        if (fieldProps.onSelect){
            fieldProps.onSelect(fieldValue, option)
        }

        if (fieldProps.onFormFieldChanged){
            fieldProps.onFormFieldChanged()
        }
    }

    fieldValue = (key, val) => {

        const fieldVal = {}
        fieldVal[key] = val
        return fieldVal
    }

    resetForm = () => {
        this.formRef.current.resetFields()
    }

    clearForm = () => {
        this.formRef.current.resetFields()
    }

    setGroup = (group) => {
        const {itemSetsFields} = this.state

        if (group.mode === "multiple") {
            if (!itemSetsFields.groups[group.name]) {
                // set group only if it wasn't previously set
                itemSetsFields.groups[group.name] = {}
                const newItemsSetId = this.newId()
                itemSetsFields.groups[group.name] = {}
                group.itemSets = {}
                if (Array.isArray(group.formItemsProps) && group.formItemsProps.length > 0) {
                    group.formItemsProps.forEach(formItemProps => {
                        // const items = group.items
                        const newItemsSetId = this.newId()
                        formItemProps.id = newItemsSetId
                        this.setGroupItemsFields(group, newItemsSetId, {formItemProps: formItemProps})
                        // group.itemSets[newItemsSetId] = items
                    })

                }else{
                    // const items = cloneDeep(group.items)
                    this.setGroupItemsFields(group, newItemsSetId)

                }

            } else {
                console.info("here c")
                const items = cloneDeep(group.items)
                Object.keys(itemSetsFields.groups[group.name]).forEach(id => {
                    this.setGroupItemsFields(group, id)
                })
            }
        }
        // else{
        //     group.formItems = group.items
        // }
    }

    newId = () => {
        return uuidv4()
    }

    itemSetName = (name, id) => {
        return name + id
    }

    getItemSetFieldNames = (field_name) => {
        const {itemSetsFields} = this.state
        return (itemSetsFields.fields[field_name] || []).map(itemSetField => itemSetField.name)
    }

    setGroupItemField = (group, groupId, item, options={}) => {

        const {itemSetsFields} = this.state

        const itemSetName = this.itemSetName(item.name, groupId)
        const is_new = !itemSetsFields.groups[group.name][groupId]
        // TODO: Fix issue for new element of group that already exists
        if (is_new) {
            itemSetsFields.groups[group.name][groupId] = {}
        }

        const itemSetsField = itemSetsFields.fields[item.name]

        const itemSetField = {id: groupId, name: itemSetName, group_name: group.name}

        if (Array.isArray(itemSetsField)) {
            if (itemSetsField.filter(item => item.id === groupId).length === 0){
                itemSetsFields.fields[item.name].push(itemSetField)
            }

        } else {
            itemSetsFields.fields[item.name] = [itemSetField]
        }

        if (itemSetsFields.groups[group.name][groupId][item.name] === undefined)
            itemSetsFields.groups[group.name][groupId][item.name] = itemSetName

        if (options.formItemProps){
            if (options.formItemProps[item.name]){
                item.formItemProps = {...item.formItemProps, ...options.formItemProps[item.name] }
            }
        }

        item.name = itemSetName
        this.setState({itemSetsFields: itemSetsFields})
    }

    setGroupItemsFields = (group, groupId, options={}) => {
        const formItems = cloneDeep(group.items || [])
        // the problem is that formItemProps uses the original ex:selctDriver  not the modified item.name with the id
        formItems.forEach((item, index) => {
            this.setGroupItemField(group, groupId, item, options)
        })

        if (group.itemSets === undefined){
            group.itemSets = {}
        }
        group.itemSets[groupId] = formItems
    }

    removeGroupItemField = (group, item, groupId) => {
        // groupId is not passed
        const {itemSetsFields} = this.state
        //remove it from itemSetsFields.fields
        itemSetsFields.fields[item.name] = ((itemSetsFields.fields || {})[item.name] || []).filter(it=> it.id !== groupId)

        //remove it from itemSetsFields.groups
        if ((itemSetsFields.groups[group.name] || {})[groupId] != undefined){
            delete itemSetsFields.groups[group.name][groupId]
        }

        group.formItemsProps = group.formItemsProps.filter(it=> it.id != groupId)

        delete group.itemSets[groupId]

        if (Object.keys(group.itemSets).length == 0){
            this.addGroupNewItemSet(group)
        }

        this.setState({itemSetsFields: itemSetsFields})
    }

    removeGroupItemsFields = (group, groupId) => {

        (group.items || []).forEach(item => {
            this.removeGroupItemField(group, item, groupId)
        })
    }

    addGroupNewItemSet = (group) => {

        const itemSetId = this.newId()
        this.setGroupItemsFields(group, itemSetId)
        // this.setState({change: !this.state.change})
    }

    renderActionButton = (options={} ) => {
        const {formInputs} = this.state
        const {submitDisabled} = this.props
        const submit_label = formInputs.submit_label  
        const next_label = formInputs.next_label ||"general.next"
        const prev_label = formInputs.prev_label || "general.previous"
        const cancel_label = formInputs.cancel_label || "general.cancel"
        const clear_label = formInputs.clear_label || "general.clear_form"
        const back_label = formInputs.back_label || "general.back"

        return <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {options.prev ?
              <Col>
                  <Button type="primary" disabled={!options.prev} onClick={this.prevStep}>
                      <IntlMessages id={prev_label} />
                  </Button>
              </Col> : ""}
            {options.next ?
              <Col>
                  <Button type="primary" disabled={!options.next} onClick={this.nextStep}>
                      <IntlMessages id={next_label} />
                  </Button>
              </Col> : ""}
            {options.submit && submit_label ?
              <Col>
                  <Button type="primary" htmlType="submit" loading={this.state.loading} disabled={ submitDisabled }>
                      <IntlMessages id={submit_label} />
                  </Button>
              </Col> : ""}
            {options.cancel ?
              <Col>
                  <Button type={"danger"} onClick={this.resetForm}>
                      <IntlMessages id={cancel_label} />
                  </Button>
              </Col> : ""}
            {options.clear ?
              <Col>
                  <Button type={"danger"} htmlType="submit" onClick={this.clearForm}>
                      <IntlMessages id={clear_label} />
                  </Button>
              </Col> : ""}
            {options.back ?
              <Col>
                  <Button type={"danger"} htmlType="submit" onClick={this.onCloseDetail}>
                      <IntlMessages id={back_label} />
                  </Button>
              </Col> : ""}
        </Row>
    }

    renderTabsSectionActionButton = (formSections, index) => {

        if (index === 0 && formSections.length === 1){
            return this.renderActionButton({submit : true, prev:false, next:false, cancel: true, clear: false})
        }
        else if (index === 0){
            return this.renderActionButton({submit : false, prev:false, next:true, cancel: true, clear: false})
        }else if (index === formSections.length-1){
            return this.renderActionButton({submit : true, prev:true, cancel: true, clear: false})
        }else{
            return this.renderActionButton({submit : false, prev:true, next:true, cancel: true, clear: false})
        }
    }

    renderTabContent = () => {

    }

    renderFormBox = () => {
        const {currentFormInputs, currentStep} = this.state
        const formProps = currentFormInputs.formProps || {}

        let inputsSections= []
        const formSections = (currentFormInputs.sections || [])


        if (currentFormInputs.form_type === "multi_steps_tabs"){
            inputsSections =  <Tabs type={"card"} activeKey={currentStep.toString()} tabPosition={"top"}
                                    style={{ height: "100%", width: '100%' }} onTabClick={this.onStepTabClicked}>
                {formSections.map((formSection, index) => {
                    let actionButtons = ""
                    actionButtons = this.renderTabsSectionActionButton(formSections, index)
                    const inputSections = (formSection.load !== false )? this.renderInputSection(formSection) : ""

                    return <TabPane tab={`${index + 1}. ${formSection.title}`} key={index}>
                        {formSection.load !== false ?
                          <LayoutContentWrapper>
                              { (formSection.loadMode === "lazy" && currentStep >= index) || formSection.loadMode !== "lazy" ?
                                <Layout style={{height: '100%', layout: "white"}}>
                                    <Layout.Header>{actionButtons}</Layout.Header>
                                    <Layout.Content style={{height: '100%', padding: '30px'}}>
                                        {inputSections}
                                    </Layout.Content>
                                    <Layout.Footer></Layout.Footer>
                                </Layout>
                                : ""
                              }
                          </LayoutContentWrapper>
                          : ""}

                    </TabPane>

                })
                }
            </Tabs>
        }else{
            inputsSections = formSections.map((formSection, index) => {
                  let actionButtons
                  if(formSection !== undefined) {
                      if(formSection.type === "detail") {
                          actionButtons = this.renderActionButton({submit : true, prev:false, next:false, cancel: false, clear: false, back: true})
                      } else if (formSection.type === "onlySubmit") {
                          actionButtons = this.renderActionButton({submit : true, prev:false, next:false, cancel: false, clear: false, back: false})
                      } else if (formSection.type === "noButtons") {
                          actionButtons = this.renderActionButton({submit : false, prev:false, next:false, cancel: false, clear: false, back: false})
                      }
                      else {
                          actionButtons = this.renderActionButton({submit : true, prev:false, next:false, cancel: false, clear: true, back: false})
                      }
                  }
                  return (
                    <div key="Box">
                        {this.renderInputSection(formSection)}
                        {actionButtons}
                    </div>
                  )
              }

            )
        }

        return <Form {...formProps} onFinish={this.onFinish} ref={this.formRef}>
            {inputsSections }
        </Form>


    }
    
    renderDataView = (fieldProps) => {
        return <DataView {...fieldProps}/>
    }

    renderSelect = (fieldProps) => {
        const options = (fieldProps || {}).options || []

        return  (
          <Select
            {... (fieldProps || {})}
            onSelect={(val) => this.onSelect(val, {fieldProps: fieldProps})}
          >
              {options.map((e) => {
                  return <option key={e.label} value={e.value}> {e.label}</option>})}
          </Select>
        )

    }

    renderAddressInput = (fieldProps) => {
        const options = (fieldProps || {}).options || []

        return (<AddressInput
            {... (fieldProps || {})}
            onSelect={(val) => this.onSelect(val, { fieldProps: fieldProps })}
          >
            {options.map((e) => {
                return <option key={e.label} value={e.value}> {e.label}</option>
            })}
        </AddressInput>)
    }

    renderDateRangePicker = (fieldProps) => {
        let showTime
        let format
        if(fieldProps.showTime && fieldProps.format) {
            showTime = fieldProps.showTime
            format = fieldProps.format
        }else {
            showTime = { format: 'HH:mm' };
            format = "YYYY-MM-DD HH:mm"
        }
        return <DateRangepicker {...(fieldProps || {})} showTime={{showTime}} format={format} onOk={val => this.onSelect(val, {fieldProps:fieldProps})} />
    }

    renderTimeRangePicker = (fieldProps) => {
        return <TimeRangepicker {... (fieldProps || {})} showTime={{ format: 'HH:mm' }} onChange={val => this.onSelect(val, {fieldProps:fieldProps})} />
    }

    renderDatePicker = (fieldProps) => {
        return <DateRangepicker {...(fieldProps || {})} onOk={val => this.onSelect(val, {fieldProps:fieldProps})} />
    }

    renderNumberInput = (fieldProps) => {
        return <InputNumber {... (fieldProps || {})} onChange={(val) => this.onChange(val, {fieldProps: fieldProps})}></InputNumber>
    }

    renderTextInput = (fieldProps) => {
        return <Input  {... (fieldProps || {})} onChange={(val) => this.onChange(val, {fieldProps: fieldProps})}/>
    }

    renderPasswordInput = (fieldProps) => {
        return <Input type="password" {...(fieldProps || {})} onChange={(val) => this.onChange(val, {fieldProps: fieldProps})}/>
    }
    renderSliderInput = (fieldProps) => {
        return <Slider {... (fieldProps || {})} onChangeSlider={(val) => this.onChangeSlider(val, {fieldProps: fieldProps})} />
    }

    renderPhoneInput = (fieldProps) => {

        return <PhoneInput  options={PhoneOptions} {...(fieldProps || {}) }
                            onChange={(val) => this.onChange(val, {setFormValue: true, fieldProps: fieldProps})}
                            className="PhoneStyles"/>
    }

    

    renderSelectTag = (fieldProps) => {
        const children = [];

        return  (
          <Select mode="tags" style={{ width: '100%' }}>
              {children}
          </Select>
        )

    }

    renderRadioGroup = (fieldProps) => {
        const options = (fieldProps || {}).options || []

        return (
          <RadioGroup
            onChange={(val) => this.onChange(val, {fieldProps: fieldProps})}
          > {options.map((e) => {return <Radio value={e.value}> {e.label}</Radio>})}
          </RadioGroup>
        )
    }

    renderCheckbox = (fieldProps) => {
        return <Checkbox {...(fieldProps || {})} onChange={(val) => this.onChange(val, {fieldProps: fieldProps})}/>
    }

    renderCheckboxGroup = (fieldProps) => {
        return <CheckboxGroup {...(fieldProps || {})} onChange={(val) => this.onChange(val, {fieldProps: fieldProps})}/>
    }

    renderQuoteRequestReview = (fieldProps) =>{
        return (<QuoteRequestReview {...(fieldProps || {})} ></QuoteRequestReview>)
    }

    renderAuthorities = (fieldProps) =>{
        return (<AuthoritiesForm {...{...fieldProps, ...{form:this.formRef}} || {}} onChange={(val) => this.onChange(val, {fieldProps: fieldProps})} ></AuthoritiesForm>)
    }


    renderAutoComplete = () => {
    }

    renderFilesUploader = (fieldProps) => {
        return (<FilesUploader {...(fieldProps || {})} ></FilesUploader>)
    }

    renderInputField(formItem){

        const {type, elementRenderer, fieldProps} = formItem
        let inputField = ''

        if (elementRenderer){
            if (type === "selectField"){
                inputField = elementRenderer(fieldProps, {onSelect: this.onSelect})
            }else {
                inputField = this.renderSelect(fieldProps)
            }
        }
        else if(type === "addressField"){
            inputField =  this.renderAddressInput(fieldProps)
        }
        else if (type === "TimeRangePickerField"){
            inputField = this.renderTimeRangePicker(fieldProps)
        }else if (type === "DateRangePickerField"){
            inputField = this.renderDateRangePicker(fieldProps)
        }else if (type === "DatePickerField"){
            inputField = this.renderDatePicker(fieldProps)
        }else if (type === "textField"){
            inputField =  this.renderTextInput(fieldProps)
        }else if (type === "passwordField"){
            inputField =  this.renderPasswordInput(fieldProps)
        }else if (type === "sliderField"){
            inputField =  this.renderSliderInput(fieldProps)
        }else if (type === "phoneField"){
            inputField = this.renderPhoneInput(fieldProps)
        }else if (type === "numberField"){
            inputField = this.renderNumberInput(fieldProps)
        }else if (type === "radioGroupField"){
            inputField = this.renderRadioGroup(fieldProps)
        }else if(type === "dataView") {
            inputField = this.renderDataView(fieldProps)
        }else if (type === "Checkbox"){
            inputField = this.renderCheckbox(fieldProps)
        }else if (type === "CheckboxGroup"){
            inputField = this.renderCheckboxGroup(fieldProps)
        }else if (type === "selectField"){
            inputField = this.renderSelect(fieldProps)
        }else if (type === "tagField"){
            inputField = this.renderSelectTag(fieldProps)
        }
        else if (type === "QuoteRequestReview"){
            inputField = this.renderQuoteRequestReview(fieldProps)
        }
        else if (type === "Authorities"){
            inputField = this.renderAuthorities(fieldProps)
        }
        else if (type === "filesUploader"){
            inputField = this.renderFilesUploader(fieldProps)
        }
        else {
            return <div></div>
        }

        return inputField
    }

    renderInputSection = (section) => {
        /*
        Section contains group of items
        */

        let InputItems = ""

        if (section.items){
            InputItems = section.items.map(item=> this.renderItem(item))
        }

        else if (section.groups){
            InputItems = section.groups.map(group => this.renderGroupItems(group))
        }
        return InputItems
    }

    renderGroupItems = (group) => {
        let groupItemsRender = ""
        let groupWrapperComponentProps = {}
        // eslint-disable-next-line
        let groupWrapperComponent = Box


        let addSetItemButton = ""

        if (group.mode === "multiple"){
            addSetItemButton = <Button onClick={() =>this.addGroupNewItemSet(group)}>Add</Button>
        }
        if (group.groupWrapper){
            if (group.groupWrapper.type === "box"){
                groupWrapperComponent = Box
                groupWrapperComponentProps = {...(group.groupWrapper.props || {})}
            } else if (group.groupWrapper.type === "card"){
                groupWrapperComponent = Card

                if (group.mode === "multiple"){
                    groupWrapperComponentProps = {...(group.groupWrapper.props || {})}
                    // groupWrapperComponentProps["extra"] = <div>{addSetItemButton}{removeSetItemButton}</div>
                } else{
                    groupWrapperComponentProps = {...(group.groupWrapper.props || {})}
                }
            }else{
                groupWrapperComponent = Box
                groupWrapperComponentProps = {...(group.groupWrapper.props || {})}
            }
        }

        if (group.itemSets) {
            groupItemsRender = <Row><Col>{Object.keys(group.itemSets).map((itemSetId, index) =>{
                  const itemSet = group.itemSets[itemSetId]
                  let extra = ""
                  if (group.mode === "multiple"){
                      const removeSetItemButton = <Button onClick={() => this.removeGroupItemsFields(group, itemSetId)}>Remove</Button>
                      extra = <div>{addSetItemButton}{removeSetItemButton}</div>
                  }

                  const items = <Row gutter={[16, 24]}>{itemSet.map((formItem, i) =>
                    <Col {... formItem.wrapperCol} key={'formBox-col' + i}>{this.renderItem(formItem)} </Col>)}
                  </Row>
                 const  newgroupWrapperComponentProps = { extra: extra, ...groupWrapperComponentProps}
                  return <Col {... group.wrapperCol}><Card {... newgroupWrapperComponentProps} >{items}</Card></Col>
              }
            )}</Col></Row>
        }else {
            const items = <Row gutter={[20, 24]}>{(group.items|| []).map((formItem, i) => {
                return <Col {... formItem.wrapperCol} key={'formBox-col' + i + 1}> {this.renderItem(formItem)}</Col>
            })}</Row>

            if (group.groupWrapper.type === "box"){
                groupItemsRender =  <Box {... groupWrapperComponentProps}>{items}</Box>
            }else if(group.groupWrapper.type === "card"){
                groupItemsRender = <Card {... groupWrapperComponentProps}>{items}</Card>
            }else{
                groupItemsRender =  <div {... groupWrapperComponentProps}>{items}</div>
            }
            groupItemsRender = <Row><Col {... group.wrapperCol}>{groupItemsRender}</Col></Row>
        }

        return groupItemsRender
    }


    renderItem = (formItem) => {

        const fieldProps = formItem.fieldProps || {}
        const formItemProps = formItem.formItemProps || undefined
        if (fieldProps.addonAfter){
            fieldProps.addonAfter = this.renderItem(fieldProps.addonafter)
        }
        if (fieldProps.addonBefore){
            fieldProps.addonBefore = this.renderItem(fieldProps.addonBefore)
        }

        if (fieldProps.optionsLabelValue){
            const optionsLabelValue = fieldProps.optionsLabelValue || []
            let optionsType = "label_value" ;
            if (["map", "label_value"].includes(fieldProps.optionsType)){
                optionsType = fieldProps.optionsType
            }

            let options = []
            optionsLabelValue.forEach(option_label =>
              {

                  if (option_label.multiple){

                      const field_names = this.getItemSetFieldNames(option_label.field)

                      field_names.forEach(field_name => {
                          const value = this.formRef.current.getFieldValue(field_name)
                          if (value){
                              options.push({
                                  "label": value[option_label.label],
                                  "value": value
                              })
                          }
                      })

                  }else {
                      const value = this.formRef.current.getFieldValue(option_label.field) || {}
                      const val = value[option_label.value] || value
                      if (option_label.label){
                          options.push({
                              "label": value[option_label.label],
                              "value": val
                          })
                      }
                  }
              }
            )
            if (optionsType === "map"){
                options = KeyValtoObject(options, 'label', "value")
            }
            fieldProps[fieldProps.optionsProp || "options"] = options
        }
        
        
        formItemProps.name = formItemProps.name ? formItemProps.name: formItem.name
        fieldProps.name = fieldProps.name ? fieldProps.name: formItem.name

        if (formItemProps.initialFormValue){
            formItemProps.initialValue = this.formRef.current.getFieldValue(formItemProps.initialFormValue)
        }


        if (Array.isArray(formItemProps.initialFormSetValue) && formItemProps.initialFormSetValue.length === 2){
            const {itemSetsFields} = this.state
            const fieldName = formItemProps.initialFormSetValue[0]
            const fieldIndex = formItemProps.initialFormSetValue[1]
            try{
                formItemProps.initialValue = this.formRef.current.getFieldValue(itemSetsFields.fields[fieldName][fieldIndex].name)
            }catch(error){
                console.error(error)
            }

        }
        
        // formItemProps.hide = formItemProps.hide ? formItemProps.hide : true ;

        return <React.Fragment>
             {formItemProps.load !== false ?
            <Form.Item {... formItemProps || {}}   >
               {this.renderInputField(formItem)}
            </Form.Item> : ""}
            {formItemProps.infoBubble ?
              <InfoBubble title={formItemProps.infoBubble.title} content={formItemProps.infoBubble.content}/>
              :""
            }
        </React.Fragment>

    }

    render(){
        const formBox = this.renderFormBox()
        if (formBox){
            return formBox
        }else{
            return <Box></Box>
        }


    }
}

FormBox.propTypes = {
    intl: intlShape.isRequired
}

export default injectIntl(FormBox);
