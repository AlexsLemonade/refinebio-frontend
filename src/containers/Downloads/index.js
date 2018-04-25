import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import './Downloads.scss';

function mapStateToProps(state) {
  return {
    dashboard: state.dashboard
  };
}

const downloadFilesData = [
  {
    title: '13 Gene Expression Matrices',
    description: '1 file per Species',
    size: '21 MB',
    format: 'csv'
  },
  {
    title: '13 Gene Expression Matrices',
    description: '1 file per Species',
    size: '21 MB',
    format: 'csv'
  },
  {
    title: '13 Gene Expression Matrices',
    description: '1 file per Species',
    size: '21 MB',
    format: 'csv'
  },
  {
    title: '13 Gene Expression Matrices',
    description: '1 file per Species',
    size: '21 MB',
    format: 'csv'
  }
];

const speciesData = [
  {
    name: 'Human',
    samples: Array(100).fill({}),
    genes: Array(233).fill({})
  },
  {
    name: 'Mouse',
    samples: Array(30).fill({}),
    genes: Array(133).fill({})
  }
];

class Download extends Component {
  render() {
    return (
      <div className="downloads">
        <h1 className="downloads__heading">Download Dataset</h1>
        <div className="downloads__bar">
          <div className="downloads__fieldset">
            <label>
              Aggregate
              <div className="dropdown">dropdown</div>
            </label>
            <label>
              Transformation
              <div className="dropdown">dropdown</div>
            </label>
          </div>
          <Button text="Download" />
        </div>
        <section className="downloads__section">
          <h2>Download Files Summary</h2>
          <div className="downloads__cards">
            {downloadFilesData.map((card, i) => (
              <div className="downloads__card" key={i}>
                <h4>{card.title}</h4>
                <p>{card.description}</p>
                <div className="downloads__card-stats">
                  <p className="downloads__card-stat">
                    Total Size: {card.size}
                  </p>
                  <p className="downloads__card-stat">Format: {card.format}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
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
        <section className="downloads__section">
          <h2>Samples</h2>
          <div className="toggle">Species View | Experiment View</div>
          <div className="downloads__card">
            {speciesData.map((species, i) => (
              <div className="downloads__sample" key={i}>
                <div className="downloads__sample-info">
                  <h2>{species.name} Samples</h2>
                  <div className="downloads__sample-stats">
                    <p className="downloads__sample-stat">
                      {species.samples.length} Samples
                    </p>
                    <p className="downloads__sample-stat">
                      {species.genes.length} Genes
                    </p>
                  </div>
                  <Button text="View Samples" buttonStyle="secondary" />
                </div>
                <Button text="Remove" buttonStyle="remove" />
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Download);
