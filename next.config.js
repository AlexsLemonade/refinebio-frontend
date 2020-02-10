const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withImages = require('next-images');

module.exports = withImages(
  withSass(
    withCSS({
      env: {
        REACT_APP_API_HOST: process.env.REACT_APP_API_HOST,
      },
    })
  )
);
