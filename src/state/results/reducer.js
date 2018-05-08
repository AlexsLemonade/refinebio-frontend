const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case 'RESULTS_FETCH_SUCCESS': {
      const { results } = action.data;
      return [...state, ...results];
    }
    default:
      return state;
  }
};
