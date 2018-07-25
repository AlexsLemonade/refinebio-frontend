import React from 'react';
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
import downloadsFilesData from './downloadFilesData';
import { formatSentenceCase } from '../../common/helpers';

/**
 * This page is displayed when the user views a download that is different from the one that's
 * being created. All the details about that dataset are fetched from the server and stored sepparately
 * from the download data in the store.
 */
let ViewDownload = ({
  fetchDownload,
  dataSetId,
  isEmbed = false,
  ...props
}) => {
  // Parse the query string
  let queryParam = props.location.search.substring(1).split('=');

  // Use default values in the case of no query params. (There is always at
  // least one object in the array because of how the parser works)
  //
  // In practice, this should never happen.
  let aggregation;
  if (queryParam.length !== 2 || queryParam[0] !== 'aggregation') {
    aggregation = 'Experiment';
  } else {
    aggregation = formatSentenceCase(queryParam[1]);
  }

  return (
    <Loader fetch={fetchDownload}>
      {({ isLoading }) =>
        isLoading ? (
          <div className="loader" />
        ) : (
          <div className="downloads">
            {!isEmbed && (
              <h1 className="downloads__heading">Download Dataset</h1>
            )}
            {!isEmbed && (
              <DownloadBar dataSetId={dataSetId} aggregation={aggregation} />
            )}
            <DownloadDetails isImmutable={true} {...props} />
          </div>
        )
      }
    </Loader>
  );
};
ViewDownload = connect(
  ({ viewDownload: { samples, dataSet, experiments } }, ownProps) => ({
    samples,
    dataSet,
    experiments,
    dataSetId: ownProps.dataSetId || ownProps.match.params.id,
    filesData: downloadsFilesData(dataSet),
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
