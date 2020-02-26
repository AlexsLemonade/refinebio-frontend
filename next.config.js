const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withImages = require('next-images');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const ApiHost = process.env.REACT_APP_API_HOST || 'https://api.refine.bio';

module.exports = withImages(
  withSass(
    withBundleAnalyzer({
      target: 'serverless',
      env: {
        REACT_APP_API_HOST: ApiHost,
      },
      // webpack: (config, { dev, webpack }) => {
      //   if (!dev) {
      //     config.plugins.push(new webpack.optimize.UglifyJsPlugin());
      //   }
      //   return config;
      // },
    })
  )
);
