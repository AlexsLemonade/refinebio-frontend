import React from 'react';
import { formatSentenceCase } from '../../common/helpers';
import {
  getTotalSamplesAdded,
  getExperimentCountBySpecies,
  getTotalExperimentsAdded,
} from '../../state/download/reducer';

const DownloadDatasetSummary = ({ dataSet }) => {
  const samplesBySpecies = dataSet.organism_samples;
  const totalSamples = getTotalSamplesAdded(dataSet.data);
  const totalExperiments = getTotalExperimentsAdded(dataSet.data);
  const experimentCountBySpecies = getExperimentCountBySpecies(
    dataSet.data,
    dataSet.experiments
  );

  return (
    <section className="downloads__section">
      <h2>Dataset Summary</h2>
      <div className="downloads__card downloads__card--summary">
        <table className="downloads__table">
          <thead>
            <tr className="downloads__table-row">
              <th className="downloads__table-header" />
              <th className="downloads__table-header">Samples</th>
              <th className="downloads__table-header">Experiments</th>
            </tr>
          </thead>
          <tbody>
            <SpeciesRow
              samplesBySpecies={samplesBySpecies}
              experimentCountBySpecies={experimentCountBySpecies}
            />
            <TotalsRow
              totalSamples={totalSamples}
              totalExperiments={totalExperiments}
            />
          </tbody>
        </table>
      </div>
    </section>
  );
};

function SpeciesRow({ samplesBySpecies, experimentCountBySpecies }) {
  return Object.keys(samplesBySpecies).map(organism => {
    return (
      <tr className="downloads__table-row" key={organism}>
        <td className="downloads__table-cell">
          {formatSentenceCase(organism)}
        </td>
        <td className="downloads__table-cell downloads__table-cell--value">
          {samplesBySpecies[organism].length}
        </td>
        <td className="downloads__table-cell downloads__table-cell--value">
          {experimentCountBySpecies[organism] || 0}
        </td>
      </tr>
    );
  });
}

function TotalsRow({ totalSamples, totalExperiments }) {
  return (
    <tr className="downloads__table-row">
      <td className="downloads__table-cell">Total</td>
      <td className="downloads__table-cell downloads__table-cell--value">
        {totalSamples}
      </td>
      <td className="downloads__table-cell downloads__table-cell--value">
        {totalExperiments}
      </td>
    </tr>
  );
}

export default DownloadDatasetSummary;
