import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import smoothscroll from 'smoothscroll-polyfill';
import App from './pages/App';
import 'delayed-scroll-restoration-polyfill';
import apiData from './apiData.json';
import * as Sentry from '@sentry/browser';

// kick off the polyfill!
smoothscroll.polyfill();

function initApp() {
  // remove general meta description from header
  document.querySelector('meta[name="description"]').remove();

  ReactDOM.render(<App />, document.getElementById('root'));
}

// initialize sentry on production
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://eca1cd24f75a4565afdca8af72700bf2@sentry.io/1223688',
    // add release info https://docs.sentry.io/workflow/releases/?platform=browsernpm#configure-sdk
    release: apiData.version
      ? `refinebio-frontend@${apiData.version.substr(1)}`
      : null,
    environment:
      window.location.host === 'www.refine.bio'
        ? 'production'
        : window.location.host === 'staging.refine.bio'
        ? 'staging'
        : 'dev',
  });
}

initApp();
