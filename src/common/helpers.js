/*
 * Takes a query object and returns formatted query string
 */
export function getQueryString(queryObj) {
  const query = [];
  Object.keys(queryObj).forEach(key => {
    console.log(key);
    query.push(`${key}=${encodeURI(queryObj[key])}`);
  });
  return query.join('&');
}

export function getQueryParamValue(queryString, queryParam) {
  const queryObj = {};
  queryString.split('&').forEach(queryParam => {
    const [key, value] = queryParam.split('=');
    queryObj[key] = value;
  });
  return queryObj[queryParam];
}
