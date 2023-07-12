import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, ConfigProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import { Debounce } from 'react-throttle';

import WindowResizeListener from 'react-window-size-listener';
import { ThemeProvider } from 'styled-components';
import appActions from 'helpers/redux/app/actions';
import Sidebar from 'containers/Sidebar/Sidebar';
import sideBarOptions from "./SideBarOptions"
import Topbar from '../WebTopbar/Topbar';
import AppRouter from './AppRouter';
import { siteConfig } from 'settings/index';
import { AppLocale } from '../../dashApp';
import themes from 'settings/themes/index';
import AppHolder from './commonStyle';
import './global.css';
import actions from 'helpers/redux/languageSwitcher/actions';
import {locale_map} from 'constants/language'

import Redirect from "react-router/es/Redirect";
import packageJson from '../../../package.json';
global.appVersion = packageJson.version;

const { changeLanguage } = actions;

const { Content, Footer } = Layout;
const { toggleAll } = appActions;

export class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
  }

  render() {
    const {url} = this.props.match
    const {pathname}  = this.props.location
    let locale = this.props.locale || "en_ca"
    if (url === '/'){
      return <Redirect from="/" to={`/${locale}`}/>
    }


    const {selectedTheme, changeLanguage } = this.props;

    const appHeight = window.innerHeight;

    const locale_url =  `/${this.props.match.params.locale_path}` || `/${locale}`
    locale = locale_url.slice(1,6)
    const currentAppLocale = AppLocale[locale];

    if (locale){
      changeLanguage(locale_map[locale].languageId);
    }

    var content = <AppRouter url={url} locale={locale}/>

    return (
        <ConfigProvider locale={currentAppLocale.antd}>
          <IntlProvider
              locale={currentAppLocale.locale}
              messages={currentAppLocale.messages}
          >
            <ThemeProvider theme={themes[selectedTheme]}>
              <AppHolder>
                <Layout style={{ height: appHeight }}>
                  <Debounce time="1000" handler="onResize">
                    <WindowResizeListener
                        onResize={windowSize =>
                            this.props.toggleAll(
                                windowSize.windowWidth,
                                windowSize.windowHeight
                            )
                        }
                    />
                  </Debounce>
                  <Topbar url={url} pathname={pathname}/>

                  <Layout style={{ flexDirection: 'row', overflowX: 'hidden' }}>
                    <Sidebar url={locale_url} options={sideBarOptions}/>
                    <Layout className="isoContentMainLayout">

                      <Content
                          className="isomorphicContent"
                          style={{
                            padding: '70px 0 0',
                            flexShrink: '0',
                            background: 'white',
                            position: 'relative'
                          }}
                      >
                        {content}
                      </Content>
                      <Footer
                          style={{
                            background: '#ffffff',
                            textAlign: 'center',
                            borderTop: '1px solid #ededed'
                          }}
                      >
                        {siteConfig.footerText}
                      </Footer>
                    </Layout>
                  </Layout>
                </Layout>
              </AppHolder>
            </ThemeProvider>
          </IntlProvider>
        </ConfigProvider>
    )


  }
}

export default connect(
    state => ({
      locale: state.LanguageSwitcher.language.locale,
      selectedTheme: state.ThemeSwitcher.changeThemes.themeName,
      height: state.App.height
    }),
    { toggleAll,  changeLanguage}
)(App);