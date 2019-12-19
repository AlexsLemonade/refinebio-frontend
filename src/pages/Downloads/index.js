import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import BackToTop from '../../components/BackToTop';
import DownloadBar from './DownloadBar';
import DownloadDetails from './DownloadDetails';
import './Downloads.scss';
import NoDatasetsImage from '../../common/images/no-datasets.svg';
import { useLoader } from '../../components/Loader';
import { fetchDataSetDetails } from '../../state/download/actions';
import { getQueryParamObject } from '../../common/helpers';
import DownloadStart from './DownloadStart/DownloadStart';
import Spinner from '../../components/Spinner';

let Download = ({ download, location, fetchDataSetDetails }) => {
  const { dataSetId, dataSet } = download;
  const { isLoading, refresh } = useLoader(() =>
    fetchDataSetDetails(dataSetId)
  );

  const dataSetCanBeDownloaded = dataSet && Object.keys(dataSet).length > 0;
  const params = getQueryParamObject(location.search);

  // show form to get information and start the download
  if (params.start === 'true') {
    if (dataSetCanBeDownloaded) {
      return <DownloadStart dataSetId={dataSetId} dataSet={dataSet} />;
    }
    // if the dataset can't be downloaded, go back to the downloads page.
    return <Redirect to="/download" params={{ returning: 1 }} />;
  }

  if (isLoading) return <Spinner />;
  if (!dataSetCanBeDownloaded) return <DownloadEmpty />;

  return (
    <div className="downloads">
      <Helmet>
        <title>Download Dataset - refine.bio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <BackToTop />
      <DownloadBar dataSet={download} />
      <DownloadDetails dataSet={download} onRefreshDataSet={refresh} />
    </div>
  );
};
Download = connect(
  ({ download }) => ({ download }),
  {
    fetchDataSetDetails,
  }
)(Download);
export default Download;

function DownloadEmpty() {
  return (
    <div className="downloads__empty">
      <h3 className="downloads__empty-heading">Your dataset is empty.</h3>
      <Link className="button" to="/">
        Search and Add Samples
      </Link>
      <img
        src={NoDatasetsImage}
        alt="Your dataset is empty"
        className="downloads__empty-image img-responsive"
      />
    </div>
  );
}
