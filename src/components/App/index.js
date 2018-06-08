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

const App = () => {
  return (
    <Router history={history}>
      <Layout>
        <Switch>
          <Route exact path="/" component={Main} />
          <div className="layout__content">
            <Route path="/results" component={Results} />
            <Route path="/experiments/:id" component={Experiment} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/download/:id" component={ViewDownload} />
            <Route path="/download" component={Downloads} />
            <Route path="/dataset/:id" component={DataSet} />
            {/* Custom route to be able to redirect to the 404 page */}
            <Route path="/not-found" component={NoMatch} />
            <Route component={NoMatch} />
          </div>
        </Switch>
      </Layout>
    </Router>
  );
};

export default App;
