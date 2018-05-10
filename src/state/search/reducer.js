const initialState = {
  results: [],
  organisms: [],
  filters: {},
  isSearching: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SEARCH_RESULTS_FETCH': {
      const { searchTerm } = action.data;
      return {
        ...state,
        searchTerm: searchTerm,
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
    case 'SEARCH_FILTER_TOGGLE': {
      const { filterType, filterValue } = action.data;
      return {
        ...state,
        filters: {
          ...state.filters,
          [filterType]: state.filters[filterType]
            ? state.filters[filterType].add(filterValue)
            : new Set([filterValue])
        }
      };
    }
    default:
      return state;
  }
};
