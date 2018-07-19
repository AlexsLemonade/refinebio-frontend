import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import {
  removeExperiment,
  removeSpecies,
  fetchDataSetDetails
} from '../../state/download/actions';
import {
  groupSamplesBySpecies,
  getTotalSamplesAdded,
  getExperimentCountBySpecies,
  getTotalExperimentsAdded
} from '../../state/download/reducer';

import DownloadBar from './DownloadBar';
import DownloadDetails from './DownloadDetails';
import './Downloads.scss';
import downloadsFilesData from './downloadFilesData';
import NoDatasetsImage from './../../common/images/no-datasets.svg';
import { Link } from 'react-router-dom';

class Download extends Component {
  state = {
    aggregation: 'All'
  };

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

  handleAggregationChange = aggregation => {
    this.setState({ aggregation });
  };

  render() {
    const { dataSetId, isLoading, areDetailsFetched, dataSet } = this.props;

    return (
      <div className="downloads">
        <h1 className="downloads__heading">Download Dataset</h1>
        {isLoading ? (
          <div className="loader" />
        ) : !Object.keys(dataSet).length ? (
          <div className="downloads__empty">
            <h3 className="downloads__empty-heading">Your dataset is empty.</h3>
            <Link className="button" to="/">
              Search and Add Samples
            </Link>
            <img
              src={NoDatasetsImage}
              alt="Your dataset is empty"
              className="downloads__empty-image"
            />
          </div>
        ) : (
          <Fragment>
            <DownloadBar
              dataSetId={dataSetId}
              aggregation={this.state.aggregation}
              aggregationOnChange={this.handleAggregationChange}
            />
            <DownloadDetails {...this.props} />
          </Fragment>
        )}
      </div>
    );
  }
}
Download = connect(
  ({
    download: {
      dataSetId,
      isLoading,
      areDetailsFetched,
      samples,
      dataSet,
      experiments
    }
  }) => ({
    dataSetId,
    isLoading,
    areDetailsFetched,
    samples,
    dataSet,
    experiments,
    samplesBySpecies: groupSamplesBySpecies({
      samples: samples,
      dataSet: dataSet
    }),
    filesData: downloadsFilesData(dataSet),
    totalSamples: getTotalSamplesAdded({ dataSet }),
    totalExperiments: getTotalExperimentsAdded({ dataSet }),
    experimentCountBySpecies: getExperimentCountBySpecies({
      experiments,
      dataSet
    })
  }),
  {
    removeSpecies,
    removeExperiment,
    fetchDataSetDetails
  }
)(Download);

export default Download;
