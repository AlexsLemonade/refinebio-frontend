import React from 'react';
import Helmet from 'react-helmet';
import Loader from '../../components/Loader';
import { connect } from 'react-redux';
import { fetchDataSetDetailsForView } from '../../state/viewDownload/actions';
import DownloadDetails from './DownloadDetails';
import DownloadBar from './DownloadBar';
import {
  groupSamplesBySpecies,
  getTotalSamplesAdded,
  getExperimentCountBySpecies,
  getTotalExperimentsAdded
} from '../../state/download/reducer';
import { formatSentenceCase } from '../../common/helpers';
import { getTransformationOptionFromName } from './transformation';

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
            {!isEmbed && (
              <DownloadBar
                dataSetId={dataSetId}
                aggregation={formatSentenceCase(aggregate_by)}
                transformation={getTransformationOptionFromName(
                  formatSentenceCase(scale_by)
                )}
              />
            )}
            <DownloadDetails
              isImmutable={true}
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
    dataSetId: ownProps.dataSetId || ownProps.match.params.id,
    samplesBySpecies:
      samples && dataSet
        ? groupSamplesBySpecies({
            samples: samples,
            dataSet: dataSet
          })
        : null,
    totalSamples: getTotalSamplesAdded({ dataSet }),
    totalExperiments: getTotalExperimentsAdded({ dataSet }),
    experimentCountBySpecies: getExperimentCountBySpecies({
      experiments,
      dataSet
    })
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
