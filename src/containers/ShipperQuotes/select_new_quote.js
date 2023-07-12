import React, { PureComponent } from "react";
import { BoxWrapper } from "components/utility/box.style";
import Loader from "components/utility/loader";
import FormBox from "../base/form_box";
import {getSpan, spans} from "constants/layout/grids";
import {locationFiltersQuotes} from "constants/options/filters"
import { connect } from "react-redux";
import {injectIntl, intlShape,} from "react-intl";
import {compose} from "redux";
import {firebaseConnect} from "react-redux-firebase";
import {Capitalize} from "helpers/data/string";
import {Card, Space} from "antd"
import IntlMessages from "components/utility/intlMessages";
import {DeliveryCellInfo, PickupCellInfo} from "components/Shipment/ShipmentComponents";
import Button from "components/uielements/button.js";
import DataView from "../base/data_view";
import {PropTypes} from "prop-types";

class SelectNewQuote extends PureComponent {

  static propTypes = {
    companyId: PropTypes.string,
  }

  constructor(props) {
    super(props);
    console.log(this.props)
    this.INITIAL_STATE = {
      formInputs: undefined,
      loading: false,
      chooseTemplate: false,
      actionState: "",
    }
    this.state = { ...this.INITIAL_STATE }
    this.state.selectionReady = false
    this.state.quote = {}
    this.state.visible = false
  }

  updateSelection = (value) => {
    const {form, itemSetsFields} = value
    if (true) {
      const action_type = form.getFieldValue("action_type")
      this.setState({action_type : action_type})
      this.setState({confirmationReady : true})
    }
  }

  handleActiveTemplate = (e) => {
    this.setState({quote: e[0]})
  }

  useTemplate = (item) => {
    this.props.onDone("use_template", item, true)
  }

  onDone(){
    if (this.props.onDone) {
      this.props.onDone(this.state.actionState, this.state.quote, true)
    }
  }

  openNewQuote = (action) => {
    this.props.onDone("new_quote", this.state.quote, true)
  }

  openNewTemplate = () => {
    this.props.onDone("new_template", this.state.quote, true)
  }

  render() {
    const {loading} = this.state;

    if(loading) {
      return <Loader></Loader>
    }
    
    return (
     <Card>
       <Space>
       <Button type="primary" onClick={this.openNewQuote}><IntlMessages id="shipment.create_quote"></IntlMessages></Button>
       <Button type="primary" onClick={this.openNewTemplate}><IntlMessages id="shipment.mock_quote"></IntlMessages></Button>
       <Button type="primary" onClick={this.openNewTemplate}><IntlMessages id="shipment.create_template"></IntlMessages></Button>
       <Button type="primary" onClick={this.props.showTemplates}><IntlMessages id="general.use_template"></IntlMessages></Button>
       </Space>
       <div>
      {this.state.visible ? 
      <DataView 
        itemType={"shipment_template"}
        queryFilterConditions={[{ "field": "shipper", "op": "==", "val": this.props.companyId }, { "field": "active", "op": "==", "val": true }]}
        resultsFilterConditions={[]}
        columns={this.getColumns()}
        itemActions={this.getItemActions()}
        viewType={"table"}
        hasLocationFilters={locationFiltersQuotes}
        layouts={[{ key: 'table', sections: [{ type: 'table', span: 24 }] }]}
      ></DataView> : ""}
      </div>
     </Card>
    )
  }
}

SelectNewQuote.propTypes = {
  intl: intlShape.isRequired,
};


const mapStateToProps = state => {
  return {
    companyId: state.FB.company.companyId,
  }
}

export default compose(
  connect(mapStateToProps, {}),
  firebaseConnect()
)(injectIntl(SelectNewQuote))
