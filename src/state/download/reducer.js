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
        dataSetId,
        isLoading: true
      };
    }
    case 'DOWNLOAD_DATASET_FETCH_SUCCESS': {
      const { dataSet } = action.data;
      return {
        ...state,
        dataSet,
        isLoading: false
      };
    }
    case 'DOWNLOAD_ADD_EXPERIMENT': {
      const { dataSetId, dataSet } = action.data;
      return {
        ...state,
        dataSetId,
        dataSet
      };
    }
    case 'DOWNLOAD_REMOVE_EXPERIMENT_SUCCESS': {
      const { dataSet } = action.data;
      return {
        ...state,
        dataSet
      };
    }
    case 'DOWNLOAD_FETCH_DETAILS': {
      const { dataSet } = action.data;
      return {
        ...state,
        dataSet,
        isLoading: false
      };
    }
    case 'DOWNLOAD_FETCH_DETAILS_SUCCESS': {
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
