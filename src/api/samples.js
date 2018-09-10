import { Ajax } from '../common/helpers';

/**
 * Returns detailed information for the given sample id
 * @param {number} sampleId Id of the Sample
 */
export async function getDetailedSample(sampleId) {
  return Ajax.get(`/samples/${sampleId}/`);
}

/**
 * Returns all the details of the samples ids given
 * @param {Array} ids Ids of the samples
 * @param {orderBy} ids Field to sort the samples eg(title or -title). ref https://github.com/AlexsLemonade/refinebio/pull/298#issue-191878045
 * @param {number} offset
 * @param {number} limit
 */
export async function getAllDetailedSamples({
  accessionCodes,
  orderBy,
  offset,
  limit
}) {
  if (accessionCodes && accessionCodes.length) {
    let { results } = await Ajax.get('/samples/', {
      // send the accession codes as a string, otherwise they will be converted to an array parameter
      accession_codes: accessionCodes.join(','),
      offset,
      limit,
      order_by: orderBy
    });
    return results;
  } else {
    return [];
  }
}

export async function getGenomeBuild(organism) {
  try {
    let { assembly_name } = await Ajax.get('/transcriptome_indices/', {
      organism,
      length: 'long'
    });

    return assembly_name;
  } catch (e) {
    return null;
  }
}
