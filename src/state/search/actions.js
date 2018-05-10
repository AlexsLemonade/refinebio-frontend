export function fetchResults(searchTerm, filters) {
  return async (dispatch, getState) => {
    dispatch({
      type: 'SEARCH_RESULTS_FETCH',
      data: {
        searchTerm
      }
    });

    const { filters } = getState().search;

    let filterArray = [];
    try {
      const results = (await (await fetch(
        `/search/?search=${searchTerm}`
      )).json()).results;

      dispatch(fetchResultsSucceeded(results));
    } catch (error) {}
  };
}

export function fetchResultsSucceeded(results) {
  return {
    type: 'SEARCH_RESULTS_FETCH_SUCCESS',
    data: {
      results
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
