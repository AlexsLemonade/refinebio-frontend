export function fetchResults(searchTerm) {
  return async dispatch => {
    dispatch({
      type: 'SEARCH_FETCH'
    });

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
    type: 'SEARCH_FETCH_SUCCESS',
    data: {
      results
    }
  };
}

export function fetchResultsErrored(results) {
  return {
    type: 'SEARCH_FETCH_ERROR',
    data: {
      results
    }
  };
}
