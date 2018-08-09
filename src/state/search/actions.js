import { push } from '../routerActions';
import { getQueryString, Ajax } from '../../common/helpers';

export function fetchResults(searchTerm = '', pageNum = 1, filters) {
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

    let filtersObj = filters;
    let filtersToApply = Object.keys(appliedFilters).length
      ? appliedFilters
      : {};

    if (!filters) {
      filtersObj = Object.keys(appliedFilters).reduce((result, filterType) => {
        const filtersArr = Array.from(appliedFilters[filterType]);
        if (filtersArr.length) result[filterType] = filtersArr;
        return result;
      }, {});
    }

    try {
      const resultsJSON = await Ajax.get('/search/', {
        search: searchTerm,
        limit: resultsPerPage,
        offset: (currentPage - 1) * resultsPerPage,
        ...filtersObj
      });
      const { results, count, filters } = resultsJSON;

      dispatch(
        fetchResultsSucceeded(
          results,
          filters,
          count,
          currentPage,
          searchTerm,
          filtersObj,
          filtersToApply
        )
      );
    } catch (error) {
      console.log(error);
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
  filtersObj,
  appliedFilters
) {
  return dispatch => {
    const queryObj = {};

    if (searchTerm) {
      queryObj.q = searchTerm;
    }

    if (currentPage > 1) {
      queryObj.p = currentPage;
    }

    dispatch({
      type: 'SEARCH_RESULTS_FETCH_SUCCESS',
      data: {
        results: !!searchTerm ? results : [],
        filters,
        totalResults,
        currentPage,
        appliedFilters
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
      const results = await Ajax.get(`/organisms/`);

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
  return async (dispatch, getState) => {
    dispatch({
      type: 'SEARCH_GET_PAGE'
    });
    const { searchTerm } = getState().search;

    await dispatch(fetchResults(searchTerm, parseInt(pageNum, 10)));
  };
}

export const updateResultsPerPage = resultsPerPage => async (
  dispatch,
  getState
) => {
  dispatch({
    type: 'UPDATE_PAGE_SIZE',
    data: resultsPerPage
  });
  const { searchTerm } = getState().search;

  await dispatch(fetchResults(searchTerm));
};
