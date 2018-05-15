export const removedExperiment = experimentId => {
  return {
    type: 'DOWNLOAD_EXPERIMENT_REMOVED',
    data: {
      experimentId
    }
  };
};

export const removedSpecies = speciesName => {
  return {
    type: 'DOWNLOAD_SPECIES_REMOVED',
    data: {
      speciesName
    }
  };
};
