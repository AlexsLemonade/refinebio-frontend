import { Ajax } from '../common/helpers';

const LOAD_TOKEN = 'LOAD_TOKEN';
const CLEAR_TOKEN = 'CLEAR_TOKEN';

const initialState = null;

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
  type: CLEAR_TOKEN
});

export const loadToken = token => ({
  type: LOAD_TOKEN,
  data: token
});

export const createToken = () => async dispatch => {
  const token = await Ajax.get('/token/');
  await Ajax.post(`/token/`, { id: token.id, is_activated: true });
  dispatch(loadToken(token.id));
  return token.id;
};
