import { push } from '../routerActions';
import { getQueryString, asyncFetch } from '../../common/helpers';

export function fetchResults(searchTerm = '', pageNum = 1) {
  return async (dispatch, getState) => {
    dispatch({
      type: 'SEARCH_RESULTS_FETCH',
      data: {
        searchTerm
      }
    });

    const {
      pagination: { resultsPerPage },
      appliedFilters
    } = getState().search;
    const currentPage = parseInt(pageNum, 10);

    /**
     * Convert to an object without Sets for use with getQueryString
     */
    const filters = Object.keys(appliedFilters).reduce((result, filterType) => {
      const filtersArr = Array.from(appliedFilters[filterType]);
      if (filtersArr.length) result[filterType] = filtersArr;
      return result;
    }, {});

    const filterString = getQueryString(filters);

    try {
      const resultsJSON = await asyncFetch(
        `/search/?search=${searchTerm}&limit=${resultsPerPage}&offset=${(currentPage -
          1) *
          resultsPerPage}${filterString.length ? `&${filterString}` : ''}`
      );
      const { results, count, filters } = resultsJSON;

      dispatch(
        fetchResultsSucceeded(
          results,
          filters,
          count,
          currentPage,
          searchTerm,
          filterString
        )
      );
    } catch (error) {
      dispatch(fetchResultsErrored());
    }
  };
}

export function fetchResultsSucceeded(
  results,
  filters,
  totalResults,
  currentPage,
  searchTerm,
  filterString
) {
  return dispatch => {
    const queryObj = searchTerm
      ? {
          q: searchTerm,
          p: currentPage
        }
      : {
          p: currentPage
        };

    dispatch(
      push({
        search: `${getQueryString(queryObj)}${
          filterString.length ? `&${filterString}` : ''
        }`
      })
    );
    dispatch({
      type: 'SEARCH_RESULTS_FETCH_SUCCESS',
      data: {
        results,
        filters,
        totalResults,
        currentPage
      }
    });
  };
}

export function fetchResultsErrored() {
  return {
    type: 'SEARCH_RESULTS_FETCH_ERROR'
  };
}

export function fetchOrganisms(searchTerm) {
  return async dispatch => {
    dispatch({
      type: 'SEARCH_ORGANISMS_FETCH'
    });

    try {
      const results = await asyncFetch(`/organisms/`);

      dispatch(fetchOrganismsSucceeded(results));
    } catch (error) {}
  };
}

export function fetchOrganismsSucceeded(organisms) {
  return {
    type: 'SEARCH_ORGANISMS_FETCH_SUCCESS',
    data: {
      organisms
    }
  };
}

export function fetchOrganismsErrored() {
  return {
    type: 'SEARCH_ORGANISMS_FETCH_ERROR'
  };
}

export function toggledFilter(filterType, filterValue) {
  return (dispatch, getState) => {
    dispatch({
      type: 'SEARCH_FILTER_TOGGLE',
      data: {
        filterType,
        filterValue
      }
    });
    const searchTerm = getState().search.searchTerm;
    dispatch(fetchResults(searchTerm));
  };
}

export function getPage(pageNum) {
  return (dispatch, getState) => {
    dispatch({
      type: 'SEARCH_GET_PAGE'
    });
    const { searchTerm } = getState().search;

    dispatch(fetchResults(searchTerm, parseInt(pageNum, 10)));
  };
}
