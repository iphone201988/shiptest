import { combineReducers } from 'redux'
import { firebaseReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore'
import Auth from './auth/reducer';
import App from './app/reducer';
import Calendar from './calendar/reducer';
import Box from './box/reducer';
import Contacts from './contacts/reducer';

import Chat from './chat/reducers';
import DynamicChartComponent from './dynamicEchart/reducer';

import ThemeSwitcher from './themeSwitcher/reducer';
import Invoices from './invoice/reducer';
import LanguageSwitcher from './languageSwitcher/reducer';

import FirebaseAuth from './firebase_auth/reducer'
import CompanyReducers from "./company/reducers/currentCompany"
import CompanyUserReducer from "./current_user/reducer"
import QuoteRequestOffersReducers from './QuoteRequestOffers/reducer'
import QuoteRequestsReducers from "./shipments/reducers/quote_requests";
import QuoteOffersReducers from "./shipments/reducers/quote_offers";
import CompanyLocationsReducers from "./company_location/reducers/company_locations"
import AssetReducers from "./assets/reducers/assets"
import CarrierUserReducers from "./users/reducers/carrier_users"
import DevicesReducers from "./devices/reducers/active_devices"
import BillingProfilesReduces from "./billing_profiles/reducers/billing_profiles"

export const initialState = {}

const FB = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  company: CompanyReducers,
  companyUser: CompanyUserReducer,
  QuoteRequestOffers: QuoteRequestOffersReducers,
  QuoteRequests: QuoteRequestsReducers,
  QuoteOffers: QuoteOffersReducers,
  CompanyLocations: CompanyLocationsReducers,
  assets: AssetReducers,
  billingProfiles: BillingProfilesReduces,
  carrierUsers: CarrierUserReducers,
  devices: DevicesReducers,
})

export default {
  FB,
  Auth,
  FirebaseAuth,
  App,
  ThemeSwitcher,
  LanguageSwitcher,
  Calendar,
  Box,
  Contacts,
  Chat,
  DynamicChartComponent,
  Invoices,
};

