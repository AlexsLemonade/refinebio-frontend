import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import moment from 'moment';
import { formatBytes } from '../../../common/helpers';
import DownloadImage from './download-dataset.svg';
import DownloadExpiredImage from './download-expired-dataset.svg';
import './DataSet.scss';
import Button from '../../../components/Button';
import {
  startDownload,
  regenerateDataSet,
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
import { getDataSet } from '../../../api/dataSet';
import TubeyAdventureImage from './tubey-adventure.svg';

import apiData from '../../../apiData.json';
import InfoIcon from '../../../common/icons/info-badge.svg';

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
    params: { id: dataSetId },
  },
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
        <meta name="robots" content="noindex, nofollow" />
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
                isImmutable
                isEmbed
                {...dataSet}
                dataSet={dataSet.data}
                dataSetId={dataSetId}
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
    success,
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
      <DataSetExpired dataSet={dataSet} />
    )
  ) : is_processing ? (
    <DataSetProcessing email={email_address} dataSetId={dataSetId} />
  ) : (
    <h1 className="downloads__heading">Shared Dataset</h1>
  );
}

const DataSetErrorDownloading = ({ dataSet }) => {
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
                  with the following error message for further assistance.
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

function DataSetProcessing({ email }) {
  const message = email ? (
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
    <>
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
      <DataSetNextSteps />
    </>
  );
}

class DataSetReady extends React.Component {
  state = {
    agreedToTerms: false,
  };

  handleAgreedToTerms = () => {
    this.setState(state => ({ agreedToTerms: !state.agreedToTerms }));
  };

  handleSubmit = async () => {
    if (!this.props.hasToken) {
      // if the current user doesn't has a valid token, we have to generate it
      // and request the dataset data again to get the `download_url`
      const token = await this.props.createToken();
      const dataSet = await getDataSet(this.props.dataSet.id, token);
      window.location.href = dataSet.download_url;
    } else {
      // otherwise we should have gotten the download url when the original
      // data was requested
      window.location.href = this.props.dataSet.download_url;
    }
  };

  render() {
    return (
      <>
        <div className="dataset__container">
          <div className="dataset__message">
            <div className="dataset__way-container">
              <div className="dataset__processed-text">
                <h1>Your dataset is ready for download!</h1>

                {!!this.props.dataSet.size_in_bytes && (
                  <div className="mb-1">
                    Download size:{' '}
                    {formatBytes(this.props.dataSet.size_in_bytes)}
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
                    isDisabled={
                      !this.state.agreedToTerms && !this.props.hasToken
                    }
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
        <DataSetNextSteps />
      </>
    );
  }
}
DataSetReady = connect(
  ({ token }) => ({ hasToken: !!token }),
  {
    startDownload,
    createToken,
  }
)(DataSetReady);

/**
 * Returns true if there's a difference between the two minor versions given
 */
function minorVersionChanged(v1, v2) {
  if (!v1 || !v2) return false;
  const regex = /\.\d+\./gm;
  const v1Match = v1.match(regex);
  const v2Match = v2.match(regex);
  if (!v1Match || !v2Match) return false;
  return v1Match[0] !== v2Match[0];
}

let DataSetExpired = ({ dataSet, regenerateDataSet }) => (
  <div className="dataset__container">
    <div className="dataset__message">
      <div className="dataset__way-container">
        <div className="dataset__processed-text">
          <h1 className="dataset__way-title">Download Expired! </h1>
          <div className="dataset__way-subtitle">
            The download files for this dataset isn’t available anymore
          </div>
          <div className="dataset__way-container">
            <Button onClick={() => regenerateDataSet(dataSet)}>
              Regenerate Files
            </Button>
          </div>
          {minorVersionChanged(apiData.apiVersion, dataSet.worker_version) && (
            <div className="dataset__tip-info info">
              <img className="info__icon" src={InfoIcon} alt="" />
              <span>
                Some expression values may differ.{' '}
                <a
                  href="//docs.refine.bio/en/latest/faq.html#why-are-the-expression-values-different-if-i-regenerate-a-dataset"
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn why
                </a>
              </span>
            </div>
          )}
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
    regenerateDataSet,
  }
)(DataSetExpired);

function DataSetNextSteps() {
  return (
    <div className="dataset__next-steps">
      <img src={TubeyAdventureImage} alt="" />

      <div>
        <h1>Explore what you can do with your refine.bio dataset!</h1>

        <p>
          <a
            href="//docs.refine.bio/en/latest/getting_started.html#getting-started-with-a-refine-bio-dataset"
            className="link"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Get started with your dataset
          </a>
        </p>
        <p>
          <a
            href="https://github.com/AlexsLemonade/refinebio-examples/tree/master/ensembl-id-convert"
            className="link"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Convert ENSEMBL IDs to Gene Symbols
          </a>
        </p>
        <p>
          <a
            href="https://github.com/AlexsLemonade/refinebio-examples/tree/master/differential-expression"
            className="link"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Follow an example differential expression analysis
          </a>
        </p>
        <p>
          <a
            href="//docs.refine.bio/en/latest/index.html"
            className="link"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Learn more about how we source and process data
          </a>
        </p>
      </div>
    </div>
  );
}
