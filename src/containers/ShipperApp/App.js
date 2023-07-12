import React, { Component } from 'react';
import { connect } from 'react-redux';
import {compose} from "redux";
import {firestoreConnect} from "react-redux-firebase";
import Layout from 'antd/es/layout'
import ConfigProvider from 'antd/es/locale-provider'
import { IntlProvider } from 'react-intl';
import { Debounce } from 'react-throttle';
import WindowResizeListener from 'react-window-size-listener';
import { ThemeProvider } from 'styled-components';
import appActions from 'helpers/redux/app/actions';
import Sidebar from 'containers/Sidebar/Sidebar'
import Topbar from '../ShipperTopbar/Topbar';
import ThemeSwitcher from '../ThemeSwitcher/index';
import AppRouter from './AppRouter';
import { siteConfig } from 'settings/index';
import { AppLocale } from '../../dashApp';
import themes from 'settings/themes/index';
import AppHolder from './commonStyle';
import './global.css';
import Loader from "components/utility/loader";
import IntlMessages from "components/utility/intlMessages";
import {Redirect} from "react-router-dom";
import {get_route_path} from "constants/routes";
import PropTypes from "prop-types";
import Shipper from "model/shipper/shipper";
import ShipperUser from "model/user/shipper_user";
import sideBarOptions from "./SideBarOptions"
import { fetchActiveBillingProfiles } from "helpers/redux/billing_profiles/actions/billing_profiles";
import {setCurrentCompany} from "../../helpers/redux/company/actions/currentCompany";


const { Content, Footer } = Layout;
const { toggleAll } = appActions;

const DOMAIN = "shipping"

export class App extends Component {

  static propTypes = {
    auth: PropTypes.object,
    userId: PropTypes.string,
    user: PropTypes.object,
    companyId: PropTypes.string,
    company:PropTypes.object,
    setUserId: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
    setCompany: PropTypes.func.isRequired,
    setCompanyId: PropTypes.func.isRequired,
    setDomain: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      isLoggedIn: false,
      isEmailVerified: false,
      UserDomain: DOMAIN,
      isDomainSet: false,
      isCompanySet: false,
    };

  }

  componentDidMount() {

    this.props.firebase.auth().onIdTokenChanged((user) => {
      const {isCompanySet, isDomainSet} = this.state ;
      let is_logged = false
      let is_email_verified = false
      let userDomain = DOMAIN
      if (user) {
        is_email_verified=user.emailVerified
        try{
          this.props.setUserId(user.uid)
        }catch (e) {
          console.log(e)
        }

        user.getIdTokenResult().then(IdTokenResult=>  {
          let claims = IdTokenResult.claims;
          if (claims.domain && !isDomainSet){
            is_logged = true
            userDomain = claims.domain
            this.props.setDomain(DOMAIN)
            this.setState({isDomainSet: true})
          }
          if (claims.company_id){
            if (!isCompanySet){
              this.props.setCompanyId(claims.company_id)
              this.setState({isCompanySet: true})
            }
            this.setState({ loading: false , isLoggedIn: is_logged,
              isEmailVerified: is_email_verified, UserDomain: userDomain});
            this.props.fetchActiveBillingProfiles(claims.company_id)
          }


        })}
      else{
        this.setState({ loading: false , isLoggedIn: is_logged,
          isEmailVerified: is_email_verified, UserDomain: userDomain});
      }
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.user && nextProps.user !== this.props.user){
      this.props.setUser(nextProps.user)
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
    }else
    {
      if (!isLoggedIn){
        if (UserDomain === "shipping"){
          return (<Redirect to={get_route_path("web", "shipperSignin")} />)
        }else if (UserDomain === "carrier") {
          return (<Redirect to={get_route_path("web", "carrierSignin")} />)
        }
        else if (UserDomain === "admin") {
          return (<Redirect to={get_route_path("web", "adminSignin")} />)
        }
        else{
          return (<Redirect to={get_route_path("web", "app")} />)
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
          content = <AppRouter url={url} />
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
    user: state.FB.firestore.data["User"] ? state.FB.firestore.data["User"] : null,
    company: state.FB.firestore.data["Company"] ? state.FB.firestore.data["Company"] : null,
    //company: state.FB.company.company ? state.FB.company.company : null,
    locale: state.LanguageSwitcher.language.locale,
    selectedTheme: state.ThemeSwitcher.changeThemes.themeName,
    height: state.App.height,
    domain: state.FB.company.domain,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    clearFirestore: () => dispatch({ type: '@@reduxFirestore/CLEAR_DATA'}),
    setUserId: userId => dispatch({ type: 'setUserId', userId: userId }),
    setUser: user => dispatch({ type: 'setUser', user: new ShipperUser(user.id, user)}),
    setDomain: domain => dispatch({ type: 'setDomain', domain: domain }),
    setCompany: company => dispatch({ type: 'setCompany', company: new Shipper(company.id, company) }),
    setCompanyId: companyId => dispatch({ type: 'setCompanyId', companyId: companyId}),
    // setCurrentCompany: (companyId) => setCurrentCompany(companyId, dispatch),
    fetchActiveBillingProfiles: (companyId) => fetchActiveBillingProfiles(companyId, dispatch),
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
