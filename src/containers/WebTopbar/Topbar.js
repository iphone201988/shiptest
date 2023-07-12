import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "antd/es/layout"
import appActions from "helpers/redux/app/actions";
import IntlMessages from 'components/utility/intlMessages';

import TopbarDashboard from "./topbarDashboard";
import TopbarLocale from "./topbarLocale";
import TopbarWrapper from "./topbar.style";
import Menu from "components/uielements/menu";
import Link from "react-router-dom/Link";
import Logo from "components/utility/logo";

const { Header } = Layout;

const SubMenu = Menu.SubMenu;

const {
    toggleCollapsed
} = appActions;
const stripTrailingSlash = str => {
    if (str.substr(-1) === "/") {
        return str.substr(0, str.length - 1);
    }
    return str;
};

const options = [
    // {
    //     key: '',
    //     element: <Logo collapsed={false} /> ,
    //     label: "shiphaul"
    //     ,
    // },
    {
        key: 'shippers',
        label: 'web.sidebar.shippers',
    },
    {
        key: 'carriers',
        label: 'web.sidebar.carriers',
    },
    {
        key: 'about',
        label: 'web.sidebar.about',
    },
    {
        key: 'contact',
        label: 'web.sidebar.contact',
    },
];

class Topbar extends Component {

    getMenuItem = ({ singleOption, submenuStyle, submenuColor }) => {
        const { key, label, leftIcon, children, element } = singleOption;
        const url = stripTrailingSlash(this.props.url);
        if (children) {
            return (
                <SubMenu
                    key={key}
                    title={
                        <span className="isoMenuHolder" style={submenuColor}>
              <i className={leftIcon} />
              <span className="nav-text">
                <IntlMessages id={label} />
              </span>
            </span>
                    }
                >
                    {children.map(child => {
                        const linkTo = child.withoutDashboard
                            ? `/${child.key}`
                            : `${url}/${child.key}`;

                        return (
                            <Menu.Item style={submenuStyle} key={child.key}>
                                <Link style={submenuColor} to={linkTo}>
                                    {
                                        <IntlMessages id={child.label} />
                                    }
                                    {/*<IntlMessages id={child.label} />*/}
                                </Link>
                            </Menu.Item>
                        );
                    })}
                </SubMenu>
            );
        }
        return (
            <Menu.Item key={key}>
                <Link to={`${url}/${key}`}>
          <span className="isoMenuHolder" style={submenuColor}>
            <i className={leftIcon} />
              {element ? element :
                  <span className="nav-text">
                    <IntlMessages id={label} />
                  </span>
              }

          </span>
                </Link>
            </Menu.Item>
        );
    };

  render() {
    const { toggleCollapsed, url, customizedTheme, locale, pathname} = this.props;
    // const locale = this.props.locale || "en"
    const collapsed = this.props.collapsed && !this.props.openDrawer;

    const submenuStyle = {
        backgroundColor: "rgba(0,0,0,0)",
        color: customizedTheme.textColor
    };
    const submenuColor = {
        color: customizedTheme.textColor
    };

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
              {
                  this.props.view === "MobileView" ?
                      <button
                          className={
                              collapsed ? "triggerBtn menuCollapsed" : "triggerBtn menuOpen"
                          }
                          style={{ color: customizedTheme.textColor }}
                          onClick={toggleCollapsed}
                      />
                      :
                      <div>

                          <Menu
                              onClick={this.handleClick}
                              theme="dark"
                              className="isoDashboardMenu"
                              mode="horizontal"
                              selectable={false}
                          >
                              {options.map(singleOption =>
                                  this.getMenuItem({ submenuStyle, submenuColor, singleOption })
                              )}

                          </Menu>
                      </div>

              }


          </div>

          <ul className="isoRight">
            <li className="TopbarTitle">
              <TopbarDashboard locale={locale} />
            </li>
            <li className="TopbarTitle">
              <TopbarLocale locale={locale} url={url} pathname={pathname}/>
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
