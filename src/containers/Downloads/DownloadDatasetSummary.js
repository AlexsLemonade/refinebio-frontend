import React from 'react';

const DownloadDatasetSummary = ({
  samplesBySpecies,
  totalSamples,
  totalExperiments,
  experimentCountBySpecies
}) => {
  const renderSpeciesRow = () => {
    return Object.keys(samplesBySpecies).map((organism, i) => {
      const samples = samplesBySpecies[organism];
      return (
        <tr className="downloads__table-row" key={i}>
          <td className="downloads__table-cell">{organism}</td>
          <td className="downloads__table-cell downloads__table-cell--value">
            {samples.length}
          </td>
          <td className="downloads__table-cell downloads__table-cell--value">
            {experimentCountBySpecies[organism]}
          </td>
        </tr>
      );
    });
  };

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
            {renderSpeciesRow()}
            <tr className="downloads__table-row">
              <td className="downloads__table-cell">Total</td>
              <td className="downloads__table-cell downloads__table-cell--value">
                {totalSamples}
              </td>
              <td className="downloads__table-cell downloads__table-cell--value">
                {totalExperiments}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DownloadDatasetSummary;
