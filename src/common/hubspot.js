/**
 * This file contains helper methods that update the hubspot list
 */

import fetch from 'isomorphic-unfetch';

// ID for HubSpot list that contacts should be added to
// should look like https://app.hubspot.com/contacts/[PORTAL_ID]/lists/[listId]
// portal ID will depend on the user but is not needed as an env variable (because of api key)

const listId = process.env.HUBSPOT_LIST_ID;
const hubspotApiKey = process.env.HUBSPOT_APIKEY;

export const createContact = async params =>
  fetch(
    `https://api.hubapi.com/contacts/v1/contact/?hapikey=${hubspotApiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }
  );

export const addToContactList = async params =>
  fetch(
    `https://api.hubapi.com/contacts/v1/lists/${listId}/add?hapikey=${hubspotApiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }
  );

export const getContact = async email => {
  const response = await fetch(
    `https://api.hubapi.com/contacts/v1/contact/email/${email}/profile?hapikey=${hubspotApiKey}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const { status } = response;
  const data = await response.json();

  if (data.status !== 'error' && data.properties.dataset_request_details) {
    return {
      status,
      datasetRequestDetails: data.properties.dataset_request_details.value,
    };
  }

  return { status };
};

export async function updateContact(email, params) {
  await fetch(
    `https://api.hubapi.com/contacts/v1/contact/email/${email}/profile?hapikey=${hubspotApiKey}`,
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

  const res = await addToContactList({
    emails: [email],
  });
  return res.ok;
}

// Return false if there are any errors with updating the contact list
export async function submitSearchDataRequest(values) {
  const newDetails = `Requested experiment(s) ${
    values.accession_codes
  } for search term "${values.query}"\nPediatric cancer research: ${
    values.pediatric_cancer
  }\nPrimary approach: ${values.approach}\n\nAdditional Notes:\n${
    values.comments ? values.comments : 'none'
  }\n\n${
    values.email_updates
      ? '(Wants email updates)'
      : '(Does not want email updates)'
  }\nSubmitted ${new Date().toLocaleString()}`;

  try {
    // This will try to update the contact list, and returns whether or not that response was successful
    return updateContactList(values.email, newDetails);
  } catch {
    return false;
  }
}

// Return false if there are any errors with updating the contact list
export async function submitExperimentDataRequest(values) {
  const newDetails = `Requested experiment ${
    values.accession_codes
  }\nPediatric cancer research: ${values.pediatric_cancer}\nPrimary approach: ${
    values.approach
  }\n\nAdditional Notes:\n${values.comments ? values.comments : 'none'}\n\n${
    values.email_updates
      ? '(Wants email updates)'
      : '(Does not want email updates)'
  }\nSubmitted ${new Date().toLocaleString()}`;

  try {
    // This will try to update the contact list, and returns whether or not that response was successful
    return updateContactList(values.email, newDetails);
  } catch {
    return false;
  }
}
