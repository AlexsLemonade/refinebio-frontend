/**
 * Contains helper methods to calculate stats between a dataset and a list of samples
 * eg, how many processed samples are already in the dataset
 */
export default class DataSetStats {
  constructor(dataSet, samples) {
    this.dataSet = dataSet;
    this.samples = samples;
  }

  anyProcessedSamples() {
    return this.samples.some(x => x.is_processed);
  }

  anyUnprocessedSample() {
    return this.samples.some(x => !x.is_processed);
  }

  allProcessedInDataSet() {
    return this.getProcessedSamples().every(x => this.sampleInDataSet(x));
  }

  anyProcessedInDataSet() {
    return this.getProcessedSamples().some(x => this.sampleInDataSet(x));
  }

  /**
   * Returns true if a given sample is in the dataset
   * @param {any} sample Sample object, with key `accession_code`
   */
  sampleInDataSet(sample) {
    for (let experimentId in this.dataSet) {
      // check if the passed sample is part of the experiment
      if (
        this.dataSet[experimentId].some(
          sampleAccessionCode => sampleAccessionCode === sample.accession_code
        )
      ) {
        return true;
      }
    }
    return false;
  }

  getProcessedSamples() {
    return this.samples.filter(x => x.is_processed);
  }

  getSamplesInDataSet() {
    return this.samples.filter(x => x.is_processed && this.sampleInDataSet(x));
  }
}
