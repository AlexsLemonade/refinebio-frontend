import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import { Formik, Field } from 'formik';
import { IoIosWarning } from 'react-icons/io';
import { useRouter } from 'next/router';

import { ShareDatasetButton } from '../download/DownloadBar';
import DownloadStart from '../download/DownloadStart/DownloadStart';
import Spinner from '../../components/Spinner';
import NoMatch from '../../components/NoMatch';
import DataSetLoader from './DataSetLoader';

import DataSetPageHeader from './DataSetPageHeader';
import Button from '../../components/Button';
import ModalManager from '../../components/Modal/ModalManager';
import { getTotalSamplesAdded } from '../../state/download/reducer';
import { addSamples, replaceSamples } from '../../state/download/actions';
import { push } from '../../state/routerActions';

import { RadioField } from '../../components/Radio';
import DatasetDetails from './DatasetDetails';

/**
 * Dataset page, has 3 states that correspond with the states on the backend
 * - Processing: The download file is being created
 * - Processed: The download file is ready
 * - Expired: Download files expire after some time
 * Related discussion https://github.com/AlexsLemonade/refinebio-frontend/issues/27
 */
export default function DataSet() {
  const {
    query: { dataSetId, regenerate, emailAddress, hasError },
  } = useRouter();

  // Check if the user arrived here and wants to regenerate the current page.
  if (regenerate) {
    return <DownloadStart dataSetId={dataSetId} />;
  }

  return (
    <DataSetLoader dataSetId={dataSetId}>
      {({ dataSet, isLoading, hasError: requestHasError }) => {
        if (isLoading) return <Spinner />;
        if (requestHasError) return <NoMatch />;

        return (
          <div>
            <DataSetPageHeader
              dataSet={dataSet}
              emailAddress={emailAddress} // the email is never returned from the api
              hasError={hasError}
            />
            <div className="downloads__bar">
              <div className="flex-row">
                <ShareDatasetButton dataSet={dataSet} />

                <MoveToDatasetButtonModal dataSet={dataSet} />
              </div>
            </div>
            <DatasetDetails dataSet={dataSet} />
          </div>
        );
      }}
    </DataSetLoader>
  );
}

function MoveToDatasetButtonModal({
  dataSet,
  currentDataSet,
  addSamples,
  replaceSamples,
  push,
}) {
  const totalSamples = getTotalSamplesAdded(dataSet.data);
  const totalSamplesinCurrentDataSet = getTotalSamplesAdded(
    currentDataSet.data
  );

  async function modifyCurrentDataSet(append = true) {
    if (append) {
      await addSamples(dataSet.data);
      push(
        {
          pathname: '/download',
          query: {
            message: `Appended ${totalSamples} samples to My Dataset`,
          },
        },
        '/download'
      );
    } else {
      await replaceSamples(dataSet.data);
      push(
        {
          pathname: '/download',
          query: {
            message: `Moved ${totalSamples} samples to My Dataset`,
          },
        },
        '/download'
      );
    }
  }

  return (
    <ModalManager
      component={showModal => (
        <Button
          text="Move to Dataset"
          buttonStyle="secondary"
          onClick={() => {
            if (totalSamplesinCurrentDataSet > 0) {
              showModal();
            } else {
              // no need to show modal dialog if the current dataset is empty
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
            modifyCurrentDataSet(!!append);
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
                There are {totalSamplesinCurrentDataSet} samples in{' '}
                <Link href="/download" as="/download">
                  <a className="link" target="_blank">
                    My Dataset
                  </a>
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
    push,
  }
)(MoveToDatasetButtonModal);
