export function fetchResults(searchTerm, currentPage = 1) {
  return async (dispatch, getState) => {
    dispatch({
      type: 'SEARCH_RESULTS_FETCH',
      data: {
        searchTerm
      }
    });

    const { filters, pagination: { resultsPerPage } } = getState().search;

    let filterArray = [];

    try {
      const resultsJSON = await (await fetch(
        `/search/?search=${searchTerm}&limit=${resultsPerPage}&offset=${(currentPage -
          1) *
          resultsPerPage}`
      )).json();
      const { results, next, previous, count } = resultsJSON;

      dispatch(
        fetchResultsSucceeded(results, next, previous, count, currentPage)
      );
    } catch (error) {
      dispatch(fetchResultsErrored());
    }
  };
}

export function fetchResultsSucceeded(
  results,
  nextUrl,
  previousUrl,
  totalResults,
  currentPage
) {
  return {
    type: 'SEARCH_RESULTS_FETCH_SUCCESS',
    data: {
      results,
      nextUrl,
      previousUrl,
      totalResults,
      currentPage
    }
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
      const results = await (await fetch(`/organisms/`)).json();

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

    dispatch(fetchResults(searchTerm, parseInt(pageNum, 10)));
  };
}
