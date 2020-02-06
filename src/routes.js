import { getQueryString, isServer } from './common/helpers';
import slugify from './common/slugify';

/**
 * This file contains routes used in the app
 */

export const experiments = ({ accession_code, title }) => {
  const pathname = `/experiments/${accession_code}/${slugify(title)}`;
  return pathname;
};

export const experimentsSamples = ({ accession_code, title }) => {
  const pathname = `/experiments/${accession_code}/${slugify(title)}#samples`;
  return pathname;
};

export const searchUrl = (params = false) => {
  return params ? `/search?${getQueryString(params)}` : '/search';
};
