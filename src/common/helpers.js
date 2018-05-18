/**
 * Generates a query string from a query object
 * @param {any} queryObj
 * @returns {string}
 */
export function getQueryString(queryObj) {
  const query = [];
  Object.keys(queryObj).forEach(key => {
    if (queryObj[key]) query.push(`${key}=${encodeURI(queryObj[key])}`);
  });
  return query.join('&');
}

/**
 * Returns the value of a query param given a query string
 * @param {any} queryString
 * @param {any} queryParam
 * @returns string
 */
export function getQueryParamValue(queryString, queryParam) {
  const queryObj = {};
  queryString.split('&').forEach(queryParam => {
    const [key, value] = queryParam.split('=');
    queryObj[key] = value;
  });
  return queryObj[queryParam];
}
