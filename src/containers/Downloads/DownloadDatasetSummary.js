import React from 'react';

const DownloadDatasetSummary = () => {
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
            <tr className="downloads__table-row">
              <td className="downloads__table-cell">Humans</td>
              <td className="downloads__table-cell downloads__table-cell--value">
                100
              </td>
              <td className="downloads__table-cell downloads__table-cell--value">
                10
              </td>
            </tr>
            <tr className="downloads__table-row">
              <td className="downloads__table-cell">Mouse</td>
              <td className="downloads__table-cell downloads__table-cell--value">
                100
              </td>
              <td className="downloads__table-cell downloads__table-cell--value">
                10
              </td>
            </tr>
            <tr className="downloads__table-row">
              <td className="downloads__table-cell">Total</td>
              <td className="downloads__table-cell downloads__table-cell--value">
                100
              </td>
              <td className="downloads__table-cell downloads__table-cell--value">
                10
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DownloadDatasetSummary;
