import React, { Component } from "react";
import { connect } from 'react-redux';
import appActions from "helpers/redux/app/actions";
import { Switch } from "antd";
import ToggleButtonStyle from "./topbar.style";


const { toggleSwitch } = appActions;
class ToggleButton extends React.Component {
  handleToggleChange = (checked) => {
    this.props.toggleSwitch(checked);
  }

  render() {
    const { toggleState } = this.props;
    return (
      <ToggleButtonStyle>
        <div>
          <Switch checked={toggleState} checkedChildren="Table" unCheckedChildren="Card" onChange={this.handleToggleChange} />
        </div>
      </ToggleButtonStyle>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    toggleState: state.App.toggleState,
  };
};

export default connect(mapStateToProps, { toggleSwitch })(ToggleButton);
