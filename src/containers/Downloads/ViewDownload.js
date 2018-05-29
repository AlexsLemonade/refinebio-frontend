import React from 'react';
import Loader from '../../components/Loader';
import { connect } from 'react-redux';
import { fetchDataSetDetailsForView } from '../../state/viewDownload/actions';
import DownloadDetails from './DownloadDetails';
import DownloadBar from './DownloadBar';
import { groupSamplesBySpecies } from '../../state/download/reducer';

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
  ({ viewDownload }, ownProps) => ({
    ...viewDownload,
    dataSetId: ownProps.match.params.id,
    filesData: downloadFilesData,
    species:
      viewDownload.samples && viewDownload.dataSet
        ? groupSamplesBySpecies({
            samples: viewDownload.samples,
            dataSet: viewDownload.dataSet
          })
        : null
  }),
  (dispatch, ownProps) => ({
    fetchDownload: () => {
      const dataSetId = ownProps.match.params.id;
      return dispatch(fetchDataSetDetailsForView(dataSetId));
    }
  })
)(ViewDownload);

export default ViewDownload;

const downloadFilesData = [
  {
    title: '13 Gene Expression Matrices',
    description: '1 file per Aggregation Choice',
    size: '21 MB',
    format: 'csv'
  },
  {
    title: '13 Sample Metadata Files',
    description: '1 file per Experiment',
    size: '26 MB',
    format: 'txt'
  },
  {
    title: '13 Quality Reports',
    description: '1 file per Experiment',
    size: '13 MB',
    format: 'html'
  },
  {
    title: 'Estimated Download Size',
    description: ' ',
    size: '60 MB',
    format: ''
  }
];
