import { asyncFetch } from '../../common/helpers';

const loadExperiment = data => ({
  type: 'LOAD_EXPERIMENT',
  data
});

export const fetchExperiment = id => async dispatch => {
  const data = await asyncFetch(`/experiments/${id}/`);
  dispatch(loadExperiment(data));
};
