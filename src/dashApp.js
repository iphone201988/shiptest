import React from 'react';
import { Provider } from 'react-redux';
import { store, history } from 'helpers/redux/store';
import PublicRoutes from './router';
import { ThemeProvider } from 'styled-components';
import { ConfigProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import themes from 'settings/themes';
import AppLocale from './languageProvider';
import config, {
  getCurrentLanguage
} from 'containers/LanguageSwitcher/config';
import { themeConfig } from 'settings';
import DashAppHolder from './dashAppStyle';
import Boot from 'helpers/redux/boot';
import packageJson from '../package.json';
import { useClearCache } from "react-clear-cache";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)

global.appVersion = packageJson.version;

const currentAppLocale =
  AppLocale[getCurrentLanguage(config.defaultLanguage || 'english').locale];

const DashApp = () => {

    const { isLatestVersion, emptyCacheStorage } = useClearCache();

    if (!isLatestVersion){
        emptyCacheStorage();
    }

    return (
  <ConfigProvider locale={currentAppLocale.antd}>
    <IntlProvider
      locale={currentAppLocale.locale}
      messages={currentAppLocale.messages}
    >
      <ThemeProvider theme={themes[themeConfig.theme]}>
        <Elements stripe={stripePromise}>
          <DashAppHolder>
            <Provider store={store}>
              <PublicRoutes history={history} />
            </Provider>
          </DashAppHolder>
        </Elements>
      </ThemeProvider>
    </IntlProvider>
  </ConfigProvider>
);
}

Boot()
  .then(() => DashApp())
  .catch(error => console.error(error));

export default DashApp;
export { AppLocale };
