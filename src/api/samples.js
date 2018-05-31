import { asyncFetch } from '../common/helpers';

/**
 * Returns detailed information for the given sample id
 * @param {number} sampleId Id of the Sample
 */
export async function getDetailedSample(sampleId) {
  return asyncFetch(`/samples/${sampleId}/`);
}

export async function getAllDetailedSamples(sampleIds) {
  return Promise.all(sampleIds.map(id => getDetailedSample(id)));
}
