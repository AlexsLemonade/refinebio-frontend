/*
Payload should be accessionCode/query depending on button, and the serialized form of the request
*/

import { submitSearchDataRequest as slackSearchRequest, submitExperimentDataRequest as slackExperimentRequest } from '../../../src/common/slack';
import { submitSearchDataRequest as githubSearchRequest, submitExperimentDataRequest as githubExperimentRequest } from '../../../src/common/github';
import { submitSearchDataRequest as hubspotSearchRequest, submitExperimentDataRequest as hubspotExperimentRequest } from '../../../src/common/hubspot';

export default async (req, res) => {
  const {
    body: { accessionCode, query, values },
    method,
  } = req
  
  switch (method) {
    case 'POST':
      let githubResponse, hubspotResponse;

      // If query exists, then this is a request from RequestSearchButton
      if (query !== undefined) {
        githubResponse = await githubSearchRequest(query, values);
        hubspotResponse = await hubspotSearchRequest(query, values);
      }
      // If accessionCode exists, then this is a request from RequestExperimentButton
      else if (accessionCode !== undefined) {
        githubResponse = await githubExperimentRequest(accessionCode, values);
        hubspotResponse = await hubspotExperimentRequest(accessionCode, values);
      }

      // Send to slack instead if GitHub or HubSpot request failed
      if (!githubResponse.ok || !hubspotResponse.ok) {
        let failedRequest;
        if (!githubResponse.ok && !hubspotResponse.ok) {
          failedRequest = "GitHub and HubSpot"
        }
        else if (!githubRequest.ok) {
          failedRequest = "GitHub"
        }
        else {
          failedRequest = "HubSpot"
        }

        if (query !== undefined) {
            await slackSearchRequest(query, values, failedRequest);
        }
        else if (accessionCode !== undefined) {
            await slackExperimentRequest(query, values, failedRequest);
        }

        res.status(500).json({ message: `${failedRequest} failed` })
      } 
      else {
        res.status(200).json({ message: 'GitHub and HubSpot succeeded' })
      }

      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }

  res.end();
}