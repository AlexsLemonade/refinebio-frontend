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
    getStats(),
    // fetch samples per organisms, also used on the landing page
    axios
      .get(ApiHost + '/es/?limit=1&offset=0')
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
      .catch(_ => []),
    getPlatforms()
  ]).then(function([stats, { organism, apiVersion }, qnTargets, platforms]) {
    const cache = {
      version: version, // remove `v` at the start of each version
      apiVersion: apiVersion,
      stats,
      organism,
      qnTargets: qnTargets.reduce(
        (accum, organism) => ({ ...accum, [organism.name]: true }),
        {}
      ),
      platforms
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

/**
 * Fetch stats for the last year, this is used for the graphs in the landing page
 */
async function getStats() {
  try {
    let { data: stats } = await axios.get(ApiHost + '/stats/?range=year');
    return stats;
  } catch (e) {
    try {
      console.log('Error fetching stats with ranges, trying again...');
      // try getting general stats if the range fails
      let { data: stats } = await axios.get(ApiHost + '/stats/');
      return stats;
    } catch (e1) {
      // return nothing if that also fails
      console.log('Error fetching stats.');
      return false;
    }
  }
}

/**
 * Retrieves the platforms from the api and formats them into an object
 * where the keys are the platform accession codes and the values
 * are the platform names.
 */
async function getPlatforms() {
  try {
    const { data: platforms } = await axios.get(ApiHost + '/platforms');
    return platforms.reduce(
      (accum, { platform_name, platform_accession_code }) => ({
        ...accum,
        [platform_accession_code]: platform_name
      }),
      {}
    );
  } catch (e) {
    console.log('Error fetching platforms');
    return {};
  }
}
