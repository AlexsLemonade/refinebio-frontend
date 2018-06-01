import { asyncFetch, Ajax } from '../common/helpers';

/**
 * Returns detailed information for the given sample id
 * @param {number} sampleId Id of the Sample
 */
export async function getDetailedSample(sampleId) {
  return asyncFetch(`/samples/${sampleId}/`);
}

/**
 * Returns all the details of the samples ids given
 * @param {Array} ids Ids of the samples
 * @param {orderBy} ids Field to sort the samples eg(title or -title). ref https://github.com/AlexsLemonade/refinebio/pull/298#issue-191878045
 * @param {number} offset
 * @param {number} limit
 */
export async function getAllDetailedSamples({ ids, orderBy, offset, limit }) {
  let { results } = await Ajax.get('/samples/', {
    ids,
    offset,
    limit,
    order_by: orderBy
  });
  return results;
}
