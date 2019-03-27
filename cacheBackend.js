/**
 * This node script get's executed on every deploy. It updates the file `/src/apiData.json`
 * with some data from the backend that we want to have available without doing additional requests
 * every time some page is loaded.
 */

const axios = require('axios');
const fs = require('fs');
const slugify = require('./src/common/slugify');
const sm = require('sitemap');

const version = process.env.VERSION || '0.0.0';
const ApiHost = process.env.REACT_APP_API_HOST || 'https://api.refine.bio';

// Call scripts at deploy time
cacheServerData();
generateSitemap();

async function cacheServerData() {
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
      .catch(error => false),
    axios
      .get(ApiHost + '/qn_targets_available')
      .then(response => response.data)
      .catch(_ => [])
  ]).then(function([stats, { organism, apiVersion }, qnTargets]) {
    const cache = {
      version: version, // remove `v` at the start of each version
      apiVersion: apiVersion,
      stats,
      organism,
      qnTargets: qnTargets.reduce(
        (accum, organism) => ({ ...accum, [organism.name]: true }),
        {}
      )
    };
    fs.writeFileSync(`src/apiData.json`, JSON.stringify(cache));
  });
}

/**
 * Generates a sitemap by querying the API to get all experiments accession codes
 */
async function generateSitemap() {
  console.log('Building sitemap...');
  // number of experiments retrieved on each request
  const limit = 500;
  let sitemap = sm.createSitemap({
    hostname: 'https://www.refine.bio',
    cacheTime: 600000,
    urls: [
      { url: '/about', priority: 0.5 },
      { url: '/license', priority: 0.5 },
      { url: '/privacy', priority: 0.5 },
      { url: '/terms', priority: 0.5 }
    ]
  });

  for (let page = 0; ; page++) {
    const offset = page * limit;
    try {
      const {
        data: { count, results }
      } = await axios.get(ApiHost + `/es/?limit=${limit}&offset=${offset}`);

      for (let experiment of results) {
        sitemap.add({
          url: `/experiments/${experiment.accession_code}/${slugify(
            experiment.title
          )}`,
          priority: 0.8
        });
      }

      // break if we're on the last page
      if ((page + 1) * limit > count) {
        console.log(`Sitemap generated. ${count} experiments found.`);
        break;
      }
    } catch (e) {
      console.log(e);
      return;
    }
  }
  fs.writeFileSync('./public/sitemap.xml', sitemap.toString());
}
