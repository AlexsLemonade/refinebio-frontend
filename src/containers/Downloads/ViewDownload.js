import React from 'react';
import Helmet from 'react-helmet';
import Loader from '../../components/Loader';
import { connect } from 'react-redux';
import { fetchDataSetDetailsForView } from '../../state/viewDownload/actions';
import DownloadDetails from './DownloadDetails';
import { ShareDatasetButton } from './DownloadBar';

/**
 * This page is displayed when the user views a download that is different from the one that's
 * being created. All the details about that dataset are fetched from the server and stored sepparately
 * from the download data in the store.
 */
let ViewDownload = ({
  fetchDownload,
  dataSetId,
  isEmbed = false,
  aggregate_by,
  scale_by,
  ...props
}) => {
  return (
    <Loader fetch={fetchDownload}>
      {({ isLoading }) =>
        isLoading ? (
          <div className="loader" />
        ) : (
          <div className="downloads">
            <Helmet>refine.bio - Shared Dataset</Helmet>
            {!isEmbed && <h1 className="downloads__heading">Shared Dataset</h1>}
            <div className="downloads__bar">
              <ShareDatasetButton dataSetId={dataSetId} />
            </div>
            <DownloadDetails
              isImmutable={true}
              isEmbed={isEmbed}
              aggregate_by={aggregate_by}
              scale_by={scale_by}
              {...props}
            />
          </div>
        )
      }
    </Loader>
  );
};
ViewDownload = connect(
  (
    { viewDownload: { samples, dataSet, experiments, aggregate_by, scale_by } },
    ownProps
  ) => ({
    samples,
    dataSet,
    experiments,
    aggregate_by,
    scale_by,
    dataSetId: ownProps.dataSetId || ownProps.match.params.id
  }),
  (dispatch, ownProps) => ({
    fetchDownload: () =>
      dispatch(
        fetchDataSetDetailsForView(
          ownProps.dataSetId || ownProps.match.params.id
        )
      )
  })
)(ViewDownload);

export default ViewDownload;
