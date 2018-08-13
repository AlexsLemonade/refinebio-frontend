

/**
 * Receives the current state of a data set, and provides methods to modify it.
 * The goal of this class is to keep this logic sepparated from the action creators.
 */
export default class DataSetManager {
  constructor(dataSet) {
    this.dataSet = dataSet;
  }

  removeExperiment(accessionCodesToRemove) {
    const result = {};

    for (let experimentId in this.dataSet) {
      if (accessionCodesToRemove.includes(experimentId)) continue;
      result[experimentId] = this.dataSet[experimentId];
    }

    return result;
  }

  removeSamplesFromExperiment(experimentAccessionCode, sampleAccessions) {
    const dataSet = this.dataSet;

    // get the samples that weren't removed
    const filteredSamples = dataSet[experimentAccessionCode].filter(
      sample => sampleAccessions.indexOf(sample) === -1
    );
    
    const newDataSet = { ...dataSet };

    if (filteredSamples.length > 0) {
      newDataSet[experimentAccessionCode] = filteredSamples;
    } else {
      delete newDataSet[experimentAccessionCode];
    }

    return newDataSet;
  }

  removeSpecies(sampleAccessions) {
    const dataSet = this.dataSet;

    const newDataSet = Object.keys(dataSet).reduce((result, accessionCode) => {
      const filteredSamples = dataSet[accessionCode].filter(sample => {
        return sampleAccessions.indexOf(sample) === -1;
      });
      
      if (filteredSamples.length) {
        result[accessionCode] = filteredSamples;
      }
      return result;
    }, {});

    return newDataSet;
  }


}
