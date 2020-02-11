const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withImages = require('next-images');

const ApiHost = process.env.REACT_APP_API_HOST || 'https://api.refine.bio';

module.exports = withImages(
  withSass(
    withCSS({
      env: {
        REACT_APP_API_HOST: ApiHost,
      },
    })
  )
);
