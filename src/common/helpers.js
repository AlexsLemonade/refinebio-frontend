/**
 * Generates a query string from a query object
 * @param {object} queryObj
 * @returns {string}
 */
export function getQueryString(queryObj) {
  return Object.keys(queryObj)
    .filter(key => queryObj[key] !== undefined)
    .map(key => `${key}=${encodeURI(queryObj[key])}`)
    .join('&');
}

/**
 * Returns a query param object given a query string
 * @param {string} queryString
 * @returns {object}
 */
export function getQueryParamObject(queryString) {
  const queryObj = {};
  queryString.split('&').forEach(queryParam => {
    const [key, value] = queryParam.split('=');
    queryObj[key] = value;
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
export async function asyncFetch(url, params) {
  const response = await fetch(url, params);
  return await response.json();
}
