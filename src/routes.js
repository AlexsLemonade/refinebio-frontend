import { getQueryString, slugify } from './common/helpers';

/**
 * This file contains routes used in the app
 */

export const experiments = ({ accession_code, title }, state = false) => {
  const pathname = `/experiments/${accession_code}/${slugify(title)}`;
  return !state ? pathname : { pathname, state };
};

export const experimentsSamples = (
  { accession_code, title },
  state = false
) => {
  const pathname = `/experiments/${accession_code}/${slugify(title)}#samples`;
  return !state ? pathname : { pathname, state };
};

export const searchUrl = (params = false) => {
  return params ? `/search?${getQueryString(params)}` : '/search';
};
