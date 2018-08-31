import React, { Component, Fragment } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import BackToTop from '../../components/BackToTop';

import {
  removeExperiment,
  removeSamples,
  clearDataSet,
  fetchDataSetDetails,
  editAggregation,
  editTransformation
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
import NoDatasetsImage from './../../common/images/no-datasets.svg';

class Download extends Component {
  componentDidMount() {
    const { dataSet, dataSetId } = this.props;
    if (dataSetId) {
      this.props.fetchDataSetDetails(dataSet);
    }
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
    const { dataSetId, isLoading, dataSet } = this.props;

    return (
      <div className="downloads">
        <Helmet>
          <title>refine.bio - Download Dataset</title>
        </Helmet>
        <BackToTop />
        <h1 className="downloads__heading">Download Dataset</h1>
        {isLoading ? (
          <div className="loader" />
        ) : !dataSet || !Object.keys(dataSet).length ? (
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
              aggregate_by={this.props.aggregate_by}
              scale_by={this.props.scale_by}
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
      experiments,
      is_processing,
      is_processed,
      aggregate_by,
      scale_by
    }
  }) => {
    // If areDetailsFetched is false, either samples is already {} or the local dataset has more
    // samples in it than the stored version of the remote one. The remote one will be refetched
    // on load, but this makes sure that no errors happen due to an out of date local version.
    if (!areDetailsFetched) {
      samples = {};
    }

    return {
      dataSetId,
      isLoading,
      areDetailsFetched,
      samples,
      dataSet,
      experiments,
      is_processing,
      is_processed,
      aggregate_by,
      scale_by,
      samplesBySpecies: groupSamplesBySpecies({
        samples: samples,
        dataSet: dataSet
      }),
      totalSamples: getTotalSamplesAdded({ dataSet }),
      totalExperiments: getTotalExperimentsAdded({ dataSet }),
      experimentCountBySpecies: getExperimentCountBySpecies({
        experiments,
        dataSet
      })
    };
  },
  {
    removeSamples,
    removeExperiment,
    clearDataSet,
    fetchDataSetDetails,
    editAggregation,
    editTransformation
  }
)(Download);

export default Download;
