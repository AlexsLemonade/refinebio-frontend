/**
 * This file contains helper methods that post to the CCDL slack channel
 */

import fetch from 'isomorphic-unfetch';

const slackHookUrl = process.env.SLACK_HOOK_URL;

// get IP
const getIP = async () => {
  try {
    const resp = await fetch('https://api.ipify.org?format=json');
    const json = await resp.json();
    return json.ip || 'Unknown IP';
  } catch {
    return 'Unknown IP';
  }
};

/**
 * Send data to slack, configured in CCDL channel
 * @param {object} params Slack webhooks params
 * Returns true if the request was successful
 */
export async function postToSlack(params) {
  try {
    const res = await fetch(slackHookUrl, {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function submitSearchDataRequest(values, failedRequest) {
  const ip = await getIP();

  return postToSlack({
    attachments: [
      {
        fallback: `Missing data for search term '${values.query}'`,
        color: '#2eb886',
        title: `Missing data for search term '${values.query}'`,
        title_link: `https://www.refine.bio/search?q=${values.query}`,
        fields: [
          {
            title: 'Accession Codes',
            value: values.accession_codes,
            short: true,
          },
          {
            title: 'Pediatric Cancer Research',
            value: values.pediatric_cancer,
            short: true,
          },
          {
            title: 'Primary Approach',
            value: values.approach,
            short: true,
          },
          {
            title: 'Email',
            value: `${values.email}${
              values.email_updates ? ' _(wants updates)_' : ''
            }`,
            short: false,
          },
          ...(values.comments
            ? [
                {
                  title: 'Additional Notes',
                  value: values.comments,
                  short: false,
                },
              ]
            : []),
        ],
        footer: `Refine.bio | ${ip} | ${values.navigatorUserAgent} | This message was sent because the request to ${failedRequest} failed`,
        footer_icon: 'https://s3.amazonaws.com/refinebio-email/logo-2x.png',
        ts: Date.now() / 1000, // unix time
      },
    ],
  });
}

export async function submitExperimentDataRequest(values, failedRequest) {
  const ip = await getIP();

  return postToSlack({
    attachments: [
      {
        fallback: `${values.accession_codes} Experiment Requested`,
        color: '#2eb886',
        title: `${values.accession_codes} Experiment Requested`,
        title_link: `https://www.refine.bio/experiments/${values.accession_codes}`,
        fields: [
          {
            title: 'Pediatric Cancer Research',
            value: values.pediatric_cancer,
            short: true,
          },
          {
            title: 'Primary Approach',
            value: values.approach,
            short: true,
          },
          {
            title: 'Email',
            value: `${values.email}${
              values.email_updates ? ' _(wants updates)_' : ''
            }`,
            short: false,
          },
          ...(values.comments
            ? [
                {
                  title: 'Additional Notes',
                  value: values.comments,
                  short: false,
                },
              ]
            : []),
        ],
        footer: `Refine.bio | ${ip} | ${values.navigatorUserAgent} | This message was sent because the request to ${failedRequest} failed`,
        footer_icon: 'https://s3.amazonaws.com/refinebio-email/logo-2x.png',
        ts: Date.now() / 1000, // unix time
      },
    ],
  });
}
