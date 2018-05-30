const initialState = {};

export default function(state = initialState, action) {
  const { type, data } = action;

  switch (type) {
    case 'LOAD_DATASET': {
      return data;
    }
    case 'UPDATE_DATASET': {
      return {
        ...state,
        ...data
      };
    }
    default:
      return state;
  }
}
