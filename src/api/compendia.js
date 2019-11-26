import { Ajax } from '../common/helpers';

export async function fetchCompendiaData(
  additionalFilters = {},
  token = false
) {
  try {
    const tokenObject = token ? { 'API-KEY': token } : null;
    const response = await Ajax.get(
      '/v1/compendia/',
      {
        limit: 1000,
        ...additionalFilters,
      },
      tokenObject
    );
    return response.results;
  } catch (e) {
    return [];
  }
}

export async function fetchCompendium(token, id) {
  const compendium = await Ajax.get(`/v1/compendia/${id}`, null, {
    'API-KEY': token,
  });
  return { compendium, downloadUrl: compendium.computed_file.download_url };
}
