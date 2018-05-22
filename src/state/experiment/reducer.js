const initialState = {};

export default function experiments(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case 'LOAD_EXPERIMENT': {
      return data;
    }
    default: {
      return state;
    }
  }
}
