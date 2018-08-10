import React, { Component, Fragment } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import {
  removeExperiment,
  removeSpecies,
  clearDataSet,
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

import {
  editAggregation,
  editTransformation
} from '../../state/dataSet/actions';

import { formatSentenceCase } from '../../common/helpers';
import {
  getTransformationNameFromOption,
  getTransformationOptionFromName
} from './transformation';

class Download extends Component {
  state = {
    aggregation: null,
    transformation: null
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
      isLoading,
      aggregate_by,
      scale_by
    } = this.props;

    if (dataSetId && !areDetailsFetched && !isLoading) {
      fetchDataSetDetails(dataSet);
    }

    if (aggregate_by && !this.state.aggregation) {
      this.setState({ aggregation: formatSentenceCase(aggregate_by) });
    }

    if (scale_by && !this.state.transformation) {
      this.setState({
        transformation: getTransformationOptionFromName(
          formatSentenceCase(scale_by)
        )
      });
    }
  }

  handleAggregationChange = aggregation => {
    const { dataSetId, editAggregation } = this.props;
    editAggregation({ dataSetId, aggregation });
    this.setState({ aggregation });
  };

  handleTransformationChange = transformation => {
    const { dataSetId, editTransformation } = this.props;
    editTransformation({
      dataSetId,
      transformation: getTransformationNameFromOption(transformation)
    });
    this.setState({ transformation });
  };

  render() {
    const {
      dataSetId,
      isLoading,
      dataSet,
      is_processing,
      is_processed
    } = this.props;

    if (is_processing || is_processed) {
      return <Redirect to={`/dataset/${dataSetId}`} />;
    }

    return (
      <div className="downloads">
        <Helmet>
          <title>refine.bio - Download Dataset</title>
        </Helmet>
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
              transformation={this.state.transformation}
              transformationOnChange={this.handleTransformationChange}
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
      filesData: downloadsFilesData(dataSet),
      totalSamples: getTotalSamplesAdded({ dataSet }),
      totalExperiments: getTotalExperimentsAdded({ dataSet }),
      experimentCountBySpecies: getExperimentCountBySpecies({
        experiments,
        dataSet
      })
    };
  },
  {
    removeSpecies,
    removeExperiment,
    clearDataSet,
    fetchDataSetDetails,
    editAggregation,
    editTransformation
  }
)(Download);

export default Download;
