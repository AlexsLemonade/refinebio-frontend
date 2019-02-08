import React from 'react';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import classnames from 'classnames';
import { Router, Route, Switch } from 'react-router-dom';

import history from '../history';
import store from '../store/store';
import Layout from '../components/Layout';
import ErrorBoundary from '../components/ErrorBoundary';

import Main from './Main';
import Search from './Search';
import Experiment from './Experiment';
import Dashboard from './Dashboard';
import ExecutiveDashboard from './Dashboard/ExecutiveDashboard';
import Downloads from './Downloads';
import DataSet from './Downloads/DataSet';
import NoMatch from './NoMatch';
import Privacy from './Privacy';
import Terms from './Terms';
import License from './License';
import About from './About';

import './App.scss';

/**
 * The 404 route was giving conflicts when used inside App, that's it's extracted into
 * this helper component.
 */
const AppContent = () => (
  <div className="layout__content">
    <Switch>
      <Route path="/search" component={Search} />
      <Route path="/experiments/:id" component={Experiment} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/executive-dashboard" component={ExecutiveDashboard} />
      <Route path="/download" component={Downloads} />
      <Route path="/dataset/:id" component={DataSet} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/license" component={License} />

      {/* Custom route to be able to redirect to the 404 page */}
      <Route path="/not-found" component={NoMatch} />
      <Route path="*" component={NoMatch} />
    </Switch>
  </div>
);

const App = () => {
  // In order to render `App` individually in the tests, Provider needs to wrap it's contents.
  return (
    <div className={classnames('app-wrap', { ios: isIos() })}>
      <Helmet>
        <title>refine.bio</title>
        <meta
          name="description"
          content="Browse decades of harmonized childhood cancer data and discover how this multi-species repository accelerates the search for cures."
        />
      </Helmet>

      <Provider store={store}>
        <Router history={history}>
          <Layout>
            <ErrorBoundary>
              <Switch>
                <Route exact path="/" component={Main} />
                <Route exact path="/about" component={About} />

                <Route
                  exact
                  path="/docs"
                  component={() => (
                    <ExternalRedirect to="http://docs.refine.bio/" />
                  )}
                />

                <Route path="/" component={AppContent} />
              </Switch>
            </ErrorBoundary>
          </Layout>
        </Router>
      </Provider>
    </div>
  );
};

export default App;

function isIos() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

/**
 * Redirecting to an external link is hard with React-Router
 *
 * Thanks to https://stackoverflow.com/a/42988282/763705
 */
class ExternalRedirect extends React.Component {
  componentDidMount() {
    window.location = this.props.to;
  }

  render() {
    return <section>Redirecting...</section>;
  }
}
