import React, { Component } from "react";
import moment from "moment";
import Modal from "components/feedback/modal";
import EventForm from "./event_form";

//date format: RFC2822
const dateFormat = "ddd MMM DD YYYY HH:mm:ss ZZ";

export default class extends Component {
  handleCancel = () => {
    this.props.setModalData("cancel");
  };
  
  render() {
    const { modalVisible, selectedData } = this.props;
    
    let visible = modalVisible ? true : false;
    if (!visible) {
      return <div />;
    }
    let startDate = moment(selectedData.start.toString(), dateFormat);
    let endDate = moment(selectedData.end.toString(), dateFormat);
    selectedData.start = startDate;
    selectedData.end = endDate;

    return (
      <div>
        <Modal
          title={modalVisible === "update" ? "Update Event" : "Set Event"}
          visible={visible}
          onCancel={this.handleCancel}
          centered={true}
          footer={null}
          width={1000}
        >
          {<EventForm existingEventData={selectedData} closeForm={this.handleCancel}></EventForm>}
        </Modal>
      </div>
    );
  }
}
