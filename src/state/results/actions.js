export function fetchResults(searchTerm) {
  console.log('SEARCHING FOR THIS: ', searchTerm);
  return async dispatch => {
    dispatch({
      type: 'RESULTS_FETCHED',
      data: results
    });
    const results = (await (await fetch(
      '/search/?search=array_express'
    )).json()).results;

    dispatch(fetchResultsSucceeded(results));
  };
}

export function fetchResultsSucceeded(results) {
  return {
    type: 'RESULTS_FETCH_SUCCESS',
    data: {
      results
    }
  };
}
