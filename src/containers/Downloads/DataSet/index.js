import React from 'react';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import { getAmazonDownloadLinkUrl } from '../../../common/helpers';
import Loader from '../../../components/Loader';
import NextStepsImage from './download-next-steps.svg';
import DownloadImage from './download-dataset.svg';
import DownloadExpiredImage from './download-expired-dataset.svg';
import './DataSet.scss';
import Button from '../../../components/Button';
import { connect } from 'react-redux';
import {
  fetchDataSet,
  regenerateDataSet
} from '../../../state/dataSet/actions';
import ModalManager from '../../../components/Modal/ModalManager';

import ProcessingDataset from '@haiku/dvprasad-processingdataset/react';

import TermsOfUse from '../../../components/TermsOfUse';
import DownloadDetails from '../DownloadDetails';
import { ShareDatasetButton } from '../DownloadBar';
import DownloadStart from '../DownloadStart/DownloadStart';

/**
 * Dataset page, has 3 states that correspond with the states on the backend
 * - Processing: The download file is being created
 * - Processed: The download file is ready
 * - Expired: Download files expire after some time
 * Related discussion https://github.com/AlexsLemonade/refinebio-frontend/issues/27
 */
let DataSet = ({
  dataSet,
  fetchDataSet,
  location,
  match: {
    params: { id: dataSetId }
  }
}) => {
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
    <Loader updateProps={dataSetId} fetch={() => fetchDataSet(dataSetId)}>
      {({ isLoading }) =>
        isLoading ? (
          <div className="loader" />
        ) : (
          <div>
            {dataSet.is_processing || dataSet.is_processed ? (
              <div className="dataset__container">
                <div className="dataset__message">
                  <DataSetPage
                    dataSetId={dataSetId}
                    {...dataSet}
                    email_address={
                      // the email is never returned from the api, check if it was passed
                      // on the url state on a previous step
                      location.state && location.state.email_address
                    }
                  />
                </div>
              </div>
            ) : (
              <h1 className="downloads__heading">Shared Dataset</h1>
            )}
            <div className="downloads__bar">
              <ShareDatasetButton dataSetId={dataSetId} />
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
  );
};
DataSet = connect(
  ({ dataSet }) => ({ dataSet }),
  {
    fetchDataSet
  }
)(DataSet);
export default DataSet;

function DataSetPage({
  is_processed,
  is_processing,
  is_available,
  email_address,
  dataSetId,
  expires_on,
  s3_bucket,
  s3_key
}) {
  if (is_processed) {
    const isExpired = moment(expires_on).isBefore(Date.now());
    if (is_available && !isExpired) {
      return <DataSetReady s3_bucket={s3_bucket} s3_key={s3_key} />;
    } else {
      return <DataSetExpired />;
    }
  } else if (is_processing) {
    return <DataSetProcessing email={email_address} dataSetId={dataSetId} />;
  } else {
    return null;
  }
}

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
    <div className="dataset__way-container">
      <div className="dataset__processed-text">
        <h1>Your dataset is being processed.</h1>
        {message}
      </div>
      <ProcessingDataset loop={true} />
    </div>
  );
}

class DataSetReady extends React.Component {
  state = {
    agreedToTerms: false,
    hasToken: false
  };

  componentDidMount() {
    const token = localStorage.getItem('refinebio-token');
    if (!!token) {
      this.setState({ hasToken: true });
    }
  }

  handleAgreedToTerms = () => {
    this.setState({ agreedToTerms: !this.state.agreedToTerms });
  };

  handleSubmit = async () => {
    if (!this.state.hasToken) {
      const token = await (await fetch('/token/')).json();
      localStorage.setItem('refinebio-token', token.id);
    }
    const { s3_bucket, s3_key } = this.props;
    const downloadLink = getAmazonDownloadLinkUrl(s3_bucket, s3_key);
    window.location.href = downloadLink;
  };

  render() {
    return (
      <div className="dataset__way-container">
        <div className="dataset__processed-text">
          <h1>Your dataset is ready for download!</h1>
          <div className="dataset__way-container">
            {!this.state.hasToken && (
              <TermsOfUse
                agreedToTerms={this.state.agreedToTerms}
                handleToggle={this.handleAgreedToTerms}
              />
            )}
            <Button
              onClick={this.handleSubmit}
              isDisabled={!this.state.agreedToTerms && !this.state.hasToken}
            >
              Download Now
            </Button>
          </div>
        </div>

        <div className="dataset__way-image">
          <img src={DownloadImage} alt="" />
        </div>
      </div>
    );
  }
}

let DataSetExpired = ({ regenerateDataSet }) => (
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
);
DataSetExpired = connect(
  () => ({}),
  {
    regenerateDataSet
  }
)(DataSetExpired);
