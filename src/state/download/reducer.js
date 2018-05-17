const initialState = {
  experiments: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'DOWNLOAD_EXPERIMENT_REMOVED': {
      const { experimentId } = action.data;
      const filteredExperiments = state.experiments.filter(
        experiment => experiment.id !== experimentId
      );
      return {
        ...state,
        experiments: filteredExperiments
      };
    }
    case 'DOWNLOAD_SPECIES_REMOVED': {
      const { speciesName } = action.data;
      const experimentsWithFilteredSamples = state.experiments.reduce(
        (filteredExperiments, experiment) => {
          const filteredSamples = experiment.samples.filter(
            sample => sample.organism.name !== speciesName
          );
          if (filteredSamples.length) filteredExperiments.push(filteredSamples);
          return filteredExperiments;
        },
        []
      );

      return {
        ...state,
        experiments: experimentsWithFilteredSamples
      };
    }
    case 'DOWNLOAD_FETCH_DATA': {
      const { dataSet } = action.data;
      console.log(dataSet);
      return {
        ...state,
        experiments: dataSet
      };
    }
    default:
      return state;
  }
};

export function groupSamplesBySpecies(state) {
  const { experiments = [] } = state.download;

  return experiments.reduce((species, experiment) => {
    if (!experiment.samples) return species;
    experiment.samples.forEach(sample => {
      const { organism: { name: organismName } } = sample;
      species[organismName] = species[organismName] || [];
      species[organismName].push(sample);
    });
    return species;
  }, {});
}
