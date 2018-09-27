import { Ajax } from '../common/helpers';

export async function getDataSet(dataSetId) {
  return await Ajax.get(`/dataset/${dataSetId}/`);
}

export async function getDataSetDetails(dataSetId) {
  let response = await Ajax.get(`/dataset/${dataSetId}/`, { details: true });

  return {
    ...response,
    samples: formatSamples(response.data, response.samples),
    experiments: formatExperiments(response.experiments)
  };
}

export async function updateDataSet(dataSetId, dataSet) {
  return await Ajax.put(`/dataset/${dataSetId}/`, { data: dataSet });
}

// Takes in arrays of samples and experiments as formatted by the serializer
// and turns them into objects where the keys are experiment accession codes

export function formatExperiments(experiments) {
  return experiments.reduce((accum, experiment) => {
    accum[experiment.accession_code] = experiment;
    return accum;
  }, {});
}

export function formatSamples(data, samples) {
  let result = {};

  for (let accession_code of Object.keys(data)) {
    result[accession_code] = samples.filter(sample =>
      data[accession_code].includes(sample.accession_code)
    );
  }

  return result;
}
