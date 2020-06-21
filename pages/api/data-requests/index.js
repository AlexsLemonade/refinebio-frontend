/*
Payload should be accessionCode/query depending on button, and the serialized form of the request
*/

import { submitSearchDataRequest as slackSearchRequest, submitExperimentDataRequest as slackExperimentRequest } from '../../../src/common/slack';
import { submitSearchDataRequest as githubSearchRequest, submitExperimentDataRequest as githubExperimentRequest } from '../../../src/common/github';
import { submitSearchDataRequest as hubspotSearchRequest, submitExperimentDataRequest as hubspotExperimentRequest } from '../../../src/common/hubspot';

export default async (req, res) => {
  const {
    body: { values },
    method,
  } = req
  
  switch (method) {
    case 'POST': {
      let githubResponse;
      let hubspotResponse;

      const response = { status: 204, message: '' };

      if (values.request_type === 'search') {
        githubResponse = await githubSearchRequest(values);
        hubspotResponse = await hubspotSearchRequest(values);
      }
      else if (values.request_type === 'experiment') {
        githubResponse = await githubExperimentRequest(values);
        hubspotResponse = await hubspotExperimentRequest(values);
      }

      // Send to slack instead if GitHub or HubSpot request failed
      if (!githubResponse.ok || !hubspotResponse.ok) {
        let failedRequest;
        if (!githubResponse.ok && !hubspotResponse.ok) {
          failedRequest = "GitHub and HubSpot"
        }
        else if (!githubResponse.ok) {
          failedRequest = "GitHub"
        }
        else {
          failedRequest = "HubSpot"
        }

        if (query !== undefined) {
            await slackSearchRequest(values, failedRequest);
        }
        else if (accessionCode !== undefined) {
            await slackExperimentRequest(values, failedRequest);
        }

        response.status = 206;
        response.message = `${failedRequest} failed, sent to Slack`;
      } 
      else {
        response.status = 200;
        response.message = 'GitHub and HubSpot succeeded';
      }

      res.status(response.status).json(response);

      break
    }
    default: {
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
    }
  }

  res.end();
}