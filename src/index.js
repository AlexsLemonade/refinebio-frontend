import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './components/App';

import { unregister } from './registerServiceWorker';

import smoothscroll from 'smoothscroll-polyfill';

// kick off the polyfill!
smoothscroll.polyfill();

declare var Raven: any;

function initApp() {
  // remove general meta description from header
  document.querySelector('meta[name="description"]').remove();

  ReactDOM.render(<App />, document.getElementById('root'));

  // Disable service worker https://github.com/facebook/create-react-app/issues/2715#issuecomment-313171863
  // By default apps created with `create-react-app` (before v2.0.0) were offline first.
  // This means that after the first visit, a cached version of the app is always served first
  // In our case we want the latest version to always be served, and we don't need the app
  // to work offline.
  // More details at https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app
  unregister();
}

if (process.env.NODE_ENV === 'development') {
  initApp();
} else {
  // on Production Setup Raven to report all errors there
  Raven.config(
    'https://eca1cd24f75a4565afdca8af72700bf2@sentry.io/1223688'
  ).install();
  // app initialization code wrapped into Raven.context
  // ref: https://docs.sentry.io/clients/javascript/#configuring-the-client
  Raven.context(initApp);
}
