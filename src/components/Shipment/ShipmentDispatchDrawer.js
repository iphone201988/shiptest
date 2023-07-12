import React from "react";
import {PropTypes} from "prop-types";
import {injectIntl, intlShape} from "react-intl";

import {Drawer, Col, Row} from 'antd';

import IntlMessages from "components/utility/intlMessages";
import Notification from "../notification";
import Form from 'components/uielements/form';
import Shipment from "model/shipment/shipment";
import {
  SHIPMENT_STATUS_PENDING
} from "constants/options/shipping";
import Select from "components/uielements/select";
import Button from "components/uielements/button";
import ShipmentService from "../../services/shipment"

import {compose} from "redux";
import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {DescriptionItem} from "helpers/views/elements";
import * as _ from 'helpers/data/underscore';


// const _ = require("underscore")

const FormItem = Form.Item;

const  DISPATCH_VALID_STATUSES = [SHIPMENT_STATUS_PENDING]

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
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 6,
    },
  },
};

const INITIAL_STATES = {
  visible: false,
  shipment: null,
  Submitting: false,
  drivers:  {},
  drivers_assignments: {}
}

export class ShipmentDispatchDrawer extends React.Component {
  state = { visible: false };

  static propTypes = {
    firebase: PropTypes.object,
    companyId: PropTypes.string,
    // drivers: PropTypes.arrayOf(PropTypes.object)
  }

  constructor(props){
    super(props);

    this.state = { ...INITIAL_STATES };
  }

  componentDidMount() {
		if (this.props.visible) {
			this.setState({visible: this.props.visible})
		}
		if (this.props.shipment) {
			this.setState({shipment: this.props.shipment})
		}
  }

  componentDidUpdate(prevProps) {

    if (prevProps.visible !== this.props.visible) {
      this.setState({visible: this.props.visible})
    }

    if ((this.props.shipment instanceof Shipment) && prevProps.shipment !== this.props.shipment) {
      this.setState(
          {
            shipment: this.props.shipment,
          })
    }
  }

  onClose = () => {
    this.setState({
      visible: false,
      shipment: null,
    });
    if (this.props.onClose){
      this.reset()
      this.props.onClose()
    }
  };

  reset = () => {
    this.setState({ ...INITIAL_STATES })
  }

  selectDriver(interconnection_id, user_id){

    try{
      const {drivers_assignments} = this.state

      if (interconnection_id == -1){
        drivers_assignments["all"] = user_id
      }else{
        drivers_assignments[interconnection_id] = user_id
      }
      this.setState({drivers_assignments: drivers_assignments})

    }catch (e){}
  }


  assignDrivers(){

    const {drivers_assignments, shipment} = this.state
    if (drivers_assignments){
      this.setState({Submitting: true})
      ShipmentService.assignShipmentDrivers(shipment.id, drivers_assignments, this.props.firebase.auth())
          .then(res => {
            Notification('success',  this.props.intl.formatMessage({id: "carrier.success_messages.driver_assigned"}))
            this.setState({Submitting: false})
            this.onClose()
          }).catch(e => {  this.setState({Submitting: false})})
    }
  }

  dispatchShipment(){
    return {

    }
  }

  get_colums = () => {
    return [
      {
        title: 'Action',
        key: 'x',
        width: '10%',
        dataIndex: '',
        render: (text, shipment, index) => (<span>
          <div>

            {DISPATCH_VALID_STATUSES.includes(shipment.status) ?
                <div>
                  <a onClick={()=> {this.dispatchShipment()}}>
                    {this.props.intl.formatMessage({id: "general.dispatch"})}</a>
                </div>
                : ""
            }
          </div>
        </span>)
      },
      {
        title: this.props.intl.formatMessage({id: "general.first_name"}),
        dataIndex: 'profile.first_name',
        rowKey: 'first_name',
        width: '10%',
        render: text => <span>{text}</span>,
      },
      {
        title: this.props.intl.formatMessage({id: "general.last_name"}),
        dataIndex: 'profile.last_name',
        rowKey: 'last_name',
        width: '10%',
        render: text => <span>{text}</span>,
      },
    ]
  }

  renderOneOrMultipleDriverRadio(){

  }

