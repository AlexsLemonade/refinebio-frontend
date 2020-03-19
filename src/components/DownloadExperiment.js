import React from 'react';

import Button from './Button';
import ProcessingGears from './ProcessingGears';
import ModalManager from './Modal/ModalManager';
import {
  DatasetDownloadOptionsForm,
  AggreationOptions,
  TransformationOptions,
  AdvancedOptions,
  EmailAddressOptions,
  SubmitDatasetOptionsForm,
} from './DatasetDownloadOptionsForm';

import { getDataSet } from '../api/dataSet';

import { useLocalStorage } from '../common/hooks';
import { getDomain } from '../common/helpers';

const DownloadExperiment = ({ experiment, showProcessing = false }) => {
  const [emailAddress] = useLocalStorage('email-address');

  const {
    accession_code: experimentAccessionCode,
    num_downloadable_samples: downloadableSamplesCount,
  } = experiment;

  const data = {};
  data[experimentAccessionCode] = experiment.samples.map(s => s.accession_code);

  const emptyDataset = {
    data,
    aggregate_by: 'EXPERIMENT',
    quantile_normalize: true,
    scale_by: 'NONE',
    email_address: undefined,
    email_ccdl_ok: false,
  };

  const [dataset, setDataset] = React.useState(emptyDataset);

  const [processingDataset, setDatasetIsProcessing] = useLocalStorage(
    `dataset-${experiment.accession_code}`,
    false
  );

  // check if dataset is being processed
  // if not clean up localstorage
  React.useEffect(() => {
    const datasetId = dataset.id || processingDataset;
    const refreshState = async () => {
      const refreshedDataset = await getDataSet(datasetId);

      if (refreshedDataset.is_processing) {
        setDataset(refreshedDataset);
        setDatasetIsProcessing(refreshedDataset.id);
      } else {
        setDataset(emptyDataset);
        setDatasetIsProcessing(null);
      }
    };

    const justStarted = dataset.id !== processingDataset;
    const wasProccessing = processingDataset && !dataset.id;

    if (datasetId && (justStarted || wasProccessing)) refreshState();
  }, [dataset, setDataset, processingDataset, setDatasetIsProcessing]);

  // Hide this component
  if (downloadableSamplesCount === 0) return false;
  if (dataset.is_processing && !showProcessing) return false;

  return (
    <ModalManager
      modalProps={{ className: 'download-experiment-modal', center: true }}
      component={showModal =>
        dataset.is_processing ? (
          <button
            type="button"
            onClick={showModal}
            className="dataset-download__button dot-label dot-label--info"
          >
            Processing Dataset
          </button>
        ) : (
          <button
            type="button"
            onClick={showModal}
            className="dataset-download__button button button--secondary"
          >
            Download Now
          </button>
        )
      }
    >
      {({ hideModal }) =>
        dataset.is_processing ? (
          <DatasetProcessingContent
            dataset={dataset}
            hideModal={hideModal}
            emailAddress={emailAddress}
          />
        ) : (
          <DatasetDownloadOptionsContent
            dataset={dataset}
            setDataset={setDataset}
            setDatasetIsProcessing={setDatasetIsProcessing}
          />
        )
      }
    </ModalManager>
  );
};

const DatasetDownloadOptionsContent = ({ dataset, setDataset }) => {
  return (
    <div>
      <h1 className="mb-1">Download Options</h1>
      <hr className="mb-1" />
      <DatasetDownloadOptionsForm
        dataset={dataset}
        setDataset={setDataset}
        classPrefix="download-experiment"
        actionText="Start Processing"
        advancedOptions
        startDownload
      >
        <>
          <div className="flex-row mb-2">
            <AggreationOptions />
          </div>
          <div className="flex-row mb-2">
            <TransformationOptions />
          </div>
          <div className="flex-row mb-2">
            <AdvancedOptions hideTitle />
          </div>
          <div className="flex-row mb-2">
            <p className="emphasis mb-1">
              Putting the download files together takes about 10-20 minutes.
              Enter your email and we will send you the download link once your
              files are ready.
            </p>
            <EmailAddressOptions />
          </div>
          <div className="flex-row">
            <SubmitDatasetOptionsForm />
          </div>
        </>
      </DatasetDownloadOptionsForm>
    </div>
  );
};

const DatasetProcessingContent = ({ dataset, hideModal, emailAddress }) => {
  return (
    <div className="download-experiment__processing">
      <h2>Your dataset is being processed.</h2>
      <p>
        An email with a download link will be sent to{' '}
        <span className="download-experiment__email">
          {dataset.email || emailAddress}
        </span>{' '}
        when the dataset is ready or you can track the status{' '}
        <a
          className="download-experiment__dataset-link"
          href={`${getDomain()}/dataset/${dataset.id}`}
        >
          here
        </a>
        .
      </p>
      <div className="flex-row download-experiment__gears-button">
        <ProcessingGears width={114} height={104} />
        <div className="download-experiment__close-button">
          <Button
            buttonStyle="secondary"
            text="Continue Browsing"
            onClick={hideModal}
          />
        </div>
      </div>
    </div>
  );
};

export default DownloadExperiment;
