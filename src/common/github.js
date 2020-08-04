/**
 * This file contains helper methods that create new GitHub requests
 */

import fetch from 'isomorphic-unfetch';

// API URL for the issues of the repo, e.g. https://api.github.com/repos/AlexsLemonadeStand/refinebio/issues
const GITHUB_URL = process.env.GITHUB_URL;
// Personal access token (https://github.com/settings/tokens)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Sends an issue to GitHub, returns true/false depending on if the fetch worked
export async function createIssue(params) {
  // fetch will give a different error if the URL is undefined, so check that first
  if (!GITHUB_URL) {
    return false;
  }

  fetch(GITHUB_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });

  return false;
}

export async function submitSearchDataRequest(values) {
  return createIssue({
    title: `Dataset Request ${values.accession_codes}`,
    body: `### Context\r\n\r\nA user requested ${
      values.accession_codes
    } for the search term ["${values.query}"](https://www.refine.bio/search?q=${
      values.query
    })
        \r\n\r\n### Problem or idea\r\n\r\n(Add description of experiment/problem here)
        \r\n\r\n### Solution or next step\r\n\r\n(Add solution/next step here)`,
    labels: [
      {
        name: 'dataset request',
      },
    ],
  });
}

export async function submitExperimentDataRequest(values) {
  return createIssue({
    title: `Dataset Request ${values.accession_codes}`,
    body: `### Context\r\n\r\nA user requested [${
      values.accession_codes
    }](https://www.refine.bio/experiments/${values.accession_codes})
        \r\n\r\n### Problem or idea\r\n\r\n(Add description of experiment/problem here)
        \r\n\r\n### Solution or next step\r\n\r\n(Add solution/next step here)`,
    labels: [
      {
        name: 'dataset request',
      },
    ],
  });
}
