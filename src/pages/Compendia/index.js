import React from 'react';
import Helmet from 'react-helmet';
import classnames from 'classnames';
import { Link, withRouter, Redirect } from 'react-router-dom';
import './Compendia.scss';
import PointsBackground from './PointsBackground';
import NormalizedCompendia from './NormalizedCompendia';
import RNASeqSampleCompendia from './RNASeqSampleCompendia';
import EmailSection from '../Main/EmailSection';
import { themes, useTheme } from '../../common/ThemeContext';

const Compendia = function Compendia({ location, replace }) {
  useTheme(themes.light);
  const compendiaOptions = [
    {
      hash: '#normalized',
      name: 'Normalized Compendia',
      tab: NormalizedCompendia,
    },
    {
      hash: '#rna-seq-sample',
      name: 'RNA-seq Sample Compendia',
      tab: RNASeqSampleCompendia,
    },
  ];

  const active = compendiaOptions.find(c => c.hash === location.hash);
  if (!active) return <Redirect to={{ hash: '#normalized' }} />;
  return (
    <div>
      <Helmet>
        <title>Compendia</title>
      </Helmet>
      <div className="compendia">
        <div className="compendia__header">
          <PointsBackground />
          <div className="compendia__header-inner">
            <h1 className="compendia__title">
              refine.bio Compendia packages the data processed by refine.bio
              pipelines for flexible and broad use by computational biologists
              and data sceientists
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
                  to={{
                    pathname: location.path,
                    hash: compendia.hash,
                  }}
                  replace
                >
                  {compendia.name}
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
};

export default withRouter(Compendia);
