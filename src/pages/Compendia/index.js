import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import classnames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

import NormalizedCompendia from './NormalizedCompendia';
import RNASeqSampleCompendia from './RNASeqSampleCompendia';
import EmailSection from '../index/EmailSection';
import { themes, useTheme } from '../../common/ThemeContext';

// only render the points in the client
const PointsBackground = dynamic(() => import('./PointsBackground'), {
  ssr: false,
});

function Compendia() {
  useTheme(themes.light);
  const router = useRouter();
  const compendiaOptions = [
    {
      hash: 'normalized',
      name: 'Normalized Compendia',
      tab: NormalizedCompendia,
    },
    {
      hash: 'rna-seq-sample',
      name: 'RNA-seq Sample Compendia',
      tab: RNASeqSampleCompendia,
    },
  ];

  // when no hash is specified we render the normalized compendia
  const active =
    compendiaOptions.find(c => router.query['c'] === c.hash) ||
    compendiaOptions[0];

  return (
    <div>
      <Head>
        <title>Compendia</title>
      </Head>
      <div className="compendia">
        <div className="compendia__header">
          <PointsBackground />
          <div className="compendia__header-inner">
            <h1 className="compendia__title">
              refine.bio Compendia packages the data processed by refine.bio
              pipelines for flexible and broad use by computational biologists
              and data scientists
            </h1>
          </div>
        </div>
        <div className="compendia__tabs--container">
          <ul className="compendia__tabs">
            {compendiaOptions.map(compendia => (
              <li
                key={compendia.hash}
                className={classnames('compendia__tab', {
                  'compendia__tab--active': compendia.hash === active.hash,
                })}
              >
                <Link
                  href={{
                    pathname: router.pathname,
                    query: { c: compendia.hash },
                  }}
                  replace
                >
                  <a>{compendia.name}</a>
                </Link>
              </li>
            ))}
          </ul>
          {<active.tab title={active.name} />}
        </div>
      </div>
      <div className="main__section main__section--blue-gradient">
        <EmailSection />
      </div>
    </div>
  );
}

export default Compendia;
