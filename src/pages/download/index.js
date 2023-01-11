import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import DownloadBar from './DownloadBar';
import DownloadDetails from './DownloadDetails';
import NoDatasetsImage from '../../common/images/no-datasets.svg';
import { useLoader } from '../../components/Loader';
import { fetchDataSetDetails } from '../../state/download/actions';
import DownloadStart from './DownloadStart/DownloadStart';
import Spinner from '../../components/Spinner';

let Download = ({ download, fetchDataSetDetails }) => {
  const router = useRouter();
  const { dataSetId, dataSet } = download;
  const { isLoading, refresh } = useLoader(() =>
    fetchDataSetDetails(dataSetId)
  );

  const dataSetCanBeDownloaded = dataSet && Object.keys(dataSet).length > 0;

  // show form to get information and start the download
  if (router.query.start && dataSetCanBeDownloaded) {
    return <DownloadStart dataSetId={dataSetId} dataSet={dataSet} />;
  }

  if (isLoading) return <Spinner />;
  if (!dataSetCanBeDownloaded) return <DownloadEmpty />;

  return (
    <div className="downloads">
      <DownloadBar dataSet={download} />
      <DownloadDetails dataSet={download} onRefreshDataSet={refresh} />
    </div>
  );
};
Download = connect(({ download }) => ({ download }), {
  fetchDataSetDetails,
})(Download);
export default Download;

function DownloadEmpty() {
  return (
    <div className="downloads__empty">
      <h3 className="downloads__empty-heading">Your dataset is empty.</h3>
      <Link legacyBehavior href="/index" as="/">
        <a className="button">Search and Add Samples</a>
      </Link>
      <img
        src={NoDatasetsImage}
        alt="Your dataset is empty"
        className="downloads__empty-image img-responsive"
      />
    </div>
  );
}
