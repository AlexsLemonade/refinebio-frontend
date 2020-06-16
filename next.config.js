const path = require('path');
const withImages = require('next-images');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const ApiHost = process.env.REACT_APP_API_HOST || 'https://api.refine.bio';

module.exports = withImages(
  withBundleAnalyzer({
    target: 'serverless',
    env: {
      REACT_APP_API_HOST: ApiHost,
      GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    },
    webpack: (config, { isServer, dev, webpack }) => {
      // add custom webpack config only for the client side in production
      if (!isServer && !dev) {
        // ignore momentjs locales
        config.plugins.push(
          new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
        );

        // lodash is referenced by multiple libraries, this makes sure we only
        // inlcude it once
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
  })
);
