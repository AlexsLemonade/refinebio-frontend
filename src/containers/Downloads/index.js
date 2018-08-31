import React, { Component, Fragment } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import BackToTop from '../../components/BackToTop';
import DownloadBar from './DownloadBar';
import DownloadDetails from './DownloadDetails';
import './Downloads.scss';
import NoDatasetsImage from './../../common/images/no-datasets.svg';
import Loader from '../../components/Loader';
import { fetchDataSetDetails } from '../../state/download/actions';

class Download extends Component {
  render() {
    const { dataSetId, dataSet, aggregate_by, scale_by } = this.props;

    return (
      <div className="downloads">
        <Helmet>
          <title>refine.bio - Download Dataset</title>
        </Helmet>
        <BackToTop />
        <h1 className="downloads__heading">Download Dataset</h1>
        <Loader fetch={() => this.props.fetchDataSetDetails(dataSetId)}>
          {({ isLoading }) =>
            isLoading ? (
              <div className="loader" />
            ) : !dataSet || !Object.keys(dataSet).length ? (
              <div className="downloads__empty">
                <h3 className="downloads__empty-heading">
                  Your dataset is empty.
                </h3>
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
                  aggregate_by={aggregate_by}
                  scale_by={scale_by}
                />
                <DownloadDetails {...this.props} />
              </Fragment>
            )
          }
        </Loader>
      </div>
    );
  }
}
Download = connect(
  ({
    download: {
      dataSetId,
      samples,
      dataSet,
      experiments,
      is_processing,
      is_processed,
      aggregate_by,
      scale_by
    }
  }) => ({
    dataSetId,
    samples,
    dataSet,
    experiments,
    is_processing,
    is_processed,
    aggregate_by,
    scale_by
  }),
  {
    fetchDataSetDetails
  }
)(Download);

export default Download;
