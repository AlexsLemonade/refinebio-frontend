/**
 * This file contains helper methods that update the hubspot list
 */

// ID for HubSpot list that contacts should be added to
// should look like https://app.hubspot.com/contacts/[PORTAL_ID]/lists/[LIST_ID]
// portal ID will depend on the user but is not needed as an env variable (because of api key)
const LIST_ID = process.env.HUBSPOT_LIST_ID;
const HUBSPOT_APIKEY = process.env.HUBSPOT_APIKEY;

export async function createContact(params) {
  return fetch(
    `https://api.hubapi.com/contacts/v1/contact/?hapikey=${HUBSPOT_APIKEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }
  );
}

export async function addToContactList(params) {
  return fetch(
    `https://api.hubapi.com/contacts/v1/lists/${LIST_ID}/add?hapikey=${HUBSPOT_APIKEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }
  );
}

export async function getContact(email) {
  let datasetRequestDetails;
  let status;

  await fetch(
    `https://api.hubapi.com/contacts/v1/contact/email/${email}/profile?hapikey=${HUBSPOT_APIKEY}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then(response => {
      status = response.status;
      return response.json();
    })
    .then(data => {
      if (data.status !== 'error') {
        if (data.properties.dataset_request_details) {
          datasetRequestDetails = data.properties.dataset_request_details.value;
        }
      }
    });
  return {
    status,
    datasetRequestDetails,
  };
}

export async function updateContact(email, params) {
  await fetch(
    `https://api.hubapi.com/contacts/v1/contact/email/${email}/profile?hapikey=${HUBSPOT_APIKEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }
  );
}

// Checks if a contact exists and updates if so, if not then creates a new contact, and then adds that contact to the list
export async function updateContactList(email, newDetails) {
  let details = newDetails;

  const contactData = await getContact(email);

  // Create a new contact email isn't found
  if (contactData.status === 404) {
    await createContact({
      properties: [
        {
          property: 'email',
          value: email,
        },
        {
          property: 'dataset_request_details',
          value: newDetails,
        },
      ],
    });
  }
  // Update existing contact otherwise
  else {
    const oldDatasetRequestDetails = contactData.datasetRequestDetails;

    // If the existing contact already has this field filled in, then the new request details should be appended to the old data in the field
    if (oldDatasetRequestDetails !== undefined) {
      details = `${newDetails}\n----------\n${oldDatasetRequestDetails}`;
    }

    await updateContact(email, {
      properties: [
        {
          property: 'dataset_request_details',
          value: details,
        },
      ],
    });
  }

  return addToContactList({
    emails: [email],
  });
}

export async function submitSearchDataRequest(values) {
  const newDetails = `Requested experiment(s) ${
    values.accession_codes
  } for search term "${values.query}"\nPediatric cancer research: ${
    values.pediatric_cancer
  }\nPrimary approach: ${values.approach}\n\nAdditional Notes:\n${
    values.comments
  }\n\n${
    values.email_updates
      ? '(Wants email updates)'
      : '(Does not want email updates)'
  }\nSubmitted ${new Date().toLocaleString()}`;

  return updateContactList(values.email, newDetails);
}

export async function submitExperimentDataRequest(values) {
  const newDetails = `Requested experiment ${
    values.accession_codes
  }\nPediatric cancer research: ${values.pediatric_cancer}\nPrimary approach: ${
    values.approach
  }\n\nAdditional Notes:\n${values.comments}\n\n${
    values.email_updates
      ? '(Wants email updates)'
      : '(Does not want email updates)'
  }\nSubmitted ${new Date().toLocaleString()}`;

  return updateContactList(values.email, newDetails);
}
