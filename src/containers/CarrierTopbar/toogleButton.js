import React, { Component } from "react";
import { connect } from 'react-redux';
import appActions from "helpers/redux/app/actions";
import { Switch } from "antd";


const { toggleSwitch } = appActions;
console.log(appActions, "appA")
class ToggleButton extends React.Component {
  handleToggleChange = (checked) => {
    this.props.toggleSwitch(checked);
  }

  render() {
    const { toggleState } = this.props;
    console.log(this.props," this")
    return (
      <div>
        <Switch checked={toggleState} onChange={this.handleToggleChange} />
        <span>{toggleState ? 'ON' : 'OFF'}</span>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state,"state")
  return {
    toggleState: state.App.toggleState,
  };
};

export default connect(mapStateToProps, { toggleSwitch })(ToggleButton);
