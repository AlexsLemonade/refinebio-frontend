const axios = require('axios');
const fs = require('fs');
const { createSitemapIndex } = require('sitemap');
const slugify = require('./src/common/slugify');

const hostname = process.env.HOST_NAME || 'https://www.refine.bio';
const targetFolder = `${__dirname}/public`;

const ApiVersion = 'v1';
const ApiHost = `${process.env.REACT_APP_API_HOST || 'https://api.refine.bio'}/${ApiVersion}`;

const limit = 1000;

const resourceEndpoints = {
  experiments: `${ApiHost}/search/?limit=${limit}&ordering=id`,
 // samples: `${Api}/samples?limit=${limit}&ordering=id`,
};

/**
*Generates a sitemap by querying the API to get all experiments accession codes
*/

const getSitemapUrlForResource = (resource) => 
  (result) => {
    switch (resource) {
      case 'experiments':
        const { accession_code: code } = result;
        const title = slugify(result.title);
        return {
          url: `/${resource}/${code}/${title}`,
          priority: 0.8,
        }
    }
  }

const getUrlsForResources = async (...resources) => {
  const urls = [];
  for (const resource of resources) {
    const getUrl = getSitemapUrlForResource(resource);
    let next = resourceEndpoints[resource];
    while (next) {
      try {
        console.log(`Fetching ${resource} from ${next}`);
        const resp = await axios.get(next);
        next = resp.data.next;
        urls.push(...resp.data.results.map(getUrl));
      } catch (e) {
        console.log(`Encountered error ${e}`);
        next = null;
      } 
    }  
  }
  return urls;
}

const generateSitemap = async (resources) => {
  
  console.log('Building Site Sitemap...');

  const resourceUrls = await getUrlsForResources('experiments');
  const staticUrls = ['/about', '/license', '/privacy', '/terms'].map(
    url => ({ url, priority: 0.5 })
  );
  const urls = [...staticUrls, ...resourceUrls];

  console.log(`Generating sitemap index and sitemaps for ${urls.length} urls...`); 
  createSitemapIndex({
    urls,
    targetFolder, 
    hostname,
    cacheTime: 60000,
    sitemapName: 'sitemap',
    sitemapSize: 50000, 
    xslUrl: '',
    gzip: false,
    callback: null,
  }); 
}
generateSitemap();
