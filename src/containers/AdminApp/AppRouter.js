import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import asyncComponent from "helpers/AsyncFunc";


export const route_map = {
  carrier: {
    path: 'carrier_accounts',
    component: asyncComponent(() => import('../AdminAccounts/carriers_account_page.js')),
  },
  shipper: {
    path: 'shipper_accounts',
    component: asyncComponent(() => import('../AdminAccounts/shippers_account_page.js')),
  },
  profile: {

    path: 'profile',

    component: asyncComponent(() => import('../AdminProfile')),

  },

  shipments: {

    path: 'shipments',

    component: asyncComponent(() => import('../AdminShipments/shipments_page')),

  },
  admin_users: {
    path: 'admin_users',
    component: asyncComponent(() => import('../AdminUsers/users_page')),

  },
  account_users: {
    path: 'account_users',
    component: asyncComponent(() => import('../AdminUsers/CarrierUsersPage.js')),
  },
  billing: {

    path: 'billing',

    component: asyncComponent(() => import('../AdminBilling/billing_page')),

  },

};

export const routes = Object.values(route_map)

class AppRouter extends Component {

  render() {

    const { url, style} = this.props;

    return (
      <div style={style}>
        {routes.map(singleRoute => {
          const { path, exact, ...otherProps } = singleRoute;
          return (
            <Route
              exact={exact === false ? false : true}
              key={singleRoute.path}
              path={`${url}/${singleRoute.path}`}
              {...otherProps}
            />
          );
        })}
      </div>
    );
  }
}

export default AppRouter;
