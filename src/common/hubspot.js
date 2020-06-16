/**
 * This file contains helper methods that update the hubspot list
 */

// Testing stuff right now, so this all goes to a test HubSpot list

// const PORTAL_ID = "7917739";
const LIST_ID = '1';
// const FORM_ID = "9595af37-41d3-4df7-ab8a-dd07aae1acf7"
// ea84e96a-15f2-4bc7-8240-7ae27223b4ef test form 2

const HUBSPOT_LIST_URL = `https://api.hubapi.com/contacts/v1/lists/${LIST_ID}`;
// const HUBSPOT_FORM_URL = 'https://api.hsforms.com/submissions/v3/integration';
// const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;
const HAPIKEY = '8b29bb28-7ae7-4815-9975-2c05d0326b74'; // using personal api key for now will delete later
const PROXY_URL = 'https://cors-anywhere.herokuapp.com/'; // idk if this is the best way to do this but this fixes the problem with CORS

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

// Creates a new contact
export async function createContact(params) {
  let newContact;
  await fetch(
    `${PROXY_URL}https://api.hubapi.com/contacts/v1/contact/?hapikey=${HAPIKEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }
  )
    .then(response => response.json())
    .then(data => {
      newContact = data;
    });
  return newContact;
}

// Adds a contact to the contact list
export async function addToContactList(params) {
  return fetch(`${PROXY_URL + HUBSPOT_LIST_URL}/add?hapikey=${HAPIKEY}`, {
    method: 'POST',
    headers: {
      // Authorization: `Bearer ${HUBSPOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}

// Gets all contacts from the contact list
export async function getContactList() {
  let contacts;
  await fetch(
    `${PROXY_URL + HUBSPOT_LIST_URL}/contacts/all?hapikey=${HAPIKEY}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then(response => response.json())
    .then(data => {
      contacts = data;
    });
  return contacts;
}

/*
// Submits data to specified form
export async function submitFormData(params) {
    const form_url = HUBSPOT_FORM_URL+"/submit/"+PORTAL_ID+"/"+FORM_ID;
    console.log(form_url);
    return fetch(form_url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    });
}
*/

// Might want to move this code into same file as github.js since they should be ran together anyway?
export async function submitExperimentDataRequestHubspot(
  accessionCode,
  values
) {
  const ip = await getIP();

  // First check if the contact is already on the list
  // const contacts = await getContactList();

  // Create a new contact
  await createContact({
    properties: [
      {
        property: 'email',
        value: values.email,
      },
      {
        property: 'dataset_request_details',
        value: `Requested experiment ${accessionCode}
                    \r\nPediatric cancer research: ${
                      values.pediatric_cancer_research
                    }
                    \r\nPrimary approach: ${values.approach}
                    \r\nAdditional notes: ${values.comments}
                    \r\n${
                      values.email_updates
                        ? '(Wants email updates)'
                        : '(Does not want email updates)'
                    }
                    \r\nIP: ${ip}
                    `,
      },
    ],
  });

  // Add that contact to the list
  await addToContactList({
    emails: [values.email],
  });

  /*
  await submitFormData({
        fields: [
            {
                name: 'pediatric_cancer',
                value: values.pediatric_cancer,
            },
            {
                name: 'primary_approach',
                value: values.approach,
            },
            {
                name: 'email',
                value: values.email,
            },
            {
                name: 'email_updates',
                value: values.email_updates ? "true" : "false",
            },
            {
                name: 'comments',
                value: values.comments,
            },
        ],
        context: {
            ipAddress: toString(ip),
        }
    });
    */
}
