import React from 'react';
import ReactDOM from 'react-dom';
import DashApp from './dashApp';
import registerServiceWorker from './registerServiceWorker';
import 'antd/dist/antd.css';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)

ReactDOM.render(
  <Elements stripe={stripePromise}>
    <DashApp />
  </Elements>
  , document.getElementById('root'));

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./dashApp.js', () => {
    const NextApp = require('./dashApp').default;
    ReactDOM.render(
        <NextApp />       ,
      document.getElementById('root'));
  });
}
registerServiceWorker();
