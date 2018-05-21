const initialState = {
  dataSetId: null,
  dataSet: {},
  isLoading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'DOWNLOAD_DATASET_FETCH': {
      const { dataSetId } = action.data;
      return {
        ...state,
        dataSetId
      };
    }
    case 'DOWNLOAD_EXPERIMENT_ADDED': {
      const { dataSetId } = action.data;
      return {
        ...state,
        dataSetId
      };
    }
    case 'DOWNLOAD_FETCH_DATA': {
      return {
        ...state,
        isLoading: true
      };
    }
    case 'DOWNLOAD_FETCH_DATA_SUCCESS': {
      const { dataSet } = action.data;
      return {
        ...state,
        dataSet,
        isLoading: false
      };
    }
    default:
      return state;
  }
};

export function groupSamplesBySpecies(state) {
  const { dataSet = {} } = state.download;

  return Object.keys(dataSet).reduce((species, id) => {
    const experiment = dataSet[id];
    if (!experiment.samples) return species;
    experiment.samples.forEach(sample => {
      const { organism: { name: organismName } } = sample;
      species[organismName] = species[organismName] || [];
      species[organismName].push(sample);
    });
    return species;
  }, {});
}
