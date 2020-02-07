import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import Link from 'next/link';
import { Formik, Field } from 'formik';
import { IoIosWarning } from 'react-icons/io';
import { useRouter } from 'next/router';

import './DataSet.scss';

import { ShareDatasetButton } from '../Downloads/DownloadBar';
import DownloadStart from '../Downloads/DownloadStart/DownloadStart';
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
  // Check if the user arrived here and wants to regenerate the current page.
  // TODO restore regenerate dataset
  // if (location.state && location.state.regenerate) {
  //   return (
  //     <DownloadStart
  //       dataSetId={location.state.dataSetId}
  //       dataSet={location.state.dataSet}
  //     />
  //   );
  // }
  const router = useRouter();
  const { dataSetId } = router.query;

  return (
    <div className="layout__content">
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
                  false // location.state && location.state.email_address
                }
                hasError={false} // location.state && location.state.hasError}
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
    </div>
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
      push({
        pathname: '/download',
        state: {
          message: `Appended ${totalSamples} samples to My Dataset`,
        },
      });
    } else {
      await replaceSamples(dataSet.data);
      push({
        pathname: '/download',
        state: {
          message: `Moved ${totalSamples} samples to My Dataset`,
        },
      });
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
                <Link href="/download" className="link" target="_blank">
                  <a>My Dataset</a>
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
