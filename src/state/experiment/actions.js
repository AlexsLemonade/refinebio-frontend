import { Ajax } from '../../common/helpers';
import reportError from '../reportError';

const loadExperiment = data => ({
  type: 'LOAD_EXPERIMENT',
  data
});

export const fetchExperiment = id => async dispatch => {
  try {
    const data = await Ajax.get(`/experiments/${id}/`);
    dispatch(loadExperiment(data));
  } catch (e) {
    return dispatch(reportError(e));
    // TODO: check if this was a 404 error, and redirect to the 404 page
  }
};
