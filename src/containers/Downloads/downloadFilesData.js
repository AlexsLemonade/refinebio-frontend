/**
 * Calculates estimates for file sizes when the samples are aggregated by specie
 */
export function downloadsFilesDataBySpecies(dataSet, samplesBySpecies) {
  const totalExperiments = Object.keys(dataSet).length;
  const totalSpecies = Object.keys(samplesBySpecies).length;
  const geneExpressionSize = estimateGeneExpressionSize(samplesBySpecies);
  const sampleMetadataSize = estimateSampleMetadataSize(dataSet);
  const qualityReportSize = estimateSpecieMetadataSize(dataSet);

  const allMetadataFileSize = sampleMetadataSize + qualityReportSize;

  const totalSize =
    geneExpressionSize +
    sampleMetadataSize +
    qualityReportSize +
    allMetadataFileSize;

  const data = {
    total: formatBytes(totalSize),
    files: [
      {
        title: `${totalSpecies} Gene Expression Matrices`,
        description: '1 file per Species',
        size: formatBytes(geneExpressionSize),
        format: 'tsv'
      },
      {
        title: `${totalExperiments} Sample Metadata Files`,
        description: '1 file per Experiment',
        size: formatBytes(sampleMetadataSize),
        format: 'tsv'
      },
      {
        title: `${totalSpecies} Species Metadata`,
        description: '1 file per Species',
        size: formatBytes(qualityReportSize),
        format: 'json'
      }
    ]
  };

  return data;
}

/**
 * Returns file information estimations for a dataset, used as a helper method for the downloads page
 * ref: https://github.com/AlexsLemonade/refinebio-frontend/issues/25#issuecomment-395870627
 */
export function downloadsFilesDataByExperiment(dataSet) {
  const totalExperiments = Object.keys(dataSet).length;
  const geneExpressionSize = estimateGeneExpressionSize(dataSet);
  const sampleMetadataSize = estimateSampleMetadataSize(dataSet);
  const qualityReportSize = estimateExperimentMetadataSize(dataSet);

  const allMetadataFileSize = sampleMetadataSize + qualityReportSize;

  const totalSize =
    geneExpressionSize +
    sampleMetadataSize +
    qualityReportSize +
    allMetadataFileSize;

  const data = {
    total: formatBytes(totalSize),
    files: [
      {
        title: `${totalExperiments} Gene Expression Matrices`,
        description: '1 file per Experiment',
        size: formatBytes(geneExpressionSize),
        format: 'tsv'
      },
      {
        title: `${totalExperiments} Sample Metadata Files`,
        description: '1 file per Experiment',
        size: formatBytes(sampleMetadataSize),
        format: 'tsv'
      },
      {
        title: `${totalExperiments} Experiment Metadata Files`,
        description: '1 file per Experiment',
        size: formatBytes(qualityReportSize),
        format: 'json'
      }
    ]
  };

  return data;
}

// TODO add a better estimation of the size of each sample metadata
function sampleMetadata() {
  const SAMPLE_SIZE = 5 * 1024;
  return SAMPLE_SIZE;
}

// TODO add correct estimate for the matrix of a sample
function estimateMatrixSizeOfSample() {
  return 20 * 256;
}

/**
 * Estimate the gene experssion matrix file sizes for a given dataset, this code was written using
 * https://github.com/AlexsLemonade/refinebio-frontend/issues/25#issue-324513980
 * as a guidance.
 */
function estimateGeneExpressionSize(dataSet) {
  let totalSize = 0;

  // calculate the size of each one of the experiments
  for (let experimentId of Object.keys(dataSet)) {
    let experimentSamples = dataSet[experimentId];
    // Need size of gene column for the first matrix.
    let experimentSize =
      (experimentSamples.length + 1) *
      0.5 *
      estimateMatrixSizeOfSample(experimentSamples[0]);
    totalSize = totalSize + experimentSize;
  }

  return totalSize;
}

function estimateSampleMetadataSize(dataSet) {
  let result = 0;
  // Count the total number of samples, and multiply it with the average sample size
  for (let experimentId of Object.keys(dataSet)) {
    let experimentSamples = dataSet[experimentId];
    for (let sampleId of experimentSamples) {
      result = result + sampleMetadata(sampleId);
    }
  }
  return result;
}

function estimateExperimentMetadataSize(dataSet) {
  // TODO Estimated size of experiment metadata file
  const EXPERIMENT_SIZE = 4048;
  return Object.keys(dataSet).length * EXPERIMENT_SIZE;
}

function estimateSpecieMetadataSize(samplesBySpecies) {
  const SAMPLE_SIZE = 2048;
  return Object.keys(samplesBySpecies).length * SAMPLE_SIZE;
}

/**
 * String formatting of file size
 * thanks to https://stackoverflow.com/a/18650828/763705
 * @param {*} bytes
 * @param {*} decimals
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  let k = 1024,
    dm = decimals,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
