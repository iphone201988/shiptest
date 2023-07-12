import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, ConfigProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import { Debounce } from 'react-throttle';
import PropTypes from 'prop-types'
import WindowResizeListener from 'react-window-size-listener';
import { ThemeProvider } from 'styled-components';
import appActions from 'helpers/redux/app/actions';
import Sidebar from 'containers/Sidebar/Sidebar';
import sideBarOptions from "./SideBarOptions"
import Topbar from '../AdminTopbar/Topbar';
import ThemeSwitcher from '../ThemeSwitcher/index';
import AppRouter from './AppRouter';
import { siteConfig } from 'settings/index';
import { AppLocale } from '../../dashApp';
import themes from 'settings/themes/index';
import AppHolder from './commonStyle';
import './global.css';
import IntlMessages from "components/utility/intlMessages";
import {Redirect} from "react-router-dom";
import {get_route_path} from "constants/routes";
import Loader from "components/utility/loader";
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from "redux";
import Admin from "model/admin/admin";
import AdminUser from "model/user/admin_user";

const { Content, Footer } = Layout;
const { toggleAll } = appActions;

const DOMAIN = "admin"

export class App extends Component {

  static propTypes = {
    auth: PropTypes.object,
    userId: PropTypes.string,
    companyUser: PropTypes.object,
    companyId: PropTypes.string,
    company:PropTypes.object,
    setUserId: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
    setCompany: PropTypes.func.isRequired,
    setCompanyId: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      isLoggedIn: false,
      isEmailVerified: false,
      UserDomain: DOMAIN
    };

  }

  componentDidMount() {

    this.props.firebase.auth().onIdTokenChanged((user) => {
      let is_logged = false
      let is_email_verified = false
      let userDomain = DOMAIN
      let _this = this
      if (user) {
        is_email_verified=user.emailVerified
        try{
          _this.props.setUserId(user.uid)
        }catch (e) {
          console.log(e)
        }

        user.getIdTokenResult().then(IdTokenResult=>  {
          let claims = IdTokenResult.claims;
          if (claims.domain){
            is_logged = true
            userDomain = claims.domain
          }
          if (claims.company_id){
            this.props.setCompanyId(claims.company_id)
          }
          this.setState({ loading: false , isLoggedIn: is_logged,
            isEmailVerified: is_email_verified, UserDomain: userDomain});
        })
      }else{
        this.setState({ loading: false , isLoggedIn: is_logged,
          isEmailVerified: is_email_verified, UserDomain: userDomain});
      }

    });
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {

    if (nextProps.companyUser && nextProps.companyUser !== this.props.companyUser){
      this.props.setUser(nextProps.companyUser)
    }
    if (nextProps.company && nextProps.company !== this.props.company){
      this.props.setCompany(nextProps.company)
    }
  }

  render() {

    const {
      isLoggedIn,
      loading,
      isEmailVerified,
      UserDomain
    } = this.state

    if (loading) {
      return (
        <Loader/>
      )
    }
    else
    {
      if (!isLoggedIn) {
         if (UserDomain === "shipper") {
          return (<Redirect to={get_route_path("web", "shipperSignin")} />)
        }
        else if (UserDomain === "carrier") {
          return (<Redirect to={get_route_path("web", "carrierSignin")} />)
        }
        else if (UserDomain === "admin") {
          return (<Redirect to={get_route_path("web", "adminSignin")} />)
        }
        
      }
      else{
        if (UserDomain !== DOMAIN) {
          return (<Redirect to={get_route_path(UserDomain, "app")} />)
        }

        const { url } = this.props.match;
        const { locale, selectedTheme, height } = this.props;
        const currentAppLocale = AppLocale[locale];
        const appHeight = window.innerHeight;

        var content = ""
        if (!isEmailVerified){
          content = <div><IntlMessages id="general.forbid.confirm_email"/> <a href={window.location.href}>
            <IntlMessages id="Then refresh the page"/></a></div>
        }else{
          content = <AppRouter url={url}/>
        }

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
                    <Topbar url={url} />

                    <Layout style={{ flexDirection: 'row', overflowX: 'hidden' }}>
                      <Sidebar url={url} options={sideBarOptions}/>
                      <Layout
                        className="isoContentMainLayout"
                        style={{
                          height: height
                        }}
                      >


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
                    <ThemeSwitcher />
                  </Layout>
                </AppHolder>
              </ThemeProvider>
            </IntlProvider>
          </ConfigProvider>
        );
      }
    }


  }
}

const mapStateToProps = (state)  => {
  return {
    auth: state.FB.firebase.auth,
    companyId: state.FB.company.companyId,
    userId: state.FB.companyUser.userId,
    companyUser: state.FB.firestore.data["User"] ? state.FB.firestore.data["User"] : null,
    company: state.FB.firestore.data["Company"] ? state.FB.firestore.data["Company"] : null,
    locale: state.LanguageSwitcher.language.locale,
    selectedTheme: state.ThemeSwitcher.changeThemes.themeName,
    height: state.App.height
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUserId: userId => dispatch({ type: 'setUserId', userId: userId }),
    setUser: user => dispatch({ type: 'setUser', user: new AdminUser(user.uid, user) }),
    setCompany: company => dispatch({ type: 'setCompany', company: new Admin(company.id, company) }),
    setCompanyId: companyId => dispatch({ type: 'setCompanyId', companyId: companyId}),
    toggleAll
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((props) => {

    let queries = []
    if (props.companyId){
      queries.push( {
        collection: 'Companies',
        doc: props.companyId,
        storeAs: "Company",
      })
    }
    if (props.userId){
      queries.push(  {
        collection: 'Users',
        doc: props.userId,
        storeAs: "User"
      })
    }
    return queries

    }
  )
)(App)
