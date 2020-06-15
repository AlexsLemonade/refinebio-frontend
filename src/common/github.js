/**
 * This file contains helper methods that create new GitHub requests
 */

const GITHUB_URL = 'https://api.github.com/repos/BEW111/testrepo/issues';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

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

export async function submitExperimentDataRequest(accessionCode) {
  await createIssue({
    title: `Dataset Request ${accessionCode}`,
    body: `### Context\r\n\r\nA user requested [${accessionCode}](https://www.refine.bio/experiments/${accessionCode})`,
    labels: [
      {
        name: 'dataset request',
      },
    ],
  });
}
