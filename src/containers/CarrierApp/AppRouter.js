import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import asyncComponent from "helpers/AsyncFunc";


export const route_map = {
    quotes_requests: {
      path: 'quote_requests',
      component: asyncComponent(() => import('../CarrierQuotes/quote_requests_page')),
    },
    quotes_offers: {
      path: 'quote_offers',
      component: asyncComponent(() => import('../CarrierQuotes/quote_offers_page')),
    },
    shipments: {
      path: 'shipments',
      component: asyncComponent(() => import('../CarrierShipments/shipments_page')),
    },
    locations: {
      path: 'company_locations',
      component: asyncComponent(() => import('../CarrierLocations/company_location_page')),
    },
    // track: {
    //   path: 'track',
    //   component: asyncComponent(() => import('../CarrierTracking/TrackingPage')),
    // },
    trailers: {
      path: 'trailers',
      component: asyncComponent(() => import('../Assets/Carrier/trailers_page')),
    },
    vehicles: {
      path: 'vehicles',
      component: asyncComponent(() => import('../Assets/Carrier/vehicles_page')),
    },
    // marketplace: {
    //   path: 'marketplace',
    //   component: asyncComponent(() => import('../CarrierMarket/market_quotes')),
    // },
    users: {
      path: 'users',
      component: asyncComponent(() => import('../CarrierUsers/users_page')),
    },
    new_vehicle: {
      path: 'new_vehicle',
      component: asyncComponent(() => import('../Assets/Carrier/new_vehicle')),
    },
    vehicle_details: {
      path: 'vehicle_details',
      component: asyncComponent(() => import('../Assets/Carrier/VehicleDetails')),
    },
    integrations_provider: {
      path: 'integrations/:provider',
      component: asyncComponent(() => import('../CarrierIntegrations/integrations_page')),
    },
    integrations: {
      path: 'integrations/',
      component: asyncComponent(() => import('../CarrierIntegrations/integrations_page')),
    },
    devices: {
      path: 'devices',
      component: asyncComponent(() => import('../CarrierDevices/devices_page')),
    },
    schedule: {
      path: 'schedule',
      component: asyncComponent(() => import('../Calendar/calendar_page')),
    },
    settings: {
      path: 'settings',
      component: asyncComponent(() => import('../CarrierProfile')),
    },
    rates: {
      path: 'rates',
    component: asyncComponent(() => import('../CarrierRates/rates_page')),
    },
    billing: {
      path: 'billing_profiles',
      component: asyncComponent(() => import('../CarrierBilling/billing_page')),
    },
    payment_setup: {
      path: 'payment_setup',
      component: asyncComponent(() => import('../CarrierBilling/PaymentSetupPage')),
    },
    // home: {
    //   path: '',
    //   component: asyncComponent(() => import('../Widgets/index.js')),
    // },
    // mailbox: {
    //   path: 'mailbox',
    //   component: asyncComponent(() => import('../Mail')),
    // },
    calendar: {
      path: 'calendar',
      component: asyncComponent(() => import('../Calendar/Calendar')),
    },
    single_invoice: {
      path: 'invoice/:invoiceId',
      component: asyncComponent(() => import('../Invoice/singleInvoice')),
    },
    invoices: {
      path: 'invoices',
      component: asyncComponent(() => import('../Invoice')),
    },
    // chat: {
    //   path: 'chat',
    //   component: asyncComponent(() => import('../Chat')),
    // }
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
