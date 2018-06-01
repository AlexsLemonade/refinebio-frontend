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

  /**
   * You only get an exception (rejection) when there's a network problem.
   * When the server answers, you have to check whether it's good or not.
   */
  if (!response.ok) throw new Error(response.status);
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
  const tmpStr = str.toLowerCase().replace(/_/g, ' ');
  return tmpStr.charAt(0).toUpperCase() + tmpStr.slice(1);
}

// Helper methods to ease working with ajax functions
export const Ajax = {
  get: (url, params) => asyncFetch(`${url}?${getQueryString(params)}`),
  put: (url, params) =>
    asyncFetch(url, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(params)
    }),
  post: (url, params) =>
    asyncFetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(params)
    })
};
