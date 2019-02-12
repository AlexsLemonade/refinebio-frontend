/**
 * This node script get's executed on every deploy. It updates the file `/src/apiData.json`
 * with some data from the backend that we want to have available without doing additional requests
 * every time some page is loaded.
 */

const axios = require('axios');
const fs = require('fs');

const version = process.env.VERSION || '0.0.0';
const ApiHost = process.env.REACT_APP_API_HOST || 'https://api.refine.bio';

console.log('Fetching data to be cached from endpoint: ' + ApiHost);

Promise.all([
  // fetch stats for the last year, this is used for the graphs in the landing page
  axios
    .get(ApiHost + '/stats/?range=year')
    .then(function(response) {
      return response.data;
    })
    // try getting general stats if the range fails
    .catch(error => axios.get(ApiHost + '/stats/'))
    .then(function(response) {
      return response.data;
    })
    // return nothing if that also fails
    .catch(error => false),
  // fetch samples per organisms, also used on the landing page
  axios
    .get(ApiHost + '/search/?limit=1&offset=0')
    .then(function(response) {
      return {
        organism: response.data.filters.organism,
        apiVersion: response.headers['x-source-revision']
      };
    })
    .catch(error => false)
]).then(function([stats, { organism, apiVersion }]) {
  const cache = {
    version: version, // remove `v` at the start of each version
    apiVersion: apiVersion,
    stats,
    organism
  };
  fs.writeFileSync(`src/apiData.json`, JSON.stringify(cache));
});
