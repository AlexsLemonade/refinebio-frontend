import { Ajax } from '../common/helpers';

export async function getDataSet(dataSetId) {
  return await Ajax.get(`/dataset/${dataSetId}/`);
}

export async function getDataSetDetails(dataSetId) {
  let response = await Ajax.get(`/dataset/${dataSetId}/`, { details: true });

  return {
    ...response,
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
