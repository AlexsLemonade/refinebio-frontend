import { Ajax } from '../../common/helpers';

const loadExperiment = data => ({
  type: 'LOAD_EXPERIMENT',
  data
});

export const fetchExperiment = id => async dispatch => {
  const data = await Ajax.get(`/experiments/${id}/`);
  dispatch(loadExperiment(data));
};
