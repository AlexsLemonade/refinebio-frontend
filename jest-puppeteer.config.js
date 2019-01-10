const PORT = 14568;

module.exports = {
  launch: {
    headless: process.env.CI === 'true'
  },
  browserContext: process.env.INCOGNITO ? 'incognito' : 'default',
  server: {
    // run the tests against the production API
    command: `REACT_APP_API_HOST=https://api.refine.bio BROWSER=none PORT=${PORT} yarn start`,
    port: PORT,
    launchTimeout: 10000
  }
};
