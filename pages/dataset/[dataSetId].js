import React from 'react';
import Head from 'next/head';
import DataSet from '../../src/pages/dataset';

export default function() {
  return (
    <div className="layout__content">
      <Head>
        <title>Dataset - refine.bio</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="description"
          content="Explore and download this custom harmonized childhood cancer transcriptome dataset."
        />
      </Head>

      <DataSet />
    </div>
  );
}
