/*
Payload should be the serialized form of the request
*/

import { submitSearchDataRequest as slackSearchRequest } from '../../../src/common/slack';
import { submitSearchDataRequest as githubSearchRequest } from '../../../src/common/github';
import { submitSearchDataRequest as hubspotSearchRequest } from '../../../src/common/hubspot';

import { submitExperimentDataRequest as slackExperimentRequest } from '../../../src/common/slack';
import { submitExperimentDataRequest as githubExperimentRequest } from '../../../src/common/github';
import { submitExperimentDataRequest as hubspotExperimentRequest } from '../../../src/common/hubspot';

export default async (req, res) => {
  const {
    body: { accessionCode, query, values },
    method,
  } = req
  
  switch (method) {
    case 'POST':
      let githubResponse;
      let hubspotResponse;

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

        res.status(400).json({ message: `${failedRequest} failed` })
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