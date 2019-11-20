import { Ajax } from '../common/helpers';

export async function fetchCompendiaData(additionalFilters = {}, token) {
  try {
    const filters = {
      ...{
        latest_version: true,
        ordering: 'primary_organism__name',
        limit: 1000,
      },
      ...additionalFilters,
    };

    const values = Object.entries(filters).map(([key, value]) => {
      return `${key}=${value}`;
    });
    const endpoint = `/v1/compendia/?${values.join('&')}`;
    const tokenObject = token ? { 'API-KEY': token } : null;

    const response = await Ajax.get(endpoint, null, tokenObject);

    return response.results;
  } catch (e) {
    return [];
  }
}

export async function fetchCompendium(token, selected) {
  const compendium = await Ajax.get(`/v1/compendia/${selected.id}`, null, {
    'API-KEY': token,
  });
  return { compendium, downloadUrl: compendium.computed_file.download_url };
}
