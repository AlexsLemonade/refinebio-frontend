import { Ajax } from '../common/helpers';

export async function getDataSet(dataSetId, tokenId = null) {
  const headers = tokenId
    ? {
        'API-KEY': tokenId,
      }
    : {};

  return await Ajax.get(`/dataset/${dataSetId}/`, null, headers);
}

export async function getDataSetDetails(dataSetId, tokenId = null) {
  const headers = tokenId
    ? {
        'API-KEY': tokenId,
      }
    : {};

  const response = await Ajax.get(
    `/dataset/${dataSetId}/`,
    { details: true },
    headers
  );

  return {
    ...response,
    experiments: formatExperiments(response.experiments),
  };
}

/**
 * Creates a new dataset
 */
export async function createDataSet() {
  return await Ajax.post('/dataset/create/', { data: {} });
}

export async function updateDataSet(dataSetId, dataSet, details = false) {
  // It's not technically wrong to add a query parameter to the URL of a PUT request. ref https://github.com/AlexsLemonade/refinebio-frontend/pull/485#discussion_r246158557
  // In this case, after a dataset is modified we'll need to fetch detailed information for it,
  // which will include the samples grouped by organism for example.
  // For a fully restfull api we could do a sepparate request for those, but that seems unnecessary
  // since we can have that calculated on this request.
  // When the api seels the `?details` parameter, it will include `experiments` and `organism_samples`
  // in the response.
  const result = await Ajax.put(
    `/dataset/${dataSetId}/${details ? '?details=true' : ''}`,
    { data: dataSet }
  );

  return details
    ? {
        ...result,
        experiments: formatExperiments(result.experiments),
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
