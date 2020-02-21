const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withImages = require('next-images');

const ApiHost = process.env.REACT_APP_API_HOST || 'https://api.refine.bio';

module.exports = withImages(
  withSass({
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
);
