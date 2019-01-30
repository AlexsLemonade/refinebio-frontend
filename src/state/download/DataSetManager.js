import difference from 'lodash/difference';
import uniq from 'lodash/uniq';

/**
 * Receives the current state of a data set, and provides methods to modify it.
 * The goal of this class is to keep this logic sepparated from the action creators.
 */
export default class DataSetManager {
  constructor(dataSet) {
    this.dataSet = dataSet || {};
  }

  removeExperiment(accessionCodesToRemove) {
    const result = {};

    for (let experimentId in this.dataSet) {
      if (accessionCodesToRemove.includes(experimentId)) continue;
      result[experimentId] = this.dataSet[experimentId];
    }

    return result;
  }

  add(dataSetSlice) {
    let result = { ...this.dataSet };
    for (let accessionCode of Object.keys(dataSetSlice)) {
      if (dataSetSlice[accessionCode].all) {
        // special code to add all samples from an experiment
        // https://github.com/AlexsLemonade/refinebio-frontend/issues/496#issuecomment-456543865
        result[accessionCode] = ['ALL'];
      } else {
        result[accessionCode] = uniq([
          ...(result[accessionCode] || []),
          ...dataSetSlice[accessionCode]
        ]);
      }
    }
    return result;
  }

  remove(dataSetSlice) {
    let result = { ...this.dataSet };
    for (let accessionCode of Object.keys(dataSetSlice)) {
      if (!result[accessionCode]) continue;

      const samplesStillSelected = difference(
        result[accessionCode],
        dataSetSlice[accessionCode]
      );
      if (samplesStillSelected.length > 0) {
        result[accessionCode] = samplesStillSelected;
      } else {
        delete result[accessionCode];
      }
    }
    return result;
  }
}
