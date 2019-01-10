module.exports = {
  launch: {
    headless: process.env.CI === 'true'
  },
  browserContext: process.env.INCOGNITO ? 'incognito' : 'default',
  server: {
    command: `BROWSER=none yarn start`,
    port: 3000,
    launchTimeout: 10000
  }
};
