import React from 'react';
import { connect } from 'react-redux';

const Experiment = () => {
  return <div>Experiment bar</div>;
};

const mapStateToProps = state => {
  const { aReducer } = state;
  return {
    aReducer
  };
};

const ExperimentContainer = connect(mapStateToProps)(Experiment);

export default ExperimentContainer;
