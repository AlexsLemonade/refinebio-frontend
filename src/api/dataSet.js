import { asyncFetch } from '../common/helpers';

export async function getDataSet(dataSetId) {
  return await asyncFetch(`/dataset/${dataSetId}/`);
}

export async function getSamplesAndExperiments(dataSet) {
  const experiments = {},
    samples = {};

  await Promise.all(
    Object.keys(dataSet).map(async accessionCode => {
      const experiment = await asyncFetch(
        `/experiments/?accession_code=${accessionCode}`
      );

      experiments[accessionCode] = experiment.results[0];

      // there should only be one result for each experiment response
      const experimentInfo = experiment.results[0];
      const { samples: sampleList } = experimentInfo;
      const response = await asyncFetch(
        `/samples/?limit=1000000000000000&ids=${sampleList.join(',')}`
      );
      const sampleInfo = response.results;

      samples[accessionCode] = sampleInfo;
    })
  );

  return { experiments, samples };
}

export async function updateDataSet(dataSetId, dataSet) {
  return await asyncFetch(`/dataset/${dataSetId}/`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      data: dataSet
    })
  });
}
