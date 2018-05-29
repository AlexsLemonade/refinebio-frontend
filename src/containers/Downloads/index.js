import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import Toggle from '../../components/Toggle';
import AccessionIcon from '../../common/icons/accession.svg';
import SampleIcon from '../../common/icons/sample.svg';
import OrganismIcon from '../../common/icons/organism.svg';

import {
  removeExperiment,
  removeSpecies,
  fetchDataSetDetails
} from '../../state/download/actions';
import { groupSamplesBySpecies } from '../../state/download/reducer';

import DownloadBar from './DownloadBar';
import DownloadFileSummary from './DownloadFileSummary';
import DownloadDatasetSummary from './DownloadDatasetSummary';
import DownloadDetails from './DownloadDetails';
import './Downloads.scss';

class Download extends Component {
  componentDidMount() {
    const { dataSet, dataSetId, fetchDataSetDetails } = this.props;
    if (dataSetId) fetchDataSetDetails(dataSet);
  }

  componentDidUpdate() {
    const {
      dataSet,
      dataSetId,
      areDetailsFetched,
      fetchDataSetDetails,
      isLoading
    } = this.props;

    if (dataSetId && !areDetailsFetched && !isLoading) {
      fetchDataSetDetails(dataSet);
    }
  }

  render() {
    const { isLoading, areDetailsFetched } = this.props;

    return (
      <div className="downloads">
        <h1 className="downloads__heading">Download Dataset</h1>
        <DownloadBar />

        {isLoading && !areDetailsFetched ? (
          <div className="loader" />
        ) : (
          <DownloadDetails {...this.props} />
        )}
      </div>
    );
  }
}
Download = connect(
  ({ download }) => ({
    ...download,
    species: groupSamplesBySpecies({
      samples: download.samples,
      dataSet: download.dataSet
    }),
    filesData: downloadFilesData
  }),
  {
    removeSpecies,
    removeExperiment,
    fetchDataSetDetails
  }
)(Download);

export default Download;

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
