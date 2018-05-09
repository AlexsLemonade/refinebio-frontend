const initialState = {
  results: [],
  organisms: [],
  isSearching: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SEARCH_RESULTS_FETCH': {
      return {
        ...state,
        isSearching: true
      };
    }
    case 'SEARCH_RESULTS_FETCH_SUCCESS': {
      const { results } = action.data;
      return {
        ...state,
        results,
        isSearching: false
      };
    }
    case 'SEARCH_RESULTS_FETCH_ERROR': {
      return {
        ...state,
        isSearching: false
      };
    }
    case 'SEARCH_ORGANISMS_FETCH_SUCCESS': {
      const { organisms } = action.data;
      return {
        ...state,
        organisms
      };
    }
    default:
      return state;
  }
};
