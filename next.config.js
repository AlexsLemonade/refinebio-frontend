const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withImages = require('next-images');

module.exports = withImages(
  withCSS(
    withSass({
      env: {
        REACT_APP_API_HOST: process.env.REACT_APP_API_HOST,
      },
    })
  )
);
