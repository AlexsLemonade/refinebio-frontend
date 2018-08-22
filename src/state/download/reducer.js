const initialState = {
  dataSetId: null,
  dataSet: {},
  experiments: {},
  samples: {},
  isLoading: false,
  areDetailsFetched: false
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
      const {
        dataSet,
        is_processing,
        is_processed,
        aggregate_by,
        scale_by,
        expires_on
      } = action.data;
      return {
        ...state,
        dataSet,
        is_processing,
        is_processed,
        aggregate_by,
        scale_by,
        expires_on,
        isLoading: false
      };
    }
    case 'DOWNLOAD_ADD_EXPERIMENT': {
      return {
        ...state,
        isLoading: true
      };
    }
    case 'DOWNLOAD_ADD_EXPERIMENT_SUCCESS': {
      const { dataSetId, dataSet } = action.data;
      return {
        ...state,
        dataSetId,
        dataSet,
        // When things are added the local details become desynced
        areDetailsFetched: false,
        isLoading: false
      };
    }
    case 'DOWNLOAD_UPDATE_DATASET': {
      const { dataSet } = action.data;
      return {
        ...state,
        dataSet
      };
    }
    case 'DOWNLOAD_FETCH_DETAILS': {
      const { dataSetId } = action.data;
      return {
        ...state,
        dataSetId,
        isLoading: true
      };
    }
    case 'DOWNLOAD_FETCH_DETAILS_SUCCESS': {
      const {
        dataSet,
        is_processing,
        is_processed,
        aggregate_by,
        scale_by,
        samples,
        experiments
      } = action.data;
      return {
        ...state,
        dataSet,
        is_processing,
        is_processed,
        aggregate_by,
        scale_by,
        samples,
        experiments,
        isLoading: false,
        areDetailsFetched: true
      };
    }
    case 'DOWNLOAD_CLEAR': {
      return {
        ...state,
        dataSetId: null,
        dataSet: {},
        isLoading: false
      };
    }

    default:
      return state;
  }
};

export function groupSamplesBySpecies({ samples, dataSet }) {
  return Object.keys(dataSet).reduce((species, experimentAccessionCode) => {
    if (!Object.keys(samples).length || !samples[experimentAccessionCode])
      return species;
    const experiment = dataSet[experimentAccessionCode];
    if (!experiment || !experiment.length) return species;
    experiment.forEach(addedSample => {
      const sample = samples[experimentAccessionCode].find(
        sample => sample.accession_code === addedSample
      );
      const {
        organism: { name: organismName }
      } = sample;
      const modifiedSample = { ...sample, experimentAccessionCode };
      species[organismName] = species[organismName] || [];
      species[organismName].push(modifiedSample);
    });
    return species;
  }, {});
}

export function getExperimentCountBySpecies({ experiments, dataSet }) {
  if (!dataSet) return {};

  return Object.keys(dataSet).reduce((species, accessionCode) => {
    const experimentInfo = experiments[accessionCode];
    if (!experimentInfo) return {};
    const { organisms } = experimentInfo;
    organisms.forEach(organism => {
      if (!species[organism]) species[organism] = 0;
      species[organism]++;
    });
    return species;
  }, {});
}

export function getTotalSamplesAdded({ dataSet }) {
  if (!dataSet) return 0;
  return Object.keys(dataSet).reduce((sum, accessionCode) => {
    return sum + dataSet[accessionCode].length;
  }, 0);
}

export function getTotalExperimentsAdded({ dataSet }) {
  if (!dataSet) return 0;

  return Object.keys(dataSet).length;
}
