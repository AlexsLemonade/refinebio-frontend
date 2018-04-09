import React from 'react';
import { connect } from 'react-redux';

const Results = () => {
  return <div>Results bar</div>;
};

const mapStateToProps = state => {
  const { aReducer } = state;
  return {
    aReducer
  };
};

const ResultsContainer = connect(mapStateToProps)(Results);

export default ResultsContainer;
