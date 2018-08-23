const initialState = {
  searchTerm: '',
  results: [],
  filters: {},
  appliedFilters: {},
  pagination: {
    totalResults: 0,
    totalPages: 0,
    resultsPerPage: 10,
    currentPage: 1
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SEARCH_RESULTS_FETCH': {
      const {
        searchTerm,
        results,
        filters,
        totalResults,
        currentPage,
        appliedFilters,
        resultsPerPage
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
          resultsPerPage
        }
      };
    }
    default:
      return state;
  }
};
