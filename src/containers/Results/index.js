import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as resultsActions from '../../state/results/actions';

import Results from './Results';

const mapStateToProps = state => {
  const { results } = state;
  return {
    results
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(resultsActions, dispatch);
};

const ResultsContainer = connect(mapStateToProps, mapDispatchToProps)(Results);

export default ResultsContainer;
