import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './pages/App';
import smoothscroll from 'smoothscroll-polyfill';
import 'delayed-scroll-restoration-polyfill';

// kick off the polyfill!
smoothscroll.polyfill();

declare var Raven: any;

function initApp() {
  // remove general meta description from header
  document.querySelector('meta[name="description"]').remove();

  ReactDOM.render(<App />, document.getElementById('root'));
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
