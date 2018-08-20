

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

  removeSamples(samples) {
    const dataSet = this.dataSet;
    const sampleAccessions = samples.map(sample => sample.accession_code);

    const newDataSet = Object.keys(dataSet).reduce((result, accessionCode) => {
      const filteredSamples = dataSet[accessionCode].filter(sample => {
        return sampleAccessions.indexOf(sample) === -1;
      });
      
      if (filteredSamples.length > 0) {
        result[accessionCode] = filteredSamples;
      }
      return result;
    }, {});

    return newDataSet;
  }

  /**
   * Adds a set of experiments to the current dataset
   * @param {array<{accession_code, samples}>} experiments 
   */
  addExperiment(experiments) {
    let newDataSetExperiments = {};
    for (let experiment of experiments) {
      if (experiment.samples.length === 0) continue;
      let sampleAccessions = experiment.samples
        .filter(x => x.is_processed) // filter out unprocessed samples
        .map(x => x.accession_code);
      newDataSetExperiments[experiment.accession_code] = sampleAccessions;

      // check if the current experiment had samples in the dataset previousle
      // in which case make sure that those are also added
      if (this.dataSet[experiment.accession_code]) {
        // Remove duplicates from the array, since the backend throws errors
        // on non-unique accessions
        newDataSetExperiments[experiment.accession_code] = [
          ...new Set([
            ...this.dataSet[experiment.accession_code],
            ...sampleAccessions
          ])
        ];
      }
    }

    return {
      ...this.dataSet,
      ...newDataSetExperiments
    };
  }
}


