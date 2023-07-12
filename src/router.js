import React, { Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter } from "react-router-redux";
import { connect } from "react-redux";
import {SITE_ROUTES, get_route_path} from 'constants/routes'
import asyncComponent from "helpers/AsyncFunc";
import Loader from "./components/utility/loader";

const WebApp = lazy(() => import("containers/WebApp/App"));
const CarrierApp = lazy(() => import("containers/CarrierApp/App"));
const ShippingApp = lazy(() => import("containers/ShipperApp/App"));
const AdminApp = lazy(() => import("containers/AdminApp/App"));

const PublicRoutes = ({ history, isLoggedIn }) => {
  return (
    <ConnectedRouter history={history}>

      <Suspense fallback={<Loader/>}>
        <Switch>
          <Route
              path={get_route_path("carrier", "app")}
              component={CarrierApp}
          />
          <Route
              path={get_route_path("shipping", "app")}
              component={ShippingApp}
          />
          <Route
              path={get_route_path("admin", "app")}
              component={AdminApp}
          />
          <Route
            exact
            path={SITE_ROUTES["404"]}
            component={asyncComponent(() => import("containers/SitePages/404"))}
          />
          <Route
            exact
            path={SITE_ROUTES["500"]}
            component={asyncComponent(() => import("containers/SitePages/500"))}
          />
          <Route
              exact
              path='/'
              component={WebApp}
          />
          <Route
              path="/:locale_path(en_ca)"
              component={WebApp}
          />
          <Route
              path="/:locale_path(fr_ca)"
              component={WebApp}
          />
        </Switch>
      </Suspense>
    </ConnectedRouter>
  );
};

export default connect(state => ({
  isLoggedIn: state.authUser != null
}))(PublicRoutes);
