import { push } from '../routerActions';
import { getQueryString, Ajax } from '../../common/helpers';
import reportError from '../reportError';

// 
export const navigateToResults = ({query, page, size, filters}) =>{
  const urlParams = {
    q: query, 
    p: page > 1 ? page : undefined, 
    size: size !== 10 ? size : undefined, 
    ...filters
  };

  return push({
    search: `${getQueryString(urlParams)}`
  });
}

export function fetchResults({query, page = 1, size=10, filters}) {
  return async (dispatch, getState) => {
    try {
      const { results, count: totalResults, filters: filterData } = await Ajax.get('/search/', {
        search: query,
        limit: size,
        offset: (page - 1) * size,
        ...filters
      });

      dispatch({
        type: 'SEARCH_RESULTS_FETCH_SUCCESS',
        data: {
          searchTerm: query,
          results: !!query ? results : [],
          filters: filterData,
          totalResults,

          // these could be removed
          resultsPerPage: size,
          currentPage: page,
          appliedFilters: filters
        }
      });
    } catch (error) {
      dispatch(reportError(error));
    }
  };
}

export function fetchOrganisms(searchTerm) {
  return async dispatch => {
    try {
      const organisms = await Ajax.get(`/organisms/`);
      return organisms;
    } catch (error) {
      dispatch(reportError(error));
    }
  };
}

export const triggerSearch = (searchTerm) => (dispatch, getState) => {
  const {pagination: {resultsPerPage}} = getState().search;
  // when a new search is performed, remove the filters, and go back to the first page
  dispatch(navigateToResults({query: searchTerm, page: 1, filters: {}, size: resultsPerPage}));
}

export function toggledFilter(filterType, filterValue) {
  return (dispatch, getState) => {
    const {searchTerm, appliedFilters, pagination: {resultsPerPage}} = getState().search;
    const newFilters = toggleFilterHelper(appliedFilters, filterType, filterValue);
    // reset to the first page when a filter is applied
    dispatch(navigateToResults({query: searchTerm, page: 1, filters: newFilters, size: resultsPerPage}));
  };
}

export function updatePage(page) {
  return async (dispatch, getState) => {
    const {searchTerm, appliedFilters, pagination: {resultsPerPage}} = getState().search;
    dispatch(navigateToResults({query: searchTerm, page, filters: appliedFilters, size: resultsPerPage}));
  };
}

export const updateResultsPerPage = resultsPerPage => async (dispatch, getState) => {
  const {searchTerm, appliedFilters, pagination: {currentPage}} = getState().search;
  dispatch(navigateToResults({query: searchTerm, page: currentPage, filters: appliedFilters, size: resultsPerPage}));
};






/**
 * Takes an array with specifications of active filters and toggles one of the filters.
 * @param {any} filters Filters object, where the keys are the name of the filter
 *                      And the values are the active filters.
 * @param {string} type name of the filter to be toggled
 * @param {string} value value of the filter
 */
export function toggleFilterHelper(filters, type, value) {
  const prevFilterValue = filters[type];

  // modify the filter's object value
  let appliedFilterType;
  if (!prevFilterValue) {
    // if it doesn't exist, create the add the filter
    appliedFilterType = [value];
  } else if (prevFilterValue.includes(value)) {
    // if the filter is active, remove it from the list
    appliedFilterType = prevFilterValue.filter(x => x !== value);
  } else {
    // otherwise just add it
    appliedFilterType = [...prevFilterValue, value];
  }

  return {
    ...filters,
    [type]: appliedFilterType,
  };
}



