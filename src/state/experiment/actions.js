import { Ajax } from '../../common/helpers';
import reportError from '../reportError';
import { replace } from '../../state/routerActions';

const loadExperiment = data => ({
  type: 'LOAD_EXPERIMENT',
  data
});

export const fetchExperiment = id => async dispatch => {
  try {
    const data = await Ajax.get(`/experiments/${id}/`);
    dispatch(loadExperiment(data));
  } catch (e) {
    dispatch(replace('/no-match'));
    return dispatch(reportError(e));
  }
};
