/**
 * This file contains helper methods that update the hubspot list
 */

// ID for HubSpot list that contacts should be added to (currently goes to a test list)
const LIST_ID = '1';
const HUBSPOT_LIST_URL = `https://api.hubapi.com/contacts/v1/lists/${LIST_ID}`;

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
  // console.log(`Attempting to create new contact`);

  return fetch(
    `${PROXY_URL}https://api.hubapi.com/contacts/v1/contact/?hapikey=${HAPIKEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }
  );
}

// Adds a contact to the contact list
export async function addToContactList(params) {
  // console.log(`Adding contact to list`);

  return fetch(`${PROXY_URL + HUBSPOT_LIST_URL}/add?hapikey=${HAPIKEY}`, {
    method: 'POST',
    headers: {
      // Authorization: `Bearer ${HUBSPOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}

// Get a single contact by email
export async function getContact(email) {
  // console.log(`Getting contact details`);

  let datasetRequestDetails;
  await fetch(
    `${PROXY_URL}https://api.hubapi.com/contacts/v1/contact/email/${email}/profile?hapikey=${HAPIKEY}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then(response => response.json())
    .then(data => {
      if (datasetRequestDetails !== undefined) {
        datasetRequestDetails = data.properties.dataset_request_details.value;
      }
    });
  return datasetRequestDetails;
}

// Updates a contact by email
export async function updateContact(email, params) {
  await fetch(
    `${PROXY_URL}https://api.hubapi.com/contacts/v1/contact/email/${email}/profile?hapikey=${HAPIKEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }
  );
}

// Might want to move this code into same file as github.js since they should be ran together anyway?
export async function submitExperimentDataRequestHubspot(
  accessionCode,
  values
) {
  const ip = await getIP();
  let newDetails = `Requested experiment ${accessionCode}\nPediatric cancer research: ${
    values.pediatric_cancer
  }\nPrimary approach: ${values.approach}\nAdditional notes: ${
    values.comments
  }\n${
    values.email_updates
      ? '(Wants email updates)'
      : '(Does not want email updates)'
  }\nIP: ${ip}`;

  // Attempt to create a new contact
  const response = await createContact({
    properties: [
      {
        property: 'email',
        value: values.email,
      },
      {
        property: 'dataset_request_details',
        value: newDetails,
      },
    ],
  });

  // If there is a conflict in creating the contact, then instead update that existing contact
  if (response.status === 409) {
    // console.log(`Contact ${values.email} already exists`);

    // Get existing Dataset Request Details field from this contact
    const oldDatasetRequestDetails = await getContact(values.email);

    // If the existing contact already has this field filled in, then the new request details should be appended to the old data in the field
    if (oldDatasetRequestDetails !== undefined) {
      newDetails = `${oldDatasetRequestDetails}\n----------\n${newDetails}`;
    }

    // Update that contact with the new information
    await updateContact(values.email, {
      properties: [
        {
          property: 'dataset_request_details',
          value: newDetails,
        },
      ],
    });
  }

  // Add that contact to the list
  await addToContactList({
    emails: [values.email],
  });
}
