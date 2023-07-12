import React, {Component} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import {injectIntl, intlShape} from "react-intl";
import Vehicle from "model/asset/vehicle";
import {notifyError, notifySuccess} from "components/notification";
import {FUEL_TYPES, TRUCK_CLASSES, VEHICLE_MAKES} from "constants/options/vehicles";
import {COLORS} from "constants/options/general";
import VPIC_VIN_API from "../../services/apis/external/vpic/vpic_api";
import {Capitalize} from "helpers/data/string";
import {addAsset} from "helpers/firebase/firebase_functions/assets";
import {BoxWrapper} from "components/utility/box.style";
import FormBox from "../base/form_box";
import {optionObjectToOptionsLabelValue} from "helpers/data/mapper";

const current_year = new Date().getFullYear()

class NewVehicle extends Component {

  constructor(props) {
    super(props);
    this.INITIAL_STATE = {
      formInputs: undefined,
      RedirectPage: false,
      loading: false,
      decoding: false,
      VIN: "",
      VehicleMakesOptions: [],
      VehicleModelOptions: [],
      FuelTypeOptions: [],
      ColorsOptions: []
    }
    this.state = {...this.INITIAL_STATE};
  }

  componentDidMount() {
    this.setOptions()
  }

  setOptions = (options) => {
    this.setState({
      VehicleMakesOptions: optionObjectToOptionsLabelValue(VEHICLE_MAKES, this.props.intl),
      TruckClassesOptions: optionObjectToOptionsLabelValue(TRUCK_CLASSES, this.props.intl),
      FuelTypeOptions: optionObjectToOptionsLabelValue(FUEL_TYPES, this.props.intl),
      ColorsOptions: optionObjectToOptionsLabelValue(COLORS, this.props.intl)
    }, this.setFormInputs)
  }

  onDone = () => {
    if (this.props.onDone){
      this.props.onDone()
    }
  }

  Loading = (loading) => {
    this.setState({loading: loading})
  }

  handleVINDecode = () => {
    const {form} = this.props
    const VIN = form.getFieldValue("VIN")
    this.setState({decoding: true})
		VPIC_VIN_API.decodeVIN({VIN: VIN}).then((result) => {
		  const GVWR = result.GVWR || ""
      const TruckClass = GVWR.toLowerCase().substring(0, GVWR.indexOf(":")).replace(" ", "_");

      form.setFieldsValue(
        {
          Make: Capitalize(result.Make || ""),
          Model: Capitalize(result.Model || ""),
          Year:  Capitalize(result.ModelYear || ""),
          TruckClass: TruckClass,
          FuelType:  result.FuelTypePrimary
        })
      this.setState({decoding: false})
    })
	}

  onSubmit = (values) => {
    this.Loading(true)

    const asset = new Vehicle(undefined, {
            profile: {
              "name": values.name,
              "color": values.color,
              "vin": values.vin,
              "make": values.make,
              "model": values.model,
              "year": values.year,
              "class": values.class,
              "license_plate_state": values.license_plate_state,
              "license_plate_number": values.license_plate_number,
              "fuel_type": values.fuel_type
            }
          })
      return addAsset(asset).then(res => {
        notifySuccess("notification.success.new_user", this.props.intl)
        this.onDone()
        this.Loading(false)
      }).catch(e => {
        notifyError("notification.fail.new_user", this.props.intl)
        this.Loading(false)
      })
  }

