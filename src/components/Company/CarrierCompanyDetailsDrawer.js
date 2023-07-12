import React from "react";
import {PropTypes} from "prop-types";
import Drawer from 'antd/es/drawer';
import CompanyAccount from 'model/company/company';
import CompanyDetailsView from './CompanyDetailsView';

export class CarrierCompanyDetailsDrawer extends React.PureComponent {
  state = { visible: false };

  constructor(props){
    const INITIAL_QUOTE = {
      visible: false,
      company: null,
      domain: 'carrier'
    }

    super(props);
    this.state = { ...INITIAL_QUOTE };
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
    if (this.props.onClose){
      this.props.onClose()
    }
  };

  componentDidUpdate(prevProps){

    if ((this.props.company instanceof CompanyAccount)
      && (prevProps.visible !== this.props.visible
        || prevProps.company !== this.props.company )) {
      this.setState(
        {
          visible: this.props.visible,
          company: this.props.company,
        })
    }
  }

  render() {
    const {company, visible} = this.state

    if (company == null){
      return ("")
    }

    return (

      <Drawer
        width="80%"
        placement="right"
        closable={true}
        onClose={this.onClose}
        visible={visible}
      >
        {visible ?
          <CompanyDetailsView
          company={company}
          domain={this.state.domain}
          /> : ""
        }
      </Drawer>
    );
  }

}

CarrierCompanyDetailsDrawer.contextTypes = {
  intl: PropTypes.object.isRequired,
};