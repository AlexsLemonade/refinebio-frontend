import { asyncFetch } from '../common/helpers';

/**
 * Returns detailed information for the given sample id
 * @param {number} sampleId Id of the Sample
 */
export async function getDetailedSample(sampleId) {
  return asyncFetch(`/samples/${sampleId}/`);
}

/**
 * Returns all the details of the samples ids given
 * @param {Array} sampleIds Ids of the samples
 */
export async function getAllDetailedSamples(sampleIds) {
  return Promise.all(sampleIds.map(id => getDetailedSample(id)));
}
