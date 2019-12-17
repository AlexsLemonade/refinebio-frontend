import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Formik, Field } from 'formik';
import { IoIosWarning } from 'react-icons/io';

import './DataSet.scss';

import { SpeciesSamples, ExperimentsView } from '../DownloadDetails';
import { ShareDatasetButton } from '../DownloadBar';
import DownloadStart from '../DownloadStart/DownloadStart';
import Spinner from '../../../components/Spinner';
import NoMatch from '../../NoMatch';
import DataSetLoader from './DataSetLoader';
import DownloadFileSummary from '../DownloadFileSummary';
import DownloadDatasetSummary from '../DownloadDatasetSummary';
import { formatSentenceCase } from '../../../common/helpers';
import { getTransformationOptionFromName } from '../transformation';

import DataSetPageHeader from './DataSetPageHeader';
import TabControl from '../../../components/TabControl';
import Button from '../../../components/Button';
import ModalManager from '../../../components/Modal/ModalManager';
import { getTotalSamplesAdded } from '../../../state/download/reducer';
import { addSamples, replaceSamples } from '../../../state/download/actions';

import { RadioField } from '../../../components/Radio';

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
                dataSet={dataSet}
                emailAddress={
                  // the email is never returned from the api, check if it was passed
                  // on the url state on a previous step
                  location.state && location.state.email_address
                }
                hasError={location.state && location.state.hasError}
              />
              <div className="downloads__bar">
                <div className="flex-row">
                  <ShareDatasetButton dataSetId={dataSetId} />

                  <MoveToDatasetButtonModal dataSet={dataSet} />
                </div>
              </div>
              <DatasetDetails dataSet={dataSet} />
            </div>
          );
        }}
      </DataSetLoader>
    </div>
  );
}

function DatasetDetails({ dataSet }) {
  return (
    <div>
      <h2>Download Files Summary</h2>

      <div>
        <div className="downloads__file-modifier">
          Aggregated by: {formatSentenceCase(dataSet.aggregate_by)}
        </div>
        <div className="downloads__file-modifier">
          Transformation:{' '}
          {formatSentenceCase(
            getTransformationOptionFromName(dataSet.scale_by)
          )}
        </div>
      </div>

      <DownloadFileSummary dataSet={dataSet} />
      <DownloadDatasetSummary dataSet={dataSet} />

      <section className="downloads__section">
        <div className="downloads__sample-header">
          <h2>Samples</h2>
        </div>

        <TabControl tabs={['Species View', 'Experiments View']}>
          <SpeciesSamples dataSet={dataSet} isImmutable />
          <ExperimentsView dataSet={dataSet} isImmutable />
        </TabControl>
      </section>
    </div>
  );
}

function MoveToDatasetButtonModal({
  dataSet,
  currentDataSet,
  addSamples,
  replaceSamples,
}) {
  const totalSamples = getTotalSamplesAdded(currentDataSet.data);

  function modifyCurrentDataSet(append = true) {
    if (append) {
      addSamples(dataSet.data);
    } else {
      replaceSamples(dataSet.data);
    }
  }

  return (
    <ModalManager
      component={showModal => (
        <Button
          text="Move to Dataset"
          buttonStyle="secondary"
          onClick={() => {
            if (totalSamples > 0) {
              showModal();
            } else {
              modifyCurrentDataSet();
            }
          }}
        />
      )}
      modalProps={{ center: true, className: 'modify-dataset-modal' }}
    >
      {({ hideModal }) => (
        <Formik
          initialValues={{ append: true }}
          onSubmit={({ append }) => {
            modifyCurrentDataSet(append);
            hideModal();
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <h2>
                <IoIosWarning
                  style={{
                    fontSize: '160%',
                    color: 'red',
                    verticalAlign: 'bottom',
                    marginRight: 16,
                  }}
                />
                There are {totalSamples} samples in{' '}
                <Link to="/download" className="link" target="_blank">
                  My Dataset
                </Link>
              </h2>

              <fieldset className="modify-dataset-modal__options">
                <Field
                  component={RadioField}
                  name="append"
                  label="Append samples to My Dataset"
                  value
                />
                <Field
                  component={RadioField}
                  name="append"
                  label="Replace samples in My Dataset"
                />
              </fieldset>

              <div className="modify-dataset-modal__actions">
                <Button
                  text="Cancel"
                  buttonStyle="secondary"
                  onClick={hideModal}
                />
                <Button
                  text="Move Samples"
                  type="submit"
                  disabled={isSubmitting}
                />
              </div>
            </form>
          )}
        </Formik>
      )}
    </ModalManager>
  );
}
MoveToDatasetButtonModal = connect(
  ({ download }) => ({
    currentDataSet: download,
  }),
  {
    addSamples,
    replaceSamples,
  }
)(MoveToDatasetButtonModal);
