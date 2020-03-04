import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Spinner from '../src/components/Spinner';

const Download = dynamic(() => import('../src/pages/download'), {
  ssr: false,
  loading: () => <Spinner />,
});

export default function DownloadPage() {
  return (
    <div className="layout__content">
      <Head>
        <title>Download Dataset - refine.bio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Download />
    </div>
  );
}
