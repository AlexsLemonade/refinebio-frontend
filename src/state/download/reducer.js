import union from 'lodash/union';
import objectValues from 'lodash/values';

const initialState = {
  dataSetId: null,
  dataSet: {},
  experiments: {},
  organism_samples: {}, // samples grouped by organism
  isLoading: false,
  areDetailsFetched: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'DOWNLOAD_DATASET_FETCH': {
      const { dataSetId } = action.data;
      return {
        ...state, // keep previous state
        dataSetId,
      };
    }
    case 'DOWNLOAD_DATASET_UPDATE': {
      return {
        ...state,
        ...action.data,
      };
    }
    case 'DOWNLOAD_CLEAR': {
      return initialState;
    }

    default:
      return state;
  }
};

// Returns the dataset id stored in the state.
export const getDataSetId = state => state.download && state.download.dataSetId;

export function getExperimentCountBySpecies({ experiments, dataSet }) {
  if (!dataSet || !experiments) return {};
  const species = {};
  for (const accessionCode of Object.keys(dataSet)) {
    const experimentInfo = experiments[accessionCode];
    if (!experimentInfo) return {};

    const { organisms } = experimentInfo;
    for (const organism of organisms) {
      if (!species[organism]) species[organism] = 0;
      species[organism]++;
    }
  }

  return species;
}

export function getTotalSamplesAdded({ dataSet }) {
  if (!dataSet) return 0;
  return union(...objectValues(dataSet)).length;
}

export function getTotalExperimentsAdded({ dataSet }) {
  if (!dataSet) return 0;
  return Object.keys(dataSet).length;
}
