import React from 'react';
import { connect } from 'react-redux';

import Results from './Results';

const mapStateToProps = state => {
  const { aReducer } = state;
  return {
    aReducer
  };
};

const ResultsContainer = connect(mapStateToProps)(Results);

export default ResultsContainer;
