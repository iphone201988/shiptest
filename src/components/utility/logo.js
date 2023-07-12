import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import {get_route_path} from "constants/routes";

import normal_Logo from "images/logo_sh_70.png";
import collapsed_Logo from "images/favicon-70x70.png";

class Logo extends Component{
  render(){
    const {locale, collapsed} = this.props
    const logo =  collapsed ? collapsed_Logo : normal_Logo

    return (
        <div className="isoLogoWrapper">
            <Link to={get_route_path("web", "app", locale)}><img src={logo} alt="ShipHaul" /></Link>
        </div>
    );
  }
}

export default connect(
    state => ({
      ...state.App,
      locale: state.LanguageSwitcher.language.locale,
    }),
)(Logo);

