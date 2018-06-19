import { Ajax } from '../common/helpers';

export async function getDataSet(dataSetId) {
  return await Ajax.get(`/dataset/${dataSetId}/`);
}

export async function getSamplesAndExperiments(dataSet) {
  const experiments = {},
    samples = {};

  await Promise.all(
    Object.keys(dataSet).map(async accessionCode => {
      const experiment = await Ajax.get('/experiments/', {
        accession_code: accessionCode
      });

      experiments[accessionCode] = experiment.results[0];

      // there should only be one result for each experiment response
      const experimentInfo = experiment.results[0];
      const { samples: sampleList } = experimentInfo;
      const response = await Ajax.get('/samples/', {
        limit: 1000000000000000,
        accession_codes: sampleList.join(',')
      });
      const sampleInfo = response.results;

      samples[accessionCode] = sampleInfo;
    })
  );

  return { experiments, samples };
}

export async function updateDataSet(dataSetId, dataSet) {
  return await Ajax.put(`/dataset/${dataSetId}/`, { data: dataSet });
}
