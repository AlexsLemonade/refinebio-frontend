import { Ajax } from '../../common/helpers';
import { push } from '../../state/routerActions';

const loadExperiment = data => ({
  type: 'LOAD_EXPERIMENT',
  data
});

export const fetchExperiment = id => async dispatch => {
  try {
    const data = await Ajax.get(`/experiments/${id}/`);
    dispatch(loadExperiment(data));
  } catch (e) {
    dispatch(push('/no-match'));
  }
};
