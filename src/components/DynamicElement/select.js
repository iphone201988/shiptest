import React, {Component} from "react";
import {Col} from 'antd/es/grid/';

import Icon from "antd/es/icon";
import {PropTypes} from "prop-types";
import Button from "../uielements/button";
import {InputGroup} from "components/uielements/input";
import Select from "components/uielements/select";
import {ElementListToDict} from "helpers/data/mapper";

const uuidv1 = require('uuid/v1');

const _ = require('underscore')

export default class DynamicSelect extends Component {

  constructor(props){

    let INITIAL_SERVICES = {
      Elements:{},
      Initiated: false,
    }
    if (props.Elements){
      INITIAL_SERVICES['Elements'] = ElementListToDict(props.Elements)
      // if (props.onChange){
      //   props.onChange(Object.values(props.Elements))
      // }
    }

    super(props);
    this.state = { ...INITIAL_SERVICES };
  }



  componentDidMount(){
    const {Initiated, Elements} = this.state

    if (!Initiated){
      if (Elements.length === 0){
        this.addDynamicElement()
      }
      this.setState({"Initiated": true})
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    if (! _.isEqual(this.props.Elements, nextProps.Elements)){
      this.setState({Elements:  ElementListToDict(nextProps.Elements)})
      // if (this.props.onChange){
      //   this.props.onChange(Object.values(this.state.Elements))
      // }
    }
  }

  onChange = (serviceKey, value) => {

    const {Elements} = this.state
    Elements[serviceKey] =  value
    this.setState({"Elements": Elements})
    if (this.props.onChange){
      this.props.onChange(Object.values(this.state.Elements))
    }

  }

  renderDynamicsSelect = (serviceKey, options, {width=200, defaultValue=""}={}) => {
    const {placeholder} = this.props

    return (
        <Select
            onChange={(val) => {(this.onChange(serviceKey, val))}}
            style={{ width: width }}
            placeholder={placeholder}
            value={defaultValue}
        >
          {options.map((e) => {
            let label = this.context.intl.formatMessage({id: e.value.name})
            return <option value={e.key}> {label}</option>
          })}
        </Select>
    )

  }

  renderDynamicElement = (serviceKey) => {
    const {title, options} = this.props
    const {Elements} = this.state

    return(
        <div>
          <InputGroup compact>
            {title ?  <Col span={3}>{title}</Col> : ""}
            <Col span={6}>{this.renderDynamicsSelect(serviceKey, options, {defaultValue: Elements[serviceKey]})}</Col>
            <Col span={3}><Button type="dashed" onClick={() => {this.removeDynamicElement(serviceKey)}} style={{ width: '100%' }}>
              <Icon type="minus" /> Remove
            </Button>
            </Col>
          </InputGroup>
        </div>
    )
  }


  addDynamicElement = () => {
    let {Elements} = this.state
    Elements[uuidv1()] = ""
    this.setState({Elements: Elements})
  }

  removeDynamicElement = (serviceKey) => {
    let {Elements} = this.state
    if (Object.keys(Elements).length >= 1){
      delete Elements[serviceKey]
    }
    this.setState({Elements: Elements})
  }

  render(){

    const {title} = this.props
    const {Initiated, Elements} = this.state

    if (Initiated){

      const renderedDynamics =  Object.keys(Elements).map(key => {
        return (this.renderDynamicElement(key))
      })

      return (
          <div>
            {renderedDynamics}
            <div>
              <Button type="dashed" onClick={this.addDynamicElement} style={{ width: '60%' }}>
                <Icon type="plus" /> Add {title}
              </Button>
            </div>
          </div>

      )
    }else {return ("")}

  }

}

DynamicSelect.contextTypes = {
  intl: PropTypes.object.isRequired,
};
