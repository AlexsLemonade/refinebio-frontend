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

/**
 * This page is displayed when the user views a download that is different from the one that's
 * being created. All the details about that dataset are fetched from the server and stored sepparately
 * from the download data in the store.
 */
let ViewDownload = ({ fetchDownload, dataSetId, ...props }) => (
  <Loader fetch={fetchDownload}>
    {({ isLoading }) =>
      isLoading ? (
        <div className="loader" />
      ) : (
        <div className="downloads">
          <h1 className="downloads__heading">Download Dataset</h1>
          <DownloadBar dataSetId={dataSetId} />
          <DownloadDetails {...props} />
        </div>
      )
    }
  </Loader>
);
ViewDownload = connect(
  ({ viewDownload: { samples, dataSet, experiments } }, ownProps) => ({
    samples,
    dataSet,
    experiments,
    dataSetId: ownProps.match.params.id,
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
      dispatch(fetchDataSetDetailsForView(ownProps.match.params.id))
  })
)(ViewDownload);

export default ViewDownload;
