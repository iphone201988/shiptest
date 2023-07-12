import React, { Component } from "react";
import { connect } from "react-redux";
import { RadioGroup, RadioButton } from "components/uielements/radio";
import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
import ShipmentDocuments from "../Shipments/shipment_documents";
import NewShipmentDocumentSelect from "../Shipments/new_shipment_document_select";

class ShipmentDocumentsView extends Component {

    INITIAL_STATE = {
        view: "list",
    }

    constructor(props) {
        super(props);
        this.state = { ...this.INITIAL_STATE };
    }

    onDone = () => {
        this.setState({view: "list"})
        if (this.props.onDone){
            this.props.onDone()
        }
    }

    renderTabContent = () => {
        const {view} = this.state
        const {shipmentId} = this.props

        let tabView = ""
        if (view === "new"){
            tabView = <NewShipmentDocumentSelect shipmentId={shipmentId} onDone={this.onDone}/>
        }else if (view === "list"){
            tabView = <ShipmentDocuments shipmentId={shipmentId}/>
        }else{
            tabView = ""
        }
        return tabView
    }

    render() {
        const {view} = this.state

        return (

            <LayoutWrapper>
                <Box>
                    <RadioGroup
                        buttonStyle="solid"
                        id="view"
                        name="view"
                        value={view}
                        onChange={event => {
                            this.setState({view: event.target.value})
                        }}
                    >
                        <RadioButton value="new"><IntlMessages id="general.action.add_document"/></RadioButton>
                        <RadioButton value="list"><IntlMessages id="general.documents"/></RadioButton>
                    </RadioGroup>
                    {this.renderTabContent()}
                </Box>
            </LayoutWrapper>

        );
    }
}

export default connect()(ShipmentDocumentsView);