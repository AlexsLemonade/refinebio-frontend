import React from 'react';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import classnames from 'classnames';
import App from 'next/app';

import { initializeStore } from '../store/store';
import Layout from '../components/Layout';
import ErrorBoundary from '../components/ErrorBoundary';
import { ThemeProvider } from '../common/ThemeContext';

import './_app.scss';

const isServer = typeof window === 'undefined';
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

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

  render() {
    const { Component, pageProps } = this.props;
    const ios = false;

    // In order to render `App` individually in the tests, Provider needs to wrap it's contents.
    return (
      <AppWrap>
        <Helmet>
          <title>refine.bio</title>
          <meta
            name="description"
            content="Browse decades of harmonized childhood cancer data and discover how this multi-species repository accelerates the search for cures."
          />
        </Helmet>

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

function isIos() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}
