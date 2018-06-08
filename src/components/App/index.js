import React from 'react';
import './App.scss';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../../history';

import Main from '../../containers/Main';
import Results from '../../containers/Results';
import Experiment from '../../containers/Experiment';
import Dashboard from '../../containers/Dashboard';
import Downloads from '../../containers/Downloads';
import ViewDownload from '../../containers/Downloads/ViewDownload';
import Layout from '../Layout';
import DataSet from '../../containers/DataSet';
import NoMatch from '../../containers/NoMatch';

/**
 * The 404 route was giving conflicts when used inside App, that's it's extracted into
 * this helper component.
 */
const AppContent = () => (
  <div className="layout__content">
    <Switch>
      <Route path="/results" component={Results} />
      <Route path="/experiments/:id" component={Experiment} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/download/:id" component={ViewDownload} />
      <Route path="/download" component={Downloads} />
      <Route path="/dataset/:id" component={DataSet} />

      {/* Custom route to be able to redirect to the 404 page */}
      <Route path="/not-found" component={NoMatch} />
      <Route path="*" component={NoMatch} />
    </Switch>
  </div>
);

const App = () => {
  return (
    <Router history={history}>
      <Layout>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/" component={AppContent} />
        </Switch>
      </Layout>
    </Router>
  );
};

export default App;
