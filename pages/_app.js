import React from 'react';
import { Provider } from 'react-redux';
import classnames from 'classnames';
import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import * as Sentry from '@sentry/browser';
import ReactGA from 'react-ga';
import NProgress from 'nprogress';
import { initializeStore } from '../src/store/store';
import Layout from '../src/components/Layout';
import ErrorBoundary from '../src/components/ErrorBoundary';
import { ThemeProvider } from '../src/common/ThemeContext';

import apiData from '../src/apiData.json';

import './_app.scss';

const isServer = typeof window === 'undefined';
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'; // eslint-disable-line

export default class MyApp extends React.Component {
  constructor(props) {
    super(props);
    this.reduxStore = getOrCreateStore(props.initialReduxState);
  }

  static async getInitialProps(appContext) {
    // Get or Create the store with `undefined` as initialState
    // This allows you to set a custom default initialState
    const reduxStore = getOrCreateStore();

    // Provide the store to getInitialProps of pages
    appContext.ctx.reduxStore = reduxStore;

    // calls page's `getInitialProps` and fills `appProps.pageProps`
    // ref https://nextjs.org/docs/advanced-features/custom-app
    const appProps = await App.getInitialProps(appContext);

    return {
      ...appProps,
      initialReduxState: reduxStore.getState(),
    };
  }

  componentDidMount() {
    if (!isServer) {
      this.initializeScrollRestoration();
      initializeSentry();
      initializeRouterLoading();
      this.initializeGoogleAnalytics();
    }
  }

  initializeScrollRestoration() {
    // thanks to https://github.com/zeit/next.js/issues/3303#issuecomment-536166016
    window.history.scrollRestoration = 'auto';
    const cachedScrollPositions = [];
    let shouldScrollRestore;

    Router.events.on('routeChangeStart', () => {
      cachedScrollPositions.push([window.scrollX, window.scrollY]);
    });

    Router.events.on('routeChangeComplete', () => {
      if (shouldScrollRestore) {
        const { x, y } = shouldScrollRestore;
        window.scrollTo(x, y);
        shouldScrollRestore = null;
      }
      window.history.scrollRestoration = 'auto';
    });

    Router.beforePopState(() => {
      if (cachedScrollPositions.length > 0) {
        const [x, y] = cachedScrollPositions.pop();
        shouldScrollRestore = { x, y };
      }
      window.history.scrollRestoration = 'manual';
      return true;
    });
  }

  initializeGoogleAnalytics() {
    if (process.env.NODE_ENV !== 'production') return;

    ReactGA.initialize('UA-6025776-8');
    registerPageView(window.location);
    Router.events.on('routeChangeComplete', () => {
      registerPageView(window.location);
    });
  }

  render() {
    const { Component, pageProps } = this.props;

    // In order to render `App` individually in the tests, Provider needs to wrap it's contents.
    return (
      <AppWrap>
        <Head>
          <title>refine.bio</title>
          <meta
            name="description"
            content="Browse decades of harmonized childhood cancer data and discover how this multi-species repository accelerates the search for cures."
          />
        </Head>

        <Provider store={this.reduxStore}>
          <ThemeProvider>
            <Layout>
              <ErrorBoundary>
                <Component {...pageProps} />
              </ErrorBoundary>
            </Layout>
          </ThemeProvider>
        </Provider>
      </AppWrap>
    );
  }
}

function AppWrap({ children }) {
  const [ios, setIos] = React.useState(false);
  React.useEffect(() => {
    setIos(isIos());
  }, []);
  return <div className={classnames('app-wrap', { ios })}>{children}</div>;
}

function getOrCreateStore(initialState) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return initializeStore(initialState);
  }

  // Create store if unavailable on the client and set it on the window object
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = initializeStore(initialState);
  }
  return window[__NEXT_REDUX_STORE__];
}

function initializeSentry() {
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
}

function initializeRouterLoading() {
  // use loading indicator when navigating between pages
  // https://github.com/zeit/next.js/issues/2985#issuecomment-335020393
  Router.events.on('routeChangeStart', () => NProgress.start());
  Router.events.on('routeChangeError', () => NProgress.done());
  Router.events.on('routeChangeComplete', () => NProgress.done());
}

function isIos() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function registerPageView(location) {
  const url = location.pathname + location.search;
  ReactGA.set({ page: url });
  ReactGA.pageview(url);
}
