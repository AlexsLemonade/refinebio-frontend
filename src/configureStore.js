// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './state/rootReducer';
import thunk from 'redux-thunk';
import history from './history';
import { CALL_HISTORY_METHOD } from './state/routerActions';
import { REPORT_ERROR } from './state/reportError';
import throttle from 'lodash/throttle';

declare var Raven: any;

const initialState = loadInitialState();

const errorMiddleware = () => next => action => {
  if (action.type !== REPORT_ERROR) {
    return next(action);
  }

  let error = action.data;

  if (process.env.NODE_ENV === 'development') {
    // log exception in console on development
    console.log(error);
  } else {
    // on Production Report error to Raven https://docs.sentry.io/clients/javascript/#manually-reporting-errors
    Raven.captureException(error);
  }

  return next(action);
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(
    applyMiddleware(thunk, routerMiddleware(history), errorMiddleware)
  )
);

store.subscribe(
  throttle(() => {
    const state = store.getState();
    if (state.download && state.download.dataSetId) {
      localStorage.setItem('dataSetId', state.download.dataSetId);
    } else {
      localStorage.removeItem('dataSetId');
    }
  }, 1000)
);

export default store;

/**
 * This middleware captures CALL_HISTORY_METHOD actions and calls the History Api.
 * The main advantage is that helps avoid calling history inside the action creators.
 *
 * Thanks to https://github.com/reactjs/react-router-redux/blob/master/src/middleware.js
 * Initial idea from https://github.com/reactjs/react-router-redux#what-if-i-want-to-issue-navigation-events-via-redux-actions
 */
function routerMiddleware(history) {
  return () => next => action => {
    if (action.type !== CALL_HISTORY_METHOD) {
      return next(action);
    }

    const {
      payload: { method, args }
    } = action;
    history[method](...args);
  };
}

/**
 * Loads the state from the localStorage, here are the keys that we're interested in persisting.
 * In the future if this gets more complicated, we can consider using https://github.com/rt2zz/redux-persist
 * For now, just loading these keys here and persisting them in `store.subscribe` should be good
 * enough.
 *
 * Inspired from https://egghead.io/lessons/javascript-redux-persisting-the-state-to-the-local-storage
 *
 * In general it might not be a good idea to have the store know about `dataSetId` which is something
 * specific of a reducer. In the future we could add a new reducer with the data that the application needs
 * saved
 */
function loadInitialState() {
  return {
    download: {
      dataSetId: localStorage.getItem('dataSetId')
    }
  };
}
