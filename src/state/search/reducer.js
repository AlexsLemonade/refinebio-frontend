const initialState = {
  results: [],
  organisms: [],
  filters: {},
  appliedFilters: {},
  searchTerm: '',
  pagination: {
    totalResults: 0,
    totalPages: 0,
    resultsPerPage: 10,
    currentPage: 1
  },
  isSearching: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SEARCH_RESULTS_FETCH_SUCCESS': {
      const {
        searchTerm,
        results,
        filters,
        totalResults,
        currentPage,
        appliedFilters,
        resultsPerPage,
      } = action.data;

      const totalPages = Math.ceil(
        totalResults / state.pagination.resultsPerPage
      );

      return {
        ...state,
        searchTerm,        
        results,
        filters,
        appliedFilters,        
        pagination: {
          ...state.pagination,
          totalResults,
          totalPages,
          currentPage,
          resultsPerPage,
        },
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
