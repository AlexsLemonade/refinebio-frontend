/*
Payload should be accessionCode/query depending on button, and the serialized form of the request
*/

import { submitSearchDataRequest as slackSearchRequest, submitExperimentDataRequest as slackExperimentRequest } from '../../../src/common/slack';
import { submitSearchDataRequest as githubSearchRequest, submitExperimentDataRequest as githubExperimentRequest } from '../../../src/common/github';
import { submitSearchDataRequest as hubspotSearchRequest, submitExperimentDataRequest as hubspotExperimentRequest } from '../../../src/common/hubspot';

export default async (req, res) => {
  const {
    body: { requestValues },
    method,
  } = req
  
  switch (method) {
    case 'POST': {
      let githubOk; let hubspotResponse;

      const response = { status: 204, message: '' };

      if (requestValues.request_type === 'search') {
        githubOk = await githubSearchRequest(requestValues);
        hubspotResponse = await hubspotSearchRequest(requestValues);
      }
      else if (requestValues.request_type === 'experiment') {
        githubOk = await githubExperimentRequest(requestValues);
        hubspotResponse = await hubspotExperimentRequest(requestValues);
      }

      // Send to slack instead if GitHub or HubSpot request failed
      if (!githubOk || !hubspotResponse.ok) {
        let failedRequest;
        if (!githubOk && !hubspotResponse.ok) {
          failedRequest = "GitHub and HubSpot"
        }
        else if (!githubOk) {
          failedRequest = "GitHub"
        }
        else {
          failedRequest = "HubSpot"
        }
        
        if (requestValues.request_type === 'search') {
          slackSearchRequest(requestValues, failedRequest);
        }
        else if (requestValues.request_type === 'experiment') {
          slackExperimentRequest(requestValues, failedRequest);
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