import ReactGA from 'react-ga';
import { Ajax } from '../common/helpers';

const LOAD_TOKEN = 'LOAD_TOKEN';
const CLEAR_TOKEN = 'CLEAR_TOKEN';

const initialState = null;

const tokenEvent = event => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.event({
      category: 'Token',
      ...event,
    });
  }
};

export default function token(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case LOAD_TOKEN:
      return data;
    case CLEAR_TOKEN:
      return null;
    default:
      return state;
  }
}

export const clearToken = () => ({
  type: CLEAR_TOKEN,
});

export const loadToken = data => ({
  type: LOAD_TOKEN,
  data,
});

export const createToken = () => async dispatch => {
  const { id: tokenId } = await Ajax.post('/v1/token/');
  await Ajax.put(`/v1/token/${tokenId}/`, { is_activated: true });
  dispatch(loadToken(tokenId));
  tokenEvent({ action: 'Create API Token', label: tokenId });
  return tokenId;
};
