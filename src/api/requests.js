/**
 * Client-side interface for pages/api/experiment-requests
 */

import fetch from 'isomorphic-unfetch';

// Used by both RequestSearchButton and RequestExperimentButton
// TODO make body just value params not one value which contains params
export const dataRequest = async requestBody => {
  requestBody.requestValues.navigatorUserAgent = navigator.userAgent;

  const response = await fetch(`/api/data-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  return response.json();
};
