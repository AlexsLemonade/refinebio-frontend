import { Ajax } from '../common/helpers';
import keyBy from 'lodash/keyBy';

const UPDATE_PLATFORMS = 'refinebio/update-platforms';

const InitialState = false;

export default function platforms(state = InitialState, action) {
  const { type, data } = action;
  if (type === UPDATE_PLATFORMS) {
    return data;
  }
  return state;
}

const updatePlatforms = platforms => ({
  type: UPDATE_PLATFORMS,
  data: platforms
});

export const fetchPlatforms = () => async (dispatch, getState) => {
  const { platforms } = getState();
  if (!!platforms) return;

  dispatch(updatePlatforms(true)); // set to true to avoid further updates
  const fetchedPlatforms = await Ajax.get('/platforms');
  const platformKeyed = keyBy(fetchedPlatforms, x => x.accession_code);
  dispatch(updatePlatforms(platformKeyed));
};
