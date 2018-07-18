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
    case 'SEARCH_RESULTS_FETCH': {
      const { searchTerm } = action.data;
      return {
        ...state,
        searchTerm: searchTerm,
        isSearching: true
      };
    }
    case 'SEARCH_RESULTS_FETCH_SUCCESS': {
      const {
        results,
        filters,
        totalResults,
        currentPage,
        appliedFilters
      } = action.data;

      const totalPages = Math.ceil(
        totalResults / state.pagination.resultsPerPage
      );

      return {
        ...state,
        results,
        filters,
        appliedFilters,
        pagination: {
          ...state.pagination,
          totalResults,
          totalPages,
          currentPage
        },
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
      const { appliedFilters: prevFilters } = state;
      const appliedFilterType = new Set();
      if (!prevFilters[filterType]) {
        appliedFilterType.add(filterValue);
      } else {
        for (let filter of prevFilters[filterType]) {
          if (filter !== filterValue) {
            appliedFilterType.add(filter);
          }
        }
        if (prevFilters[filterType].has(filterValue)) {
          appliedFilterType.delete(filterValue);
        } else {
          appliedFilterType.add(filterValue);
        }
      }
      return {
        ...state,
        appliedFilters: {
          ...state.appliedFilters,
          [filterType]: appliedFilterType
        }
      };
    }
    case 'UPDATE_PAGE_SIZE': {
      const resultsPerPage = action.data;
      return {
        ...state,
        pagination: {
          ...state.pagination,
          resultsPerPage
        }
      };
    }
    default:
      return state;
  }
};
