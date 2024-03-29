import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "antd/es/layout"
import appActions from "helpers/redux/app/actions";
import TopbarNotification from "./topbarNotification";
import TopbarMessage from "./topbarMessage";
import TopbarSearch from "./topbarSearch";
import TopbarUser from "./topbarUser";
import TopbarWrapper from "./topbar.style";
// import ToogleButton from "../Topbar/toggleButton";
const { Header } = Layout;
const { toggleCollapsed } = appActions;

class Topbar extends Component {
  render() {
    const { toggleCollapsed, customizedTheme, locale } = this.props;
    const collapsed = this.props.collapsed && !this.props.openDrawer;
    const styling = {
      background: customizedTheme.backgroundColor,
      position: "fixed",
      width: "100%",
      height: 70
    };
    return (
      <TopbarWrapper>
        <Header
          style={styling}
          className={
            collapsed ? "isomorphicTopbar collapsed" : "isomorphicTopbar"
          }
        >
          <div className="isoLeft">
            <button
              className={
                collapsed ? "triggerBtn menuCollapsed" : "triggerBtn menuOpen"
              }
              style={{ color: customizedTheme.textColor }}
              onClick={toggleCollapsed}
            />
          </div>

          <ul className="isoRight">
            <li className="isoSearch">
              <TopbarSearch locale={locale} />
            </li>

            <li
              onClick={() => this.setState({ selectedItem: "notification" })}
              className="isoNotify"
            >
              <TopbarNotification locale={locale} />
            </li>

            <li
              onClick={() => this.setState({ selectedItem: "message" })}
              className="isoMsg"
            >
              <TopbarMessage locale={locale} />
            </li>
            {/* <li  className="isoToogle" >
              <ToogleButton {...this.props} />
            </li> */}
            {/*<li*/}
              {/*onClick={() => this.setState({ selectedItem: "addToCart" })}*/}
              {/*className="isoCart"*/}
            {/*>*/}
              {/*<TopbarAddtoCart url={url} locale={locale} />*/}
            {/*</li>*/}

            <li
              onClick={() => this.setState({ selectedItem: "user" })}
              className="isoUser"
            >
              <TopbarUser locale={locale} />
            </li>
          </ul>
        </Header>
      </TopbarWrapper>
    );
  }
}

export default connect(
  state => ({
    ...state.App,
    locale: state.LanguageSwitcher.language.locale,
    customizedTheme: state.ThemeSwitcher.topbarTheme
  }),
  { toggleCollapsed }
)(Topbar);
