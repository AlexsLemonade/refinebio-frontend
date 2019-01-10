const { page, jestPuppeteer } = global;

const TIMEOUT = 60000;

describe('refine.bio integration tests', () => {
  it(
    'landing page loads',
    async () => {
      await page.goto('http://localhost:3000');
      await expect(page).toMatch('Search for harmonized transcriptome data');
    },
    TIMEOUT
  );
});
