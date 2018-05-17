const initialState = {};

export default function experiments(state = initialState, action) {
  const { type, data } = action;

  if (type === 'LOAD_EXPERIMENT') {
    return data;
  }

  return state;
}
