/*
Payload should be a set of values including the query/accessionCode and data request type depending on the experiment/search button
When a post request is made here, requests are made to GitHub and HubSpot, and if either of those fail the request is sent to Slack
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
      let githubSuccess; let hubspotSuccess; let slackSuccess;

      const response = { status: 204, message: '' };

      // Success is true or false depending on if the GitHub or HubSpot requests suceeded
      if (requestValues.request_type === 'search') {
        githubSuccess = await githubSearchRequest(requestValues);
        hubspotSuccess = await hubspotSearchRequest(requestValues);
      }
      else if (requestValues.request_type === 'experiment') {
        githubSuccess = await githubExperimentRequest(requestValues);
        hubspotSuccess = await hubspotExperimentRequest(requestValues);
      }

      // Send to slack instead if GitHub or HubSpot request failed
      if (!githubSuccess || !hubspotSuccess) {
        let failedRequest;
        if (!githubSuccess && !hubspotSuccess) {
          failedRequest = "GitHub and HubSpot"
        }
        else if (!githubSuccess) {
          failedRequest = "GitHub"
        }
        else {
          failedRequest = "HubSpot"
        }
        
        if (requestValues.request_type === 'search') {
          slackSuccess = await slackSearchRequest(requestValues, failedRequest);
        }
        else if (requestValues.request_type === 'experiment') {
          slackSuccess = await slackExperimentRequest(requestValues, failedRequest);
        }

        // Check if Slack request succeeded
        if (slackSuccess) {
          response.status = 206;
          response.message = `${failedRequest} failed, sent to Slack instead`;
        }
        // If Slack didn't succeed, set status to 500 because even if GitHub or HubSpot succeeded it won't have all of the info from both
        else {
          response.status = 500;
          response.message = `${failedRequest} failed, sent to Slack but that also failed`;
        }
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