import React from 'react';
import Helmet from 'react-helmet';
import moment from 'moment';
import { getAmazonDownloadLinkUrl, formatBytes } from '../../../common/helpers';
import DownloadImage from './download-dataset.svg';
import DownloadExpiredImage from './download-expired-dataset.svg';
import './DataSet.scss';
import Button from '../../../components/Button';
import { connect } from 'react-redux';
import {
  startDownload,
  regenerateDataSet
} from '../../../state/download/actions';
import { createToken } from '../../../state/token';

import ProcessingGears from './ProcessingGears';

import TermsOfUse from '../../../components/TermsOfUse';
import DownloadDetails from '../DownloadDetails';
import { ShareDatasetButton } from '../DownloadBar';
import DownloadStart from '../DownloadStart/DownloadStart';
import DownloadErrorImage from './dataset-error.svg';
import Spinner from '../../../components/Spinner';
import NoMatch from '../../NoMatch';
import DataSetLoader from './DataSetLoader';

/**
 * Dataset page, has 3 states that correspond with the states on the backend
 * - Processing: The download file is being created
 * - Processed: The download file is ready
 * - Expired: Download files expire after some time
 * Related discussion https://github.com/AlexsLemonade/refinebio-frontend/issues/27
 */
export default function DataSet({
  location,
  match: {
    params: { id: dataSetId }
  }
}) {
  // Check if the user arrived here and wants to regenerate the current page.
  if (location.state && location.state.regenerate) {
    return (
      <DownloadStart
        dataSetId={location.state.dataSetId}
        dataSet={location.state.dataSet}
      />
    );
  }

  return (
    <div>
      <Helmet>
        <title>Dataset - refine.bio</title>
        <meta
          name="description"
          content="Explore and download this custom harmonized childhood cancer transcriptome dataset."
        />
      </Helmet>
      <DataSetLoader dataSetId={dataSetId}>
        {({ dataSet, isLoading, hasError }) => {
          if (isLoading) return <Spinner />;
          if (hasError) return <NoMatch />;

          return (
            <div>
              <DataSetPageHeader
                dataSetId={dataSetId}
                dataSet={dataSet}
                email_address={
                  // the email is never returned from the api, check if it was passed
                  // on the url state on a previous step
                  location.state && location.state.email_address
                }
                hasError={location.state && location.state.hasError}
              />
              <div className="downloads__bar">
                <div className="flex-button-container flex-button-container--left">
                  <ShareDatasetButton dataSetId={dataSetId} />
                </div>
              </div>
              <DownloadDetails
                isImmutable={true}
                isEmbed={true}
                {...dataSet}
                dataSet={dataSet.data}
              />
            </div>
          );
        }}
      </DataSetLoader>
    </div>
  );
}

/**
 * Renders the header of the dataset page
 */
function DataSetPageHeader({ dataSetId, email_address, hasError, dataSet }) {
  const {
    is_processed,
    is_processing,
    is_available,
    expires_on,
    success
  } = dataSet;

  // success can sometimes be `null`
  const processingError = success === false;

  const isExpired = moment(expires_on).isBefore(Date.now());
  return hasError || processingError ? (
    <DataSetErrorDownloading dataSetId={dataSetId} dataSet={dataSet} />
  ) : is_processed ? (
    is_available && !isExpired ? (
      <DataSetReady dataSet={dataSet} />
    ) : (
      <DataSetExpired />
    )
  ) : is_processing ? (
    <DataSetProcessing email={email_address} dataSetId={dataSetId} />
  ) : (
    <h1 className="downloads__heading">Shared Dataset</h1>
  );
}

