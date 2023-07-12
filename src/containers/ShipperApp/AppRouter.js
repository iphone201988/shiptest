import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import asyncComponent from "helpers/AsyncFunc";

export const route_map = {
  quotes_requests: {
    path: 'quote_requests',
    component: asyncComponent(() => import('../ShipperQuotes/quote_requests_page')),
  },
  shipments: {
    path: 'shipments',
    component: asyncComponent(() => import('../ShipperShipments/shipments_page')),
  },
  locations: {
    path: 'company_locations',
    component: asyncComponent(() => import('../ShipperLocations/company_location_page')),
  },
  // track: {
  //   path: 'track',
  //   component: asyncComponent(() => import('../ShipperTracking/TrackingPage')),
  // },
  // assets: {
  //   path: 'assets',
  //   component: asyncComponent(() => import('../ShipperAssets/assets_page')),
  // },
  users: {
    path: 'users',
    component: asyncComponent(() => import('../ShipperUsers/users_page')),
  },
  integrations_provider: {
    path: 'integrations/:provider',
    component: asyncComponent(() => import('../ShipperIntegrations/integrations_page')),
  },
  integrations: {
    path: 'integrations/',
    component: asyncComponent(() => import('../ShipperIntegrations/integrations_page')),
  },
  devices: {
    path: 'devices',
    component: asyncComponent(() => import('../ShipperDevices/devices_page')),
  },
  schedule: {
    path: 'schedule',
    component: asyncComponent(() => import('../Calendar/Calendar')),
  },
  settings: {
    path: 'settings',
    component: asyncComponent(() => import('../ShipperProfile')),
  },
  billing: {
    path: 'billing',
    component: asyncComponent(() => import('../ShipperBilling/billing_page')),
  },
  // new_billing_profile: {
  //   path: 'new_billing_profile',
  //   component: asyncComponent(() => import('../ShipperBilling/new_billing_profile')),
  // },
  billing_profiles: {
    path: 'billing_profiles',
    component: asyncComponent(() => import('../ShipperBilling/billing_page')),
  },
  // 'company_settings': {
  //   path: 'company_settings',
  //   component: asyncComponent(() => import('../ShipperProfile/company_settings')),
  // },
  documents: {
    path: 'documents',
    component: asyncComponent(() => import('../ShipperDocuments/shipments_documents')),
  },
  // 'user_settings': {
  //   path: 'user_settings',
  //   component: asyncComponent(() => import('../ShipperProfile/user_settings')),
  // },

  // 'quotes': {
  //   path: 'quotes',
  //   component: asyncComponent(() => import('../ShipperQuotes/quote_requests')),
  // },
  // 'new_quote': {
  //   path: 'new_quote',
  //   component: asyncComponent(() => import('../ShipperQuotes/new_quote')),
  // },
  // 'quotes_offers': {
  //   path: 'quotes_offers',
  //   component: asyncComponent(() => import('../ShipperQuotes/quote_offers_page')),
  // },

  invoice: {
    path: 'invoice',
    component: asyncComponent(() => import('../Invoice')),
  },
  payment_methods: {
    path: 'payment_methods',
    component: asyncComponent(() => import('../ShipperBilling/payment_methods')),
  },
};

export const routes = Object.values(route_map)

class AppRouter extends Component {
  render() {
    const { url, style } = this.props;
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
