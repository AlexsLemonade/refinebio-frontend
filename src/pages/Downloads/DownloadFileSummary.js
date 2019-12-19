import React from 'react';
import InfoIcon from '../../common/icons/info-badge.svg';

import downloadFilesData from './downloadFilesData';

const DownloadFileSummary = ({ dataSet }) => {
  if (!dataSet.data) return null;

  const samplesBySpecies = dataSet.organism_samples;

  const summaryData = downloadFilesData(
    dataSet.data,
    samplesBySpecies,
    dataSet.aggregate_by
  );

  return (
    <section className="downloads__section">
      <div className="downloads__cards">
        {summaryData.files.map(card => (
          <div className="downloads__card" key={card.title + card.description}>
            <h4>{card.title}</h4>
            <div className="downloads__card-stats">
              <div className="downloads__card-stat">{card.description}</div>
              <div className="downloads__card-stat">Format: {card.format}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="downloads-processed-info info">
        <img className="info__icon" src={InfoIcon} alt="" />
        <div>
          <div className="nowrap">
            All data you download from refine.bio has been uniformly processed
            and normalized.{' '}
            <a
              href="//docs.refine.bio/en/latest/main_text.html#processing-information"
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadFileSummary;
