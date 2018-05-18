/**
 * Generates a query string from a query object
 * @param {object} queryObj
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
