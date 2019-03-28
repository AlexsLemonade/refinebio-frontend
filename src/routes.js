import { getQueryString } from './common/helpers';
import slugify from './common/slugify';

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

export const searchRequestUrl = ({ query, continueTo }) => ({
  pathname: '/search/request',
  state: {
    query,
    continueTo
  }
});
