import React from 'react';
import Helmet from 'react-helmet';
import Dropdown from '../../components/Dropdown';
import Button from '../../components/Button';
import './SpeciesCompendia.scss';

import PointsBackground from './PointsBackground';
import DownloadCompendia from './DownloadCompendia';

export default function SpeciesCompendia() {
  return (
    <div>
      <Helmet>
        <title>Species Compendia</title>
      </Helmet>

      <div className="species-compendia">
        <div className="species-compendia__header">
          <PointsBackground />

          <div className="species-compendia__header-inner">
            <h1 className="species-compendia__title">
              Species Compendia are the collection of all the samples available
              on refine.bio, aggregated and normalized by species.{' '}
            </h1>

            <DownloadCompendia />
          </div>
        </div>

        <div className="layout__content">
          <div className="species-compendia__section">
            <div className="species-compendia__section-title">
              Data scientists and computational biologists can use species
              compendia to quickly construct training and testing sets and
              extract features from a diverse set of biological contexts and
              conditions
            </div>

            <p>
              <i>Examples coming soon</i>
            </p>
          </div>

          <div className="species-compendia__section">
            <div className="species-compendia__section-title">
              The compendium is created by aggregating all samples from a
              species, removing samples and genes with too many missing values,
              imputing missing values with SVD impute. The final step is
              quantile normalization.
            </div>

            <Button text="Learn More" buttonStyle="secondary" />
          </div>
        </div>
      </div>
    </div>
  );
}
