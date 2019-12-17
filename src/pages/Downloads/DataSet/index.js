import React from 'react';
import Helmet from 'react-helmet';
import './DataSet.scss';

import DownloadDetails from '../DownloadDetails';
import { ShareDatasetButton } from '../DownloadBar';
import DownloadStart from '../DownloadStart/DownloadStart';
import Spinner from '../../../components/Spinner';
import NoMatch from '../../NoMatch';
import DataSetLoader from './DataSetLoader';

import DataSetPageHeader from './DataSetPageHeader';

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
              <DownloadDetails isImmutable isEmbed dataSet={dataSet} />
            </div>
          );
        }}
      </DataSetLoader>
    </div>
  );
}
