import SampleFieldMetadata from '../containers/Experiment/SampleFieldMetadata';
import { ApiVersionMismatchError, ServerError } from '../common/errors';

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
    if (!queryParam) return;
    let [key, value] = queryParam.split('=');
    value = decodeURIComponent(value);
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

// Store the last api version detected, this is used to detect updates to the api
// while the app is running.
let ApiSourceRevision = false;

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
      !!ApiSourceRevision &&
      ApiSourceRevision !== sourceRevision
    ) {
      throw new ApiVersionMismatchError();
    }

    // save the last source revision
    ApiSourceRevision = sourceRevision;
  }

  const result = await response.json();
  /**
   * You only get an exception (rejection) when there's a network problem.
   * When the server answers, you have to check whether it's good or not.
   */
  if (!response.ok) {
    throw new ServerError(response.status, result);
  }
  return result;
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

// thanks to https://github.com/customd/jquery-number/blob/master/jquery.number.js#L729
export function formatNumber(number, decimals = 2, decPoint, thousandsSep) {
  // Set the default values here, instead so we can use them in the replace below.
  thousandsSep =
    typeof thousandsSep === 'undefined'
      ? (1000).toLocaleString() !== '1000'
        ? (1000).toLocaleString().charAt(1)
        : ''
      : thousandsSep;
  decPoint =
    typeof decPoint === 'undefined'
      ? (0.1).toLocaleString().charAt(1)
      : decPoint;

  // Work out the unicode representation for the decimal place and thousand sep.
  let uDec = '\\u' + ('0000' + decPoint.charCodeAt(0).toString(16)).slice(-4);
  let uSep =
    '\\u' + ('0000' + thousandsSep.charCodeAt(0).toString(16)).slice(-4);

  // Fix the number, so that it's an actual number.
  number = (number + '')
    .replace('.', decPoint) // because the number if passed in as a float (having . as decimal point per definition) we need to replace this with the passed in decimal point character
    .replace(new RegExp(uSep, 'g'), '')
    .replace(new RegExp(uDec, 'g'), '.')
    .replace(new RegExp('[^0-9+-Ee.]', 'g'), '');

  let n = !isFinite(+number) ? 0 : +number;
  let s = '';
  let toFixedFix = function(nArg, decimalsArg) {
    return (
      '' +
      +(
        Math.round(
          ('' + nArg).indexOf('e') > 0 ? nArg : nArg + 'e+' + decimalsArg
        ) +
        'e-' +
        decimalsArg
      )
    );
  };

  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (decimals ? toFixedFix(n, decimals) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, thousandsSep);
  }
  if ((s[1] || '').length < decimals) {
    s[1] = s[1] || '';
    s[1] += new Array(decimals - s[1].length + 1).join('0');
  }
  return s.join(decPoint);
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

export const getMetadataFields = sampleMetadataFields =>
  SampleFieldMetadata.filter(
    field => sampleMetadataFields && sampleMetadataFields.includes(field.id)
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

// thanks to https://stackoverflow.com/a/18650828/763705
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals <= 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
