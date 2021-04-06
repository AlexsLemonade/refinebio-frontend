// jestPuppeteer is in global
const { page, browser } = global;

const TIMEOUT = 60000;
const BASE_URL = 'http://localhost:14568';

describe('refine.bio integration tests', () => {
  it(
    'landing page loads',
    async () => {
      const homePage = await browser.newPage();
      await homePage.goto(BASE_URL);
      await expect(homePage).toMatch(
        'Search for normalized transcriptome data'
      );
    },
    TIMEOUT
  );

  it(
    'downloads page is empty initially',
    async () => {
      const downloadPage = await browser.newPage();
      await downloadPage.goto(`${BASE_URL}/download`);
      await expect(page).toMatch('Your dataset is empty');
    },
    TIMEOUT
  );

  it(
    'search for osteosarcoma and navigate to first result',
    async () => {
      const homePage = await browser.newPage();
      // open landing page
      await homePage.goto(BASE_URL);

      // search for osteosarcoma
      await expect(homePage).toFill(
        'input.search-input__textbox',
        'osteosarcoma'
      );
      await expect(homePage).toClick('button.search-input__button');

      // wait for results to appear
      await homePage.waitForSelector('.results__list');

      // check that some results are being displayed
      await expect(homePage).toMatch(/of \d* results/gi);

      // navigate to first result
      await expect(homePage).toClick('.result:nth-child(1) a');
      await homePage.waitForSelector('.experiment');

      await expect(homePage).toMatch('Submitter Supplied Information');
    },
    TIMEOUT
  );
});
