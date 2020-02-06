import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import 'delayed-scroll-restoration-polyfill';
// import smoothscroll from 'smoothscroll-polyfill';
import apiData from './apiData.json';

// kick off the polyfill!
// smoothscroll.polyfill();

function initApp() {
  // ReactDOM.render(<App />, document.getElementById('root'));
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
