/**
 * This file contains helper methods that create new GitHub requests
 */

const GITHUB_URL = 'https://api.github.com/repos/BEW111/testrepo/issues'; // Change to actual repo once done
const { GITHUB_TOKEN } = process.env;

// Sends an issue to GitHub
export async function createIssue(params) {
  return fetch(GITHUB_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}

export async function submitSearchDataRequest(query, values) {
  return createIssue({
    title: `Dataset Request ${values.accession_codes}`,
    body: `### Context\r\n\r\nA user requested ${
      values.accession_codes
    } for the search term ["${query}"](https://www.refine.bio/search?q=${query})
        \r\n\r\n### Problem or idea\r\n\r\n(Add description of experiment/problem here)
        \r\n\r\n### Solution or next step\r\n\r\n(Add solution/next step here)`,
    labels: [
      {
        name: 'dataset request',
      },
    ],
  });
}

export async function submitExperimentDataRequest(accessionCode) {
  return createIssue({
    title: `Dataset Request ${accessionCode}`,
    body: `### Context\r\n\r\nA user requested [${accessionCode}](https://www.refine.bio/experiments/${accessionCode})
        \r\n\r\n### Problem or idea\r\n\r\n(Add description of experiment/problem here)
        \r\n\r\n### Solution or next step\r\n\r\n(Add solution/next step here)`,
    labels: [
      {
        name: 'dataset request',
      },
    ],
  });
}
