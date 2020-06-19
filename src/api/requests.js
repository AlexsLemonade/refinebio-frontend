/**
 * Client-side interface for pages/api/experiment-requests
 */

import fetch from 'isomorphic-unfetch';

// Used by both RequestSearchButton and RequestExperimentButton
// requestBody should contain either a search query or accessionCode depending on the button, and the form values as values: {}
export const dataRequest = async requestBody => {
  const response = await fetch(`api/data-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  return response.json();
};
