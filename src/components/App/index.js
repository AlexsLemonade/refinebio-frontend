import React from 'react';
import styles from './App.module.scss';
import Header from '../Header';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../../history';

import Search from '../../containers/Search';
import Results from '../../containers/Results';
import Experiment from '../../containers/Experiment';

const App = () => {
  return (
    <div className={styles.App}>
      <Router history={history}>
        <div>
          <Header />
          <Switch>
            <Route exact path="/" component={Search} />
            <Route path="/results" component={Results} />
            <Route path="/experiment" component={Experiment} />
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default App;
