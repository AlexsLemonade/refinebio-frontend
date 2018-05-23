import history from '../../history';
import { getQueryString, asyncFetch } from '../../common/helpers';

export function fetchResults(searchTerm = '', pageNum = 1) {
  return async (dispatch, getState) => {
    dispatch({
      type: 'SEARCH_RESULTS_FETCH',
      data: {
        searchTerm
      }
    });

    const { pagination: { resultsPerPage } } = getState().search;
    const currentPage = parseInt(pageNum, 10);

    try {
      const resultsJSON = await asyncFetch(
        `/search/?search=${searchTerm}&limit=${resultsPerPage}&offset=${(currentPage -
          1) *
          resultsPerPage}`
      );
      const { results, count } = resultsJSON;

      dispatch(fetchResultsSucceeded(results, count, currentPage, searchTerm));
    } catch (error) {
      dispatch(fetchResultsErrored());
    }
  };
}

export function fetchResultsSucceeded(
  results,
  totalResults,
  currentPage,
  searchTerm
) {
  return dispatch => {
    history.push({
      search: getQueryString({ q: searchTerm, p: currentPage })
    });
    dispatch({
      type: 'SEARCH_RESULTS_FETCH_SUCCESS',
      data: {
        results,
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
    const searchTerm = getState().search.searchTerm;
    dispatch(fetchResults(searchTerm));
    dispatch({
      type: 'SEARCH_FILTER_TOGGLE',
      data: {
        filterType,
        filterValue
      }
    });
  };
}

export function getPage(pageNum) {
  return (dispatch, getState) => {
    dispatch({
      type: 'SEARCH_GET_PAGE'
    });
    const { searchTerm } = getState().search;

    history.push({
      search: getQueryString({ q: searchTerm, p: pageNum })
    });

    dispatch(fetchResults(searchTerm, parseInt(pageNum, 10)));
  };
}
