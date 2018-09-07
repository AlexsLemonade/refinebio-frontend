import React from 'react';
import { formatSentenceCase } from '../../common/helpers';
import { getTransformationOptionFromName } from './transformation';
import {
  downloadsFilesDataBySpecies,
  downloadsFilesDataByExperiment
} from './downloadFilesData';

const DownloadFileSummary = ({
  dataSet,
  samplesBySpecies,
  aggregate_by,
  scale_by,
  isEmbed = false
}) => {
  if (!dataSet) return null;

  let summaryData =
    aggregate_by === 'SPECIES'
      ? downloadsFilesDataBySpecies(dataSet, samplesBySpecies)
      : downloadsFilesDataByExperiment(dataSet);

  return (
    <section className="downloads__section">
      <h2>Download Files Summary</h2>

      {isEmbed && (
        <div>
          <div className="downloads__file-modifier">
            Aggregated by: {formatSentenceCase(aggregate_by)}
          </div>
          <div className="downloads__file-modifier">
            Transformation:{' '}
            {formatSentenceCase(getTransformationOptionFromName(scale_by))}
          </div>
        </div>
      )}

      <div className="downloads__cards">
        {summaryData.files.map((card, i) => (
          <div className="downloads__card" key={i}>
            <h4>{card.title}</h4>
            <p>{card.description}</p>
            <div className="downloads__card-stats">
              <p className="downloads__card-stat">Total Size: {card.size}</p>
              <p className="downloads__card-stat">Format: {card.format}</p>
            </div>
          </div>
        ))}

        <div className="downloads__card">
          <h4>Estimated Download Size</h4>
          <h4>{summaryData.total}</h4>
        </div>
      </div>
    </section>
  );
};

export default DownloadFileSummary;
