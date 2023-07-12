import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import asyncComponent from "helpers/AsyncFunc";
import {WEB_ROUTES} from "constants/routes";

export const route_map = {
  'home': {
    path: '',
    component: asyncComponent(() => import('../WebSite')),
  },
  // 'set_password': {
  //   path: WEB_ROUTES.setPassword,
  //   component: asyncComponent(() => import('../WebSite/SetPassword')),
  // },
  'shippers': {
    path:  WEB_ROUTES.shippers,
    component: asyncComponent(() => import('../WebSite/Shippers')),
  },
  'carriers': {
    path: WEB_ROUTES.carriers,
    component: asyncComponent(() => import('../WebSite/Carriers')),
  },
  // 'services': {
  //   path: WEB_ROUTES.services,
  //   component: asyncComponent(() => import('../WebSite/Services')),
  // },
  'about': {
    path: WEB_ROUTES.about,
    component: asyncComponent(() => import('../WebSite/About')),
  },
  'contact': {
    path: WEB_ROUTES.contact,
    component: asyncComponent(() => import('../WebSite/Contact')),
  },
  'carrier_signup': {
    path: WEB_ROUTES.carrierSignup,
    component: asyncComponent(() => import('../CarrierPages/Signup')),
  },
  'shipper_signup': {
    path: WEB_ROUTES.shipperSignup,
    component: asyncComponent(() => import('../ShipperPages/Signup')),
  },
  'admin_signup': {
    path: WEB_ROUTES.adminSignup,
    component: asyncComponent(() => import('../AdminPages/Signup')),
  },
  'shipper_signin': {
    path: WEB_ROUTES.shipperSignin,
    component: asyncComponent(() => import('../ShipperPages/Login')),
  },
  'carrier_signin': {
    path: WEB_ROUTES.carrierSignin,
    component: asyncComponent(() => import('../CarrierPages/Login')),
  },
  'admin_signin': {
    path: WEB_ROUTES.adminSignin,
    component: asyncComponent(() => import('../AdminPages/Login')),
  },
  'carrier_reset_password': {
    path: WEB_ROUTES.carrierResetPassword,
    component: asyncComponent(() => import('../CarrierPages/ResetPassword')),
  },
  'shipper_reset_password': {
    path: WEB_ROUTES.shipperResetPassword,
    component: asyncComponent(() => import('../ShipperPages/ResetPassword')),
  },
  'admin_reset_password': {
    path: WEB_ROUTES.adminResetPassword,
    component: asyncComponent(() => import('../AdminPages/ResetPassword')),
  },
  'carrier_forgot_password': {
    path: WEB_ROUTES.carrierForgotPassword,
    component: asyncComponent(() => import('../CarrierPages/ForgotPassword')),
  },
  'shipper_forgot_password': {
    path: WEB_ROUTES.shipperForgotPassword,
    component: asyncComponent(() => import('../ShipperPages/ForgotPassword')),
  },
  'admin_forgot_password': {
    path: WEB_ROUTES.adminForgotPassword,
    component: asyncComponent(() => import('../AdminPages/ForgotPassword')),
  },
  'carrier_verify_email': {
    path: WEB_ROUTES.carrierVerifyEmail,
    component: asyncComponent(() => import('../CarrierPages/VerifyEmail')),
  },
  'shipper_verify_email': {
    path: WEB_ROUTES.shipperVerifyEmail,
    component: asyncComponent(() => import('../ShipperPages/VerifyEmail')),
  },
  'admin_verify_email': {
    path: WEB_ROUTES.adminVerifyEmail,
    component: asyncComponent(() => import('../AdminPages/VerifyEmail')),
  },


};

export const routes = Object.values(route_map)

class AppRouter extends Component {
  render() {
    const { url, style, locale} = this.props;
    return (
      <div style={style}>
        {routes.map(singleRoute => {
          const { path, exact, ...otherProps } = singleRoute;
          return (
            <Route
              exact={exact === false ? false : true}
              key={singleRoute.path}
              path={`${url}/${singleRoute.path}`}
              locale={locale}
              {...otherProps}
            />
          );
        })}
      </div>
    );
  }
}

export default AppRouter;
