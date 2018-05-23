import React from 'react';
import { asyncFetch } from '../../common/helpers';
import Loader from '../../components/Loader';
import { isAbsolute } from 'upath';
import ProcessingImage from './download-processing.svg';
import NextStepsImage from './download-next-steps.svg';
import './DataSet';

/**
 * Dataset page, has 3 states that correspond with the states on the backend
 * - Processing: The download file is being created
 * - Processed: The download file is ready
 * - Expired: Download files expire after some time
 * Related discussion https://github.com/AlexsLemonade/refinebio-frontend/issues/27
 */
export default class DataSet extends React.Component {
  render() {
    const dataSetId = this.props.match.params.id;

    return (
      <Loader fetch={() => fetchDataSet(dataSetId)}>
        {({ isLoading, data }) =>
          isLoading ? <div className="loader" /> : <DataSetPage {...data} />
        }
      </Loader>
    );
  }
}

/**
 *
 */
function DataSetPage({
  email_address,
  expires_on,
  id,
  is_available,
  is_processed,
  is_processing,
  last_modified,
  s3_bucket,
  s3_key
}) {
  // 1. Check if the dataset is already processed, if true show a link to the download file
  if (is_processed) {
    if (is_available) {
      const downloadLink = getAmazonDownloadLinkUrl(s3_bucket, s3_key);
      return (
        <div>
          <h1>Your dataset is ready</h1>
          Download: <a href={downloadLink}>{downloadLink}</a>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Sorry this download link already expired.</h1>
        </div>
      );
    }
  } else {
    // 2. if it's not ready to be downloaded, then allow the user to set an email and receive an alert when its ready
    if (!email_address) {
      return (
        <div>
          <h1>
            We’re putting your download file together. It usually takes 15- 20
            minutes.
          </h1>
          <h2>
            Enter your email and we will email you when the files are ready for
            download.
          </h2>
          <EmailForm />

          <img src={ProcessingImage} />
        </div>
      );
    } else {
      // 3. Allow the user to change its email if it's already added
      return (
        <div>
          <h1>Your dataset is on the way!</h1>
          <p>We have sent a confirmation email to {email_address}</p>
          <p>If you haven’t recevied it, please check your spam folders.</p>
        </div>
      );
    }
  }
}

function EmailForm({ handleSubmit }) {
  return <form onSubmit={handleSubmit}>file input</form>;
}

/**
 * Fetches data for a given dataset
 * @param {*} id Identifier of the dataset (hash `730ad4b9-f789-48a0-a114-ca3a8c5ab030)
 */
async function fetchDataSet(id) {
  const data = await asyncFetch(`/dataset/${id}/`);
  return data;
}

function getAmazonDownloadLinkUrl(s3_bucket, s3_key) {
  return `https://s3.amazonaws.com/${s3_bucket}/${s3_key}`;
}
