const initialState = {
  searchTerm: '',
  results: [],
  filters: null,
  filterOrder: [],
  appliedFilters: {},
  pagination: {
    totalResults: 0,
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
        filterOrder, // array with the name of the applied filters
        resultsPerPage,
        ordering
      } = action.data;

      return {
        ...state,
        searchTerm,
        results,
        filters,
        appliedFilters,
        filterOrder,
        ordering,
        pagination: {
          ...state.pagination,
          totalResults,
          currentPage,
          resultsPerPage
        }
      };
    }
    default:
      return state;
  }
};

/**
 * Returns the parameters from the url, that are saved in the state
 * @param {*} param0 redux state
 */
export const getUrlParams = ({ search }) => ({
  query: search.searchTerm,
  page: search.pagination.currentPage,
  size: search.pagination.resultsPerPage,
  filters: search.appliedFilters,
  filterOrder: search.filterOrder,
  ordering: search.ordering
});
