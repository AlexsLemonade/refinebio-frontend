import React from 'react';
import Helmet from 'react-helmet';
import Button from '../../components/Button';
import './SpeciesCompendia.scss';
import EmailSection from '../Main/EmailSection';
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

            <div className="species-compendia__example-list hidden">
              <div className="mobile-p">
                <h1>multiPLIER</h1>
                <div className="mb-2">
                  Search the collection of harmonized RNA-seq and microarray
                  data from publicly available sources like GEO, ArrayExpress,
                  and SRA. The data has been processed with a set of
                  standardized pipelines curated by the
                </div>
                <a
                  href=""
                  className="button button--secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Examples
                </a>
              </div>
              <div>
                <h1>Predict missing metadata</h1>
                <div className="mb-2">
                  Build and download custom datasets tailored to your needs
                  including gene expression matrices and sample metadata.
                </div>
                <a
                  href=""
                  className="button button--secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Examples
                </a>
              </div>
            </div>
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

      <div className="main__section main__section--blue-gradient">
        <EmailSection />
      </div>
    </div>
  );
}