let DataSetErrorDownloading = ({
  dataSetId,
  dataSet,
  startDownload,
  token
}) => {
  return (
    <div className="dataset__container">
      <div className="dataset__message">
        <div className="dataset__way-container">
          <div className="dataset__processed-text">
            <h1>Uh-oh something went wrong!</h1>
            <p>
              We encountered a problem while getting your dataset ready. We
              apologize for the inconvenience.
            </p>
            <p>
              Please contact{' '}
              <a href="mailto:ccdl@alexslemonade.org" className="link">
                ccdl@alexslemonade.org
              </a>
              {dataSet.failure_reason && (
                <span>
                  {' '}
                  or{' '}
                  <a
                    href="https://github.com/AlexsLemonade/refinebio/issues/new"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="link"
                  >
                    file a ticket on Github
                  </a>{' '}
                  with the following error message.
                </span>
              )}
            </p>

            {dataSet.failure_reason && (
              <div className="dataset__failure-reason">
                {dataSet.failure_reason}
              </div>
            )}
          </div>

          <div className="dataset__way-image">
            <img src={DownloadErrorImage} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};
DataSetErrorDownloading = connect(
  ({ token }) => ({ token }),
  {
    startDownload
  }
)(DataSetErrorDownloading);

function DataSetProcessing({ email, dataSetId }) {
  let message = !!email ? (
    <p>
      An email with a download link will be sent to <strong>{email}</strong>{' '}
      when the dataset is ready or you can come back to this page later.
    </p>
  ) : (
    <p>
      This can take several minutes. Check back in later to download the data.
    </p>
  );

  return (
    <div className="dataset__container">
      <div className="dataset__message">
        <div className="dataset__way-container">
          <div className="dataset__processed-text">
            <h1>Your dataset is being processed.</h1>
            {message}
          </div>
          <div className="dataset__way-image">
            <ProcessingGears />
          </div>
        </div>
      </div>
    </div>
  );
}

class DataSetReady extends React.Component {
  state = {
    agreedToTerms: false
  };

  handleAgreedToTerms = () => {
    this.setState({ agreedToTerms: !this.state.agreedToTerms });
  };

  handleSubmit = async () => {
    if (!this.props.hasToken) {
      await this.props.createToken();
    }

    const { s3_bucket, s3_key } = this.props.dataSet;
    const downloadLink = getAmazonDownloadLinkUrl(s3_bucket, s3_key);
    window.location.href = downloadLink;
  };

  render() {
    return (
      <div className="dataset__container">
        <div className="dataset__message">
          <div className="dataset__way-container">
            <div className="dataset__processed-text">
              <h1>Your dataset is ready for download!</h1>

              {!!this.props.dataSet.size_in_bytes && (
                <div className="mb-1">
                  Download size: {formatBytes(this.props.dataSet.size_in_bytes)}
                </div>
              )}

              <div className="dataset__way-container">
                {!this.props.hasToken && (
                  <TermsOfUse
                    agreedToTerms={this.state.agreedToTerms}
                    handleToggle={this.handleAgreedToTerms}
                  />
                )}

                <Button
                  onClick={this.handleSubmit}
                  isDisabled={!this.state.agreedToTerms && !this.props.hasToken}
                >
                  Download Now
                </Button>
              </div>
            </div>

            <div className="dataset__way-image">
              <img src={DownloadImage} alt="" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
DataSetReady = connect(
  ({ token }) => ({ hasToken: !!token }),
  {
    startDownload,
    createToken
  }
)(DataSetReady);

let DataSetExpired = ({ regenerateDataSet }) => (
  <div className="dataset__container">
    <div className="dataset__message">
      <div className="dataset__way-container">
        <div className="dataset__processed-text">
          <h1 className="dataset__way-title">Download Expired! </h1>
          <div className="dataset__way-subtitle">
            The download files for this dataset isn’t available anymore
          </div>
          <div className="dataset__way-container">
            <Button onClick={regenerateDataSet}>Regenerate Files</Button>
          </div>
        </div>

        <div className="dataset__way-image">
          <img src={DownloadExpiredImage} alt="" />
        </div>
      </div>
    </div>
  </div>
);
DataSetExpired = connect(
  null,
  {
    regenerateDataSet
  }
)(DataSetExpired);
