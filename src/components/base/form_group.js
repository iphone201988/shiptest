import _ from "lodash"
import React, {PureComponent} from "react";
import {injectIntl, intlShape} from "react-intl";
import FormField from "./form_field"
import {Col, Row} from "antd";
import {Box} from "./filter.style";
import Button from "../uielements/button";
import Card from "containers/Uielements/Card/card.style";
import Form from "../uielements/form";

class FormGroup extends PureComponent {

    INITIAL_STATE = {
        group: {},
        formRef: {}
    }

    constructor(props) {
        super(props);
        this.state = { ...this.INITIAL_STATE };
    }

    componentDidMount() {

        if (this.props.group){
            this.setGroup()
        }
        if (this.props.formRef){
            this.setState({formRef: this.props.formRef})
        }
    }

    applyItemIndex(item, index){
        item.name = item.name + index
    }

    addNewItemSet = () => {
        const group = _.cloneDeep(this.state.group)

        const index = (group.itemSets || []).length
        group.itemSets.push(group.items)
        group.itemSets[index].map(item => this.applyItemIndex(item, index))
        this.setState({group: group})
    }

    setGroup = () => {

        if (this.props.group.mode == "multiple"){
            const items = _.cloneDeep(this.props.group.items)
            items.map(item => this.applyItemIndex(item, 0))

            this.props.group.itemSets = [items]
        }

        this.setState({group: this.props.group})
    }

    renderItem = (input) => {
        const {formRef} =  this.state

        const fieldProps = input.fieldProps || {}
        const formItemProps = input.formItemProps || undefined

        if (fieldProps.addonAfter){
            fieldProps.addonAfter = this.renderItem(fieldProps.addonAfter)
        }
        if (fieldProps.addonBefore){
            fieldProps.addonBefore = this.renderItem(fieldProps.addonBefore)
        }

        const formField = <FormField {...fieldProps} type={input.type} formRef={formRef} name={input.name}/>

        return <formRef.Item {...formItemProps || {}} name={input.name} style={{height: '40px'}} >{formField}</formRef.Item>

    }

    renderGroupItems = () => {

        const {group} = this.state

        let groupItems = []

        if (group.itemSets){
            groupItems = group.itemSets.map(itemSet=> (itemSet || []).map(formItem => {
                return <Col {... formItem.wrapperCol || {}}>{this.renderItem(formItem)}</Col>
            }))
        }else{
            groupItems = (group.items || []).map(formItem => {
                return <Col {... formItem.wrapperCol || {}}>{this.renderItem(formItem)}</Col>
            })
        }

        let itemsRow = ""
        if (group.mode == "multiple"){
            itemsRow = <div><Row>{groupItems}</Row><Button onClick={() =>this.addNewItemSet()}>Add</Button></div>
        }else{
            itemsRow = <Row>{groupItems}</Row>
        }

        let groupItemsRender = ""

        if (group.groupWrapper){
            const wrapper = group.groupWrapper
            if (wrapper.type == "box"){
                groupItemsRender =  <Box {... (wrapper.props || {})}>{itemsRow}</Box>
            }else if (wrapper.type == "card"){
                groupItemsRender =  <Card {... (wrapper.props || {})}>{itemsRow}</Card>
            }else{
                groupItemsRender =  <div {... (wrapper.props || {})}>{itemsRow}</div>
            }
        }

        return groupItemsRender
    }


    render() {
        return this.renderGroupItems()
    }

}

FormGroup.propTypes = {
    intl: intlShape.isRequired
}

export default injectIntl(FormGroup);