  printSingleDriverSelect(){
    const {shipment, Submitting} = this.state
    const {drivers}  = this.props

    // const interconnections = shipment.itinerary_sequence && shipment.itinerary_sequence.interconnections ? shipment.itinerary_sequence.interconnections : []
    let default_user_id = shipment.itinerary_sequence && shipment.itinerary_sequence.driver_assignments ?
      shipment.itinerary_sequence.driver_assignments.all : undefined
      //interconnections.length > 0 && interconnections[0].driver ? interconnections[0].driver : undefined
    const select = 
      <Select
        showSearch
        onChange={(user_id) => this.selectDriver(-1, user_id)}
        style={{ width: '80%' }}
        placeholder={this.props.intl.formatMessage({id: "carrier.role.driver.name.search_select"})}
        defaultValue={default_user_id}>
        {Object.values(drivers).map(user => {
          return <option value={user.id}>{user.profile.first_name} {user.profile.last_name}</option>
        })}
    </Select>

    return (
      <div>
        <Form>
          <DescriptionItem title={this.props.intl.formatMessage({id: 'carrier.role.driver.name'})} content={select}/>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" loading={Submitting} onClick={() => this.assignDrivers()}>
              <IntlMessages id="general.submit" />
            </Button>
          </FormItem>
        </Form>
      </div>)
  }

  printInterconnectionAssign(interconnection){

    const {drivers, Submitting} = this.state

    let default_user_id = undefined
		if (drivers[interconnection.driver]){
			interconnection.driver = drivers[interconnection.driver]
		}

    if (interconnection.driver && interconnection.driver.id){
      default_user_id = interconnection.driver.id
    }

    return (
        <div>
          <Row>{`${this.props.intl.formatMessage({id: 'shipment.origin.title'})}: ${interconnection.origin.label}`}</Row>
          <Row>{`${this.props.intl.formatMessage({id: 'shipment.destination.title'})}: ${interconnection.destination.label}`}</Row>
          <Row>
            <Col span={12}>

              <Form>
                <FormItem  label={this.props.intl.formatMessage({id: 'carrier.role.driver.name'})}>
                  <Select
                      showSearch
                      onChange={(user_id) => this.selectDriver(interconnection, user_id)}
                      style={{ width: '80%' }}
                      placeholder={this.props.intl.formatMessage({id: "carrier.role.driver.name.search_select"})}
                      defaultValue={default_user_id}
                  >
                    {Object.values(drivers).map(user => {
                      return <option value={user.id}>{user.profile.first_name} {user.profile.last_name}</option>
                    })}
                  </Select>
                </FormItem>

                <FormItem {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit" loading={Submitting} onClick={() => this.assignDrivers(interconnection)}>
                    <IntlMessages id="general.submit" />
                  </Button>
                  {/*<Button style={{ marginLeft: 8 }} onClick={this.handleReset}>*/}
                    {/*Cancel*/}
                  {/*</Button>*/}
                </FormItem>

              </Form>


            </Col>
            <Col span={12}>
            </Col>
          </Row>
        </div>
    )
  }

  printInterconnectionsAssign = () => {
    const {shipments} = this.state
      try{
        return (
          shipments.itinerary_sequence.interconnections.map(interconnection =>
            <div>
              {this.printInterconnectionAssign(interconnection)}
            </div>
          )
        )
      }catch (e) {
        return (<div></div>)
      }
     
  }

  handleSubmit(){

  }

  render() {
    const {shipment, drivers, visible} = this.state


    if (shipment == null){
      return ("")
    }

    return (
        <div>
          <Drawer
              width="70%"
              placement="right"
              closable={true}
              onClose={this.onClose}
              visible={visible}
          >
            {visible ?
              this.printSingleDriverSelect() : ""
              // this.printInterconnectionsAssign() : ""
            }
          </Drawer>
        </div>
    );
  }
}

ShipmentDispatchDrawer.propTypes = {
  intl: intlShape.isRequired
}


const mapStateToProps = state => {
  return {
    firebase: state.FB.firebase,
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((props) => {
    let queries = []

    return queries
  })
)(injectIntl(injectIntl(ShipmentDispatchDrawer)))




