import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './configureStore';
import './index.scss';
import App from './components/App';

import registerServiceWorker from './registerServiceWorker';

declare var Raven: any;

function initApp() {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
  registerServiceWorker();
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
