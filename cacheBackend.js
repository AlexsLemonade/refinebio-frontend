/**
 * This node script get's executed on every deploy. It updates the file `/src/apiData.json`
 * with some data from the backend that we want to have available without doing additional requests
 * every time some page is loaded.
 */

const axios = require('axios');
const fs = require('fs');
const sm = require('sitemap');
const _ = require('lodash');
const slugify = require('./src/common/slugify');

const version = process.env.VERSION || '0.0.0';
const ApiHost = process.env.REACT_APP_API_HOST || 'https://api.refine.bio';

// Call scripts at deploy time
cacheServerData();
generateSitemap();

async function cacheServerData() {
  console.log(`Fetching data to be cached from endpoint: ${ApiHost}`);
  const [
    stats,
    { organism, apiVersion },
    qnTargets,
    platforms,
  ] = await Promise.all([
    getStats(),
    getSamplesPerOrganism(),
    getQnTargets(),
    getPlatforms(),
  ]);
  const cache = {
    version, // remove `v` at the start of each version
    apiVersion,
    stats,
    organism,
    qnTargets,
    platforms,
  };
  fs.writeFileSync(`src/apiData.json`, JSON.stringify(cache));
}

/**
 * Generates a sitemap by querying the API to get all experiments accession codes
 */
async function generateSitemap() {
  console.log('Building sitemap...');
  // number of experiments retrieved on each request
  const limit = 500;
  const sitemap = sm.createSitemap({
    hostname: 'https://www.refine.bio',
    cacheTime: 600000,
    urls: [
      { url: '/about', priority: 0.5 },
      { url: '/license', priority: 0.5 },
      { url: '/privacy', priority: 0.5 },
      { url: '/terms', priority: 0.5 },
    ],
  });

  // get the total number of experiments
  const {
    data: { count },
  } = await axios.get(`${ApiHost}/search/?limit=${0}`);

  const pageOffsets = _.range(0, count, limit);
  const experimentPages = await Promise.all(
    pageOffsets.map(offset =>
      axios
        .get(`${ApiHost}/search/?limit=${limit}&offset=${offset}`)
        .then(request => request.data.results)
        .catch(ignore => [])
    )
  );

  for (const results of experimentPages) {
    for (const experiment of results) {
      sitemap.add({
        url: `/experiments/${experiment.accession_code}/${slugify(
          experiment.title
        )}`,
        priority: 0.8,
      });
    }
  }

  console.log(`Sitemap generated. ${count} experiments found.`);
  fs.writeFileSync('./public/sitemap.xml', sitemap.toString());
}

/**
 * Fetch stats for the last year, this is used for the graphs in the landing page
 */
async function getStats() {
  try {
    const { data: stats } = await axios.get(`${ApiHost}/stats/?range=year`);
    return stats;
  } catch (e) {
    try {
      console.log('Error fetching stats with ranges, trying again...');
      // try getting general stats if the range fails
      const { data: stats } = await axios.get(`${ApiHost}/stats/`);
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
    const { data: platforms } = await axios.get(`${ApiHost}/platforms`);
    return platforms.reduce(
      (accum, { platform_name, platform_accession_code }) => ({
        ...accum,
        [platform_accession_code]: platform_name,
      }),
      {}
    );
  } catch (e) {
    console.log('Error fetching platforms');
    return {};
  }
}

async function getQnTargets() {
  const { data: qnTargets } = await axios.get(`${ApiHost}/qn_targets`);
  return qnTargets.reduce(
    (accum, { name: organismName }) => ({
      ...accum,
      [organismName]: true,
    }),
    {}
  );
}

function getSamplesPerOrganism() {
  return axios
    .get(`${ApiHost}/search/?limit=1&offset=0`)
    .then(response => ({
      organism: response.data.filters.organism,
      apiVersion: response.headers['x-source-revision'],
    }))
    .catch(error => false);
}
