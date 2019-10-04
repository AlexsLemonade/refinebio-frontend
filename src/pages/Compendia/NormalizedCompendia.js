import React from 'react';
import NormalizedIcon from './icon-normal-curve.svg';
import DownloadCompendia from './DownloadCompendia';

export default function NormalizedCompendia({ title }) {
  return (
    <div className="compendia__tab--container">
      <div className="compendia__download">
        <div className="compendia__icon">
          <img alt="compendia" src={NormalizedIcon} />
        </div>
        <p className="compendia__name">Normalized Compendia</p>
        <div className="compendia__process-download">
          <p className="compendia__process">
            Normalized Compendia are the collection of all the samples available
            on refine.bio, aggregated and normalized by species.
          </p>
          <DownloadCompendia title={title} />
        </div>
      </div>
      <div className="compendia__section">
        <div className="compendia__section-title">
          The compendium is created by aggregating all samples from a species,
          removing samples and genes with too many missing values, imputing
          missing values with SVD impute. The final step is quantile
          normalization.
        </div>
        <a
          href="http://docs.refine.bio/en/latest/main_text.html#normalized-compendia"
          className="button button--secondary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn More
        </a>
      </div>
      <div className="compendia__section">
        <div className="compendia__section-title">
          Data scientists and computational biologists can use species compendia
          to quickly construct training and testing sets and extract features
          from a diverse set of biological contexts and conditions.
        </div>
        <p>
          <i>Examples coming soon</i>
        </p>
      </div>
    </div>
  );
}
