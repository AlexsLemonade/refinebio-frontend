const { page, jestPuppeteer } = global;

const TIMEOUT = 60000;
const BASE_URL = 'http://localhost:14568';

describe('refine.bio integration tests', () => {
  it(
    'landing page loads',
    async () => {
      await page.goto(BASE_URL);
      await expect(page).toMatch('Search for normalized transcriptome data');
    },
    TIMEOUT
  );

  it(
    'downloads page is empty initially',
    async () => {
      await page.goto(BASE_URL + '/download');
      await expect(page).toMatch('Your dataset is empty');
    },
    TIMEOUT
  );

  it(
    'search for osteosarcoma and navigate to first result',
    async () => {
      const page = await browser.newPage();
      // open landing page
      await page.goto(BASE_URL);

      // search for osteosarcoma
      await expect(page).toFill('input.search-input__textbox', 'osteosarcoma');
      await expect(page).toClick('button.search-input__button');

      // wait for results to appear
      await page.waitForSelector('.results__list');

      // check that some results are being displayed
      await expect(page).toMatch(/of \d* results/gi);

      // navigate to first result
      await expect(page).toClick('.result:nth-child(1) a');
      await page.waitForSelector('.experiment');

      await expect(page).toMatch('Submitter Supplied Information');
    },
    TIMEOUT
  );
});
