import React from 'react';
import { connect } from 'react-redux';
import Loader from '../../components/Loader';
import { fetchExperiment } from '../../state/experiment/actions';

let Experiment = ({ fetch, experiment }) => (
  <div>
    <Loader fetch={fetch}>
      {({ isLoading }) =>
        isLoading ? <div className="loader" /> : <div>Experiment loaded</div>
      }
    </Loader>
  </div>
);
Experiment = connect(
  ({ experiment }) => ({ experiment }),
  (dispatch, ownProps) => ({
    fetch: () => dispatch(fetchExperiment(ownProps.match.params.id))
  })
)(Experiment);

export default Experiment;
