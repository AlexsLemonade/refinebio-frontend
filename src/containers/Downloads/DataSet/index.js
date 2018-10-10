import React from 'react';
import Helmet from 'react-helmet';
import moment from 'moment';
import { getAmazonDownloadLinkUrl, timeout } from '../../../common/helpers';
import Loader from '../../../components/Loader';
import DownloadImage from './download-dataset.svg';
import DownloadExpiredImage from './download-expired-dataset.svg';
import './DataSet.scss';
import Button from '../../../components/Button';
import { connect } from 'react-redux';
import {
  fetchDataSet,
  regenerateDataSet
} from '../../../state/dataSet/actions';
import { startDownload } from '../../../state/download/actions';
import { createToken } from '../../../state/token';

import ProcessingDataset from '@haiku/dvprasad-processingdataset/react';

import TermsOfUse from '../../../components/TermsOfUse';
import DownloadDetails from '../DownloadDetails';
import { ShareDatasetButton } from '../DownloadBar';
import DownloadStart from '../DownloadStart/DownloadStart';
import DownloadErrorImage from './dataset-error.svg';
import Spinner from '../../../components/Spinner';

/**
 * Dataset page, has 3 states that correspond with the states on the backend
 * - Processing: The download file is being created
 * - Processed: The download file is ready
 * - Expired: Download files expire after some time
 * Related discussion https://github.com/AlexsLemonade/refinebio-frontend/issues/27
 */
class DataSet extends React.Component {
  _liveUpdate = true;

  componentWillUnmount() {
    // disable live updates after the component is unmounted
    this._liveUpdate = false;
  }

  async _fetchDataSet() {
    const {
      fetchDataSet,
      match: {
        params: { id: dataSetId }
      }
    } = this.props;

    await fetchDataSet(dataSetId);

    // start polling the server every 20secs if the dataset is being processed
    if (this.props.dataSet.is_processing) {
      this._startLiveUpdate();
    }
  }

  async _startLiveUpdate() {
    await timeout(20000); // wait 20 secs
    if (this._liveUpdate) {
      this._fetchDataSet();
    }
  }

  render() {
    const {
      dataSet,
      location,
      match: {
        params: { id: dataSetId }
      }
    } = this.props;

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
        <Loader updateProps={dataSetId} fetch={() => this._fetchDataSet()}>
          {({ isLoading }) =>
            isLoading ? (
              <Spinner />
            ) : (
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
                  dataSet={dataSet.data}
                  aggregate_by={dataSet.aggregate_by}
                  scale_by={dataSet.scale_by}
                  experiments={dataSet.experiments}
                  samples={dataSet.samples}
                />
              </div>
            )
          }
        </Loader>
      </div>
    );
  }
}
DataSet = connect(
  ({ dataSet }) => ({ dataSet }),
  {
    fetchDataSet
  }
)(DataSet);
export default DataSet;

/**
 * Renders the header of the dataset page
 */
function DataSetPageHeader({ dataSetId, email_address, hasError, dataSet }) {
  const {
    is_processed,
    is_processing,
    is_available,
    expires_on,
    s3_bucket,
    s3_key
  } = dataSet;

  const isExpired = moment(expires_on).isBefore(Date.now());
  return hasError ? (
    <DataSetErrorDownloading dataSetId={dataSetId} dataSet={dataSet} />
  ) : is_processed ? (
    is_available && !isExpired ? (
      <DataSetReady s3_bucket={s3_bucket} s3_key={s3_key} />
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
            <p>Please try downloading again. </p>
            <p>
              If the problem persists, please contact{' '}
              <a href="mailto:ccdl@alexslemonade.org" className="link">
                ccdl@alexslemonade.org
              </a>
            </p>

            {token && (
              <Button
                onClick={() =>
                  startDownload({
                    tokenId: token,
                    dataSetId,
                    dataSet: dataSet.data
                  })
                }
              >
                Try Again
              </Button>
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
            <ProcessingDataset loop={true} />
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

    const { s3_bucket, s3_key } = this.props;
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
