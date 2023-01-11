const path = require('path');
const withImages = require('next-images');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = () => {
  const isProduction = process.env.VERCEL_GIT_COMMIT_REF === 'master';

  const productionEnv = {
    REACT_APP_API_HOST: process.env.API_HOST,
    GITHUB_URL: process.env.GITHUB_URL,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    HUBSPOT_LIST_ID: process.env.HUBSPOT_LIST_ID,
    HUBSPOT_APIKEY: process.env.HUBSPOT_APIKEY,
    SLACK_HOOK_URL: process.env.SLACK_HOOK_URL,
  };

  const stageEnv = {
    REACT_APP_API_HOST: process.env.STAGE_API_HOST,
    GITHUB_URL: process.env.STAGE_GITHUB_URL,
    GITHUB_TOKEN: process.env.STAGE_GITHUB_TOKEN,
    HUBSPOT_LIST_ID: process.env.STAGE_HUBSPOT_LIST_ID,
    HUBSPOT_APIKEY: process.env.STAGE_HUBSPOT_APIKEY,
    SLACK_HOOK_URL: process.env.STAGE_SLACK_HOOK_URL,
  };

  // env vars can be found on vercel.com
  const env = isProduction ? productionEnv : stageEnv;

  // for tests
  if (process.env.REACT_APP_API_HOST) {
    env.REACT_APP_API_HOST = process.env.REACT_APP_API_HOST;
  }

  const nextConfig = {
    env,
    webpack: (baseConfig, { isServer, dev, webpack }) => {
      const config = { ...baseConfig };
      // add custom webpack config only for the client side in production
      if (!isServer && !dev) {
        // ignore momentjs locales
        config.plugins.push(
          new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
        );

        // lodash is referenced by multiple libraries,
        // this makes sure we only inlcude it once
        config.resolve.alias = {
          ...config.resolve.alias,
          lodash: path.resolve(__dirname, 'node_modules/lodash'),
        };

        config.optimization.splitChunks = {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 3,
            },
            charts: {
              name: 'charts',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](recharts|d3.*)[\\/]/,
              enforce: true,
              priority: 10,
            },
            // Only create one CSS file
            styles: {
              name: `styles`,
              // This should cover all our types of CSS.
              test: /\.(css|scss|sass)$/,
              chunks: `all`,
              enforce: true,
              // this rule trumps all other rules because of the priority.
              priority: 10,
            },
          },
        };
      }
      return config;
    },
  };

  return withImages(withBundleAnalyzer(nextConfig));
};
