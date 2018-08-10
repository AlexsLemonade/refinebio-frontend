import { Ajax } from '../common/helpers';

export async function getDataSet(dataSetId) {
  return await Ajax.get(`/dataset/${dataSetId}/`);
}

export async function getDataSetDetails(dataSetId) {
  return await Ajax.get(`/dataset/${dataSetId}/?details=true`);
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

      /*
      Use sample accessions from dataSet instead of experiment
      because some experiments may only have a subset of samples added
      */
      const sampleList = dataSet[accessionCode];
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
