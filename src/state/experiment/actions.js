const loadExperiment = data => ({
  type: 'LOAD_EXPERIMENT',
  data
});

export const fetchExperiment = id => async dispatch => {
  let data = await (await fetch(`/experiments/${id}.json`)).json();
  dispatch(loadExperiment(data));
};
