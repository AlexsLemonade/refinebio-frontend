/**
 * This file contains helper methods that update the hubspot list
 */

// ID for HubSpot list that contacts should be added to (currently goes to a test list)
const LIST_ID = '1'; // this is a test list ID, change to actual list ID once done
const { HUBSPOT_APIKEY } = process.env;

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

  // Check if contact exists
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

    // Update that contact with the new information
    await updateContact(email, {
      properties: [
        {
          property: 'dataset_request_details',
          value: details,
        },
      ],
    });
  }

  // Add that contact to the list
  return addToContactList({
    emails: [email],
  });
}

export async function submitSearchDataRequest(query, values) {
  const newDetails = `Requested experiment(s) ${
    values.accession_codes
  } for search term "${query}"\nPediatric cancer research: ${
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

export async function submitExperimentDataRequest(accessionCode, values) {
  const newDetails = `Requested experiment ${accessionCode}\nPediatric cancer research: ${
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
