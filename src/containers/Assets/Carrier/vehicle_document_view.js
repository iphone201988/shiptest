import React, { Component } from "react";
import { connect } from "react-redux";
import { RadioGroup, RadioButton } from "components/uielements/radio";
import LayoutWrapper from "components/utility/layoutWrapper";
import IntlMessages from "components/utility/intlMessages";
import Box from "components/utility/box";
import VehicleDocuments from "./vehicle_documents"
import NewVehicleDocumentSelect from "./new_vehicle_document_select";

class VehicleDocumentsView extends Component {

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
        const {assetId} = this.props
        let tabView = ""
        if (view === "new"){
            tabView = <NewVehicleDocumentSelect assetId={assetId} onDone={this.onDone}/>
        }else if (view === "list"){
            tabView = <VehicleDocuments assetId={assetId}/>
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

export default connect()(VehicleDocumentsView);