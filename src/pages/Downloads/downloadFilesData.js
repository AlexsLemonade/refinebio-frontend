/**
 * Calculates estimates for file sizes when the samples are aggregated by specie
 */
export function downloadsFilesDataBySpecies(dataSet, samplesBySpecies) {
  const totalExperiments = Object.keys(dataSet).length;
  const totalSpecies = Object.keys(samplesBySpecies).length;

  const data = {
    files: [
      {
        title: `${totalSpecies} Gene Expression Matrices`,
        description: '1 file per Species',
        format: 'tsv',
      },
      {
        title: `${totalExperiments} Sample Metadata Files`,
        description: '1 file per Experiment',
        format: 'tsv',
      },
      {
        title: `${totalSpecies} Species Metadata`,
        description: '1 file per Species',
        format: 'json',
      },
    ],
  };

  return data;
}

/**
 * Returns file information estimations for a dataset, used as a helper method for the downloads page
 * ref: https://github.com/AlexsLemonade/refinebio-frontend/issues/25#issuecomment-395870627
 */
export function downloadsFilesDataByExperiment(dataSet) {
  const totalExperiments = Object.keys(dataSet).length;

  const data = {
    files: [
      {
        title: `${totalExperiments} Gene Expression Matrices`,
        description: '1 file per Experiment',
        format: 'tsv',
      },
      {
        title: `${totalExperiments} Sample Metadata Files`,
        description: '1 file per Experiment',
        format: 'tsv',
      },
      {
        title: `${totalExperiments} Experiment Metadata Files`,
        description: '1 file per Experiment',
        format: 'json',
      },
    ],
  };

  return data;
}