  setFormInputs = () =>{

    const {VehicleMakesOptions, TruckClassesOptions, FuelTypeOptions, ColorsOptions} = this.state

    const formInputs = {
      form_type: "regular",
      submit_label: this.props.intl.formatMessage({id:"general.submit"}),
      formProps:{
        layout: "horizontal"
      },
      sections: [
        {
          name: "name",
          size: "full",
          items: [
            {
              name: "name",
              type: "textField",
              formItemProps:{
                rules:[
                  {
                    required: true
                  }
                ],
                label : this.props.intl.formatMessage({id:"carrier.vehicle.name"}),
                labelCol: {
                  span: 2
                },
                wrapperCol: {
                  span: 22
                },
              },
              fieldProps:{
                placeholder: this.props.intl.formatMessage({id:"carrier.vehicle.name"}),
              },
            },
            {
              name: "vin",
              type: "textField",
              formItemProps:{
                rules:[
                  {
                    required: true,
                    message: this.props.intl.formatMessage({id: 'carrier.vehicle.vin.validation'}),
                  }
                ],
                label : this.props.intl.formatMessage({id:"carrier.vehicle.vin"}),
                labelCol: {
                  span: 2
                },
                wrapperCol: {
                  span: 22
                },
              },
              fieldProps:{
                placeholder: this.props.intl.formatMessage({id:"carrier.vehicle.vin"}),
              },
            },
            {
              name: "license_plate_number",
              type: "textField",
              formItemProps:{
                rules:[
                  {
                    required: true
                  }
                ],
                label : this.props.intl.formatMessage({id:"carrier.vehicle.license_plate"}),
                labelCol: {
                  span: 2
                },
                wrapperCol: {
                  span: 22
                },
              },
              fieldProps:{
                placeholder: this.props.intl.formatMessage({id:"carrier.vehicle.license_plate"}),
              },
            },
            {
              name: "make",
              type: "selectField",
              formItemProps:{
                hasFeedback: true,
                label : this.props.intl.formatMessage({id:"carrier.vehicle.make"}),
                labelCol: {
                  span: 2
                },
                wrapperCol: {
                  span: 22
                },
              },
              fieldProps:{
                // mode: "multiple",
                placeholder: this.props.intl.formatMessage({id:"carrier.vehicle.make.placeholder"}),
                options: VehicleMakesOptions,
              },
            },
            {
              name: "model",
              type: "textField",
              formItemProps:{
                hasFeedback: true,
                label : this.props.intl.formatMessage({id:"carrier.vehicle.model"}),
                labelCol: {
                  span: 2
                },
                wrapperCol: {
                  span: 22
                },
              },
              fieldProps:{
                placeholder: this.props.intl.formatMessage({id:"carrier.vehicle.model"}),
              },
            },
            {
              name: "year",
              type: "numberField",
              formItemProps:{
                hasFeedback: true,
                label : this.props.intl.formatMessage({id:"carrier.vehicle.year"}),
                labelCol: {
                  span: 2
                },
                wrapperCol: {
                  span: 22
                },
              },
              fieldProps:{
                min: current_year-30,
                max: current_year+1,
                placeholder: this.props.intl.formatMessage({id:"carrier.vehicle.year"}),
              },
            },
            {
              name: "class",
              type: "selectField",
              formItemProps:{
                hasFeedback: true,
                label : this.props.intl.formatMessage({id:"carrier.vehicle.class"}),
                labelCol: {
                  span: 2
                },
                wrapperCol: {
                  span: 22
                },
              },
              fieldProps:{
                // mode: "multiple",
                placeholder: this.props.intl.formatMessage({id:"carrier.vehicle.class"}),
                options: TruckClassesOptions,
              },
            },
            {
              name: "fuel_type",
              type: "selectField",
              formItemProps:{
                hasFeedback: true,
                label : this.props.intl.formatMessage({id:"carrier.vehicle.fuel_type.name"}),
                labelCol: {
                  span: 2
                },
                wrapperCol: {
                  span: 22
                },
              },
              fieldProps:{
                placeholder: this.props.intl.formatMessage({id:"carrier.vehicle.fuel_type.placeholder"}),
                options: FuelTypeOptions,
              },
            },
            {
              name: "color",
              type: "selectField",
              formItemProps:{
                hasFeedback: true,
                label : this.props.intl.formatMessage({id:"general.color"}),
                labelCol: {
                  span: 2
                },
                wrapperCol: {
                  span: 22
                },
              },
              fieldProps:{
                placeholder: this.props.intl.formatMessage({id:"general.color"}),
                options: ColorsOptions,
              },
            },

              // ColorsOptions
          ]
        }
        ]
    }
    this.setState({formInputs: formInputs})
  }

  render() {

    const {formInputs} = this.state

    return (
        <BoxWrapper>
          {formInputs ?
              <FormBox
                  title={this.props.intl.formatMessage({id: 'users.actions.add_vehicle'})}
                  formInputs={formInputs}
                  onSubmit={this.onSubmit}
              />: ""}
        </BoxWrapper>
    )

  }
}

NewVehicle.propTypes = {
  intl: intlShape.isRequired
}

export default compose(connect(), firebaseConnect())(injectIntl(NewVehicle))