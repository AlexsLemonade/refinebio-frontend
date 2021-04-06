// docs: https://jestjs.io/docs/puppeteer
const { page } = global;

const TIMEOUT = 60000;
const BASE_URL = 'http://localhost:14568';

describe('refine.bio integration tests', () => {
  it(
    'landing page loads',
    async () => {
      const homePage = page;
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
      const downloadPage = page;
      await downloadPage.goto(`${BASE_URL}/download`);
      await expect(page).toMatch('Your dataset is empty');
    },
    TIMEOUT
  );

  it(
    'search for osteosarcoma and navigate to first result',
    async () => {
      const searchPage = page;
      // open landing page
      await searchPage.goto(BASE_URL);

      // search for osteosarcoma
      await expect(searchPage).toFill(
        'input.search-input__textbox',
        'osteosarcoma'
      );

      await expect(searchPage).toClick('button.search-input__button');

      // wait for results to appear
      await searchPage.waitForSelector('.results__list');

      // check that some results are being displayed
      await expect(searchPage).toMatch(/of \d* results/gi);

      // navigate to first result
      await expect(searchPage).toClick('.result:nth-child(1) a');
      await searchPage.waitForSelector('.experiment');

      await expect(searchPage).toMatch('Submitter Supplied Information');
    },
    TIMEOUT
  );
});
