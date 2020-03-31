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

import { useLocalStorage, useWatchedLocalStorage } from '../common/hooks';
import { getDomain } from '../common/helpers';

// TODO: Rethink how we use email fallback to support designs

// This is the hook used to manage the dataset that is being processed
export const useExperimentDataset = experimentAccessionCode => {
  const [emailAddress] = useLocalStorage('email-address', undefined);

  // this is an empy dataset for the experiment
  const emptyDataset = {
    data: {
      [experimentAccessionCode]: ['ALL'],
    },
    aggregate_by: 'EXPERIMENT',
    quantile_normalize: true,
    scale_by: 'NONE',
    email_address: emailAddress,
    email_ccdl_ok: false,
  };

  const [dataset, setDataset] = React.useState({ ...emptyDataset });

  // save datasetId to localstorage
  const [datasetId, setDatasetId] = useWatchedLocalStorage(
    `dataset-${experimentAccessionCode}`,
    undefined
  );

  const setDatasetToLocalStorage = newDataset => {
    setDataset(newDataset);
    if (newDataset.id) {
      setDatasetId(newDataset.id);
    } else {
      setDatasetId(undefined);
    }
  };

  // check if dataset is being processed
  // if not clean up localstorage
  React.useEffect(() => {
    const refreshState = async () => {
      const refreshedDataset = await getDataSet(dataset.id || datasetId);
      if (refreshedDataset.is_processed) {
        setDatasetToLocalStorage({ ...emptyDataset });
      } else if (!dataset.id) {
        setDatasetToLocalStorage({ ...refreshedDataset });
      }
    };

    // it was started or we have it in localstorage
    if (dataset.is_processing || datasetId) refreshState();
  }, [datasetId, dataset, setDatasetToLocalStorage]);

  return [dataset, setDatasetToLocalStorage];
};

export const DownloadExperiment = ({ experiment, dataset, setDataset }) => {
  const { technology, samples } = experiment;
  const hasRNASeqTechnology = Boolean(technology) && technology === 'RNA-SEQ';
  const hasRNASeqSamples =
    samples && samples.map(s => s.technology).includes('RNA-SEQ');
  const hasMultipleSpecies = experiment.organism_names.length > 1;

  if (dataset.is_processing) return false;

  return (
    <ModalManager
      modalProps={{ className: 'download-experiment-modal', center: true }}
      component={showModal => (
        <button
          type="button"
          onClick={showModal}
          className="dataset-download__button button button--secondary"
        >
          Download Now
        </button>
      )}
    >
      {() => (
        <DatasetDownloadOptionsContent
          hasRNASeq={hasRNASeqTechnology || hasRNASeqSamples}
          hasMultipleSpecies={hasMultipleSpecies}
          dataset={dataset}
          setDataset={setDataset}
        />
      )}
    </ModalManager>
  );
};

const DatasetDownloadOptionsContent = ({
  hasRNASeq,
  hasMultipleSpecies,
  dataset,
  setDataset,
}) => {
  return (
    <div>
      <h1 className="mb-1">Download Options</h1>
      <hr className="mb-2" />
      <DatasetDownloadOptionsForm
        dataset={dataset}
        setDataset={setDataset}
        classPrefix="download-experiment"
        actionText="Start Processing"
        advancedOptions
        startDownload
      >
        <>
          {hasMultipleSpecies && (
            <div className="flex-row mb-2">
              <AggreationOptions />
            </div>
          )}
          <div className="flex-row mb-2">
            <TransformationOptions />
          </div>
          {hasRNASeq && (
            <div className="flex-row mb-2">
              <AdvancedOptions hideTitle />
            </div>
          )}
          <div className="flex-row mb-1">
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

// Show Badge while dataset is processing
export const ProcessingExperiment = ({ dataset }) => {
  const [emailAddress] = useLocalStorage('email-address', undefined);

  return (
    <ModalManager
      modalProps={{ className: 'download-experiment-modal', center: true }}
      component={showModal => (
        <button
          type="button"
          onClick={showModal}
          className="dataset-download__button dot-label dot-label--info"
        >
          Processing Dataset
        </button>
      )}
    >
      {({ hideModal }) => (
        <DatasetProcessingContent
          dataset={dataset}
          hideModal={hideModal}
          emailAddress={emailAddress}
        />
      )}
    </ModalManager>
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
