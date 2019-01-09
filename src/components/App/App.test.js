import React from 'react';
import ReactDOM from 'react-dom';
import App from './index';

import puppeteer from 'puppeteer';

describe('refine.bio integration tests', () => {
  test(
    'landing page loads',
    async () => {
      const { page, close } = await loadPage('http://localhost:3000/');

      await page.waitForSelector('.app-wrap');

      close();
    },
    9000000
  );

  test(
    'search for samples',
    async () => {
      const { page, close } = await loadPage('http://localhost:3000/');

      await page.waitForSelector('.app-wrap');

      close();
    },
    9000000
  );
});

async function loadPage(url) {
  let browser = await puppeteer.launch({
    headless: true
  });
  let page = await browser.newPage();
  page.emulate({
    viewport: {
      width: 1200,
      height: 800
    },
    userAgent: ''
  });

  await page.goto(url);

  return {
    page,
    close: () => browser.close()
  };
}
