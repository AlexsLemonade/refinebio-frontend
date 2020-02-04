import React from 'react';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import classnames from 'classnames';

import store from '../store/store';
import Layout from '../components/Layout';
import ErrorBoundary from '../components/ErrorBoundary';
import { ThemeProvider } from '../common/ThemeContext';

import './_app.scss';

const App = ({ Component, pageProps }) => {
  const [ios, setIos] = React.useState(false);
  React.useEffect(() => {
    setIos(isIos());
  }, []);
  // In order to render `App` individually in the tests, Provider needs to wrap it's contents.
  return (
    <div className={classnames('app-wrap', { ios })}>
      <Helmet>
        <title>refine.bio</title>
        <meta
          name="description"
          content="Browse decades of harmonized childhood cancer data and discover how this multi-species repository accelerates the search for cures."
        />
      </Helmet>

      <Provider store={store}>
        <ThemeProvider>
          <Layout>
            <ErrorBoundary>
              <Component {...pageProps} />
            </ErrorBoundary>
          </Layout>
        </ThemeProvider>
      </Provider>
    </div>
  );
};

export default App;

function isIos() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}
