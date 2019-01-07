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

export async function updateDataSet(dataSetId, dataSet, details = false) {
  // Q: is it wrong to include a query parameter in a PUT request?
  // the `details` parameter is only used to "modify" the reponse from the API, it doesn't
  // cause any side effect or different behavior
  const result = await Ajax.put(
    `/dataset/${dataSetId}/${details ? '?details=true' : ''}`,
    { data: dataSet }
  );

  return details
    ? {
        ...result,
        experiments: formatExperiments(result.experiments)
      }
    : result;
}

// Takes in arrays of samples and experiments as formatted by the serializer
// and turns them into objects where the keys are experiment accession codes

export function formatExperiments(experiments) {
  return experiments.reduce((accum, experiment) => {
    accum[experiment.accession_code] = experiment;
    return accum;
  }, {});
}
