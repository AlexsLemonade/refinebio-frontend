const initialState = {
  results: [],
  isSearching: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SEARCH_FETCH': {
      return {
        ...state,
        isSearching: true
      };
    }
    case 'SEARCH_FETCH_SUCCESS': {
      const { results } = action.data;
      return {
        ...state,
        results,
        isSearching: false
      };
    }
    case 'SEARCH_FETCH_ERROR': {
      return {
        ...state,
        isSearching: false
      };
    }
    default:
      return state;
  }
};
