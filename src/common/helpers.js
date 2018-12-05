import SampleFieldMetadata from '../containers/Experiment/SampleFieldMetadata';
import apiData from '../apiData.json';
import { ApiVersionMismatchError } from '../common/errors';

/**
 * Generates a query string from a query object
 * @param {object} queryObj
 * @returns {string}
 */
export function getQueryString(queryObj) {
  return Object.keys(queryObj)
    .filter(key => queryObj[key] !== undefined)
    .reduce((accum, key) => {
      // For some query parameters, the key points to an array of values.
      // In those instances we want a separate param for each value,
      // otherwise we just want the one param for the value.
      if (Array.isArray(queryObj[key])) {
        return accum.concat(
          queryObj[key].map(value => `${key}=${encodeURI(value)}`)
        );
      } else {
        accum.push(`${key}=${encodeURI(queryObj[key])}`);
        return accum;
      }
    }, [])
    .join('&');
}

/**
 * Returns a query param object given a query string
 * @param {string} queryString
 * @returns {object}
 */
export function getQueryParamObject(queryString) {
  if (queryString.startsWith('?')) {
    queryString = queryString.substr(1);
  }

  const queryObj = {};
  queryString.split('&').forEach(queryParam => {
    const [key, value] = queryParam.split('=');
    // check if the parameter has already been seen, in which case we have to parse it as an array
    if (!!queryObj[key]) {
      if (!Array.isArray(queryObj[key])) {
        // save the parameter as an array
        queryObj[key] = [queryObj[key], value];
      } else {
        // if it's already an array just add it
        queryObj[key].push(value);
      }
    } else if (value) {
      // only add the parameter if there's an actual value to add
      queryObj[key] = value;
    }
  });
  return queryObj;
}

/**
 * Generates an array of consecutive numbers from 1 to n.
 *
 * @param {number} n
 * @returns {array}
 */
export function getRange(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    result.push(i);
  }
  return result;
}

/**
 * Using fetch with async await that returns fulfilled value of the request
 *
 * @param {string} url
 * @param {object} params
 * @returns {Promise}
 */

export async function asyncFetch(url, params = false) {
  const fullURL = process.env.REACT_APP_API_HOST
    ? `${process.env.REACT_APP_API_HOST}${url}`
    : url;

  let response;
  try {
    response = await (!!params ? fetch(fullURL, params) : fetch(fullURL));
  } catch (e) {
    throw new Error(`Network error when fetching ${url}`);
  }

  // check backend version to ensure it hasn't changed since the last deploy
  if (response.headers) {
    const sourceRevision = response.headers.get('x-source-revision');
    if (
      !!sourceRevision &&
      !!apiData.sourceRevision &&
      apiData.sourceRevision !== sourceRevision
    ) {
      throw new ApiVersionMismatchError();
    }
  }

  /**
   * You only get an exception (rejection) when there's a network problem.
   * When the server answers, you have to check whether it's good or not.
   */
  if (!response.ok) {
    throw new Error(response.status);
  }
  return await response.json();
}

export function getAmazonDownloadLinkUrl(s3_bucket, s3_key) {
  return `https://s3.amazonaws.com/${s3_bucket}/${s3_key}`;
}

/**
 * Returns the current domain where the application is running.
 * If we ever introduce environment variables, this should be updated
 * ref: https://github.com/AlexsLemonade/refinebio-frontend/pull/44#discussion_r191784930
 */
export function getDomain() {
  return window.location.origin;
}

export function formatSentenceCase(str) {
  if (!str) return '';

  const tmpStr = str.toLowerCase().replace(/_/g, ' ');
  return tmpStr.charAt(0).toUpperCase() + tmpStr.slice(1);
}

// Helper methods to ease working with ajax functions
export const Ajax = {
  get: (url, params = false) => {
    if (params) {
      return asyncFetch(`${url}?${getQueryString(params)}`);
    }
    return asyncFetch(url);
  },
  put: (url, params = {}) =>
    asyncFetch(url, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(params)
    }),
  post: (url, params = {}) =>
    asyncFetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(params)
    })
};

export const getMetadataFields = experiment =>
  SampleFieldMetadata.filter(
    field =>
      experiment.sample_metadata &&
      experiment.sample_metadata.includes(field.id)
  ).map(field => field.Header);

export function stringEnumerate([x0, ...rest]) {
  if (!rest || !rest.length) {
    return x0;
  }

  return `${[x0, ...rest.slice(0, rest.length - 1)].join(', ')} and ${
    rest[rest.length - 1]
  }`;
}

/** Allows await for a specified time interval */
export const timeout = ms => new Promise(res => setTimeout(res, ms));

// thanks to https://stackoverflow.com/a/33379772/763705
export function truncateOnWord(str, limit, end = '...') {
  const trimmable =
    '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF';
  const reg = new RegExp('(?=[' + trimmable + '])');
  const words = str.split(reg);
  let count = 0;
  let result = words
    .filter(function(word) {
      count += word.length;
      return count <= limit;
    })
    .join('');
  return result + (result !== str ? end : '');
}

// thanks to https://stackoverflow.com/a/34695026/763705
export function isValidURL(str) {
  var a = document.createElement('a');
  a.href = str;
  return a.host && a.host !== window.location.host;
}

function accumulate(array, sum) {
  let result = [array[0]];
  for (let i = 1; i < array.length; i++) {
    result.push(sum(array[i], result[i - 1]));
  }
  return result;
}

export function accumulateByKeys(array, keys) {
  return accumulate(array, (current, prev) => ({
    ...current,
    ...keys.reduce((accum, key) => {
      accum[key] = current[key] + prev[key];
      return accum;
    }, {})
  }));
}
