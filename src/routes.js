import { getQueryString } from './common/helpers';

/**
 * This file contains routes used in the app
 */

export const experiments = (accessionCode, state = false) => {
  const pathname = `/experiments/${accessionCode}`;
  return !state ? pathname : { pathname, state };
};

export const experimentsSamples = (accessionCode, state = false) => {
  const pathname = `/experiments/${accessionCode}#samples`;
  return !state ? pathname : { pathname, state };
};

export const searchUrl = (params = false) => {
  return params ? `/search?${getQueryString(params)}` : '/search';
};
