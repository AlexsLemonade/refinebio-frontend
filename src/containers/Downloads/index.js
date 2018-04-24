import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import './Downloads.scss';

function mapStateToProps(state) {
  return {
    dashboard: state.dashboard
  };
}

const cardData = [
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
            {cardData.map((card, i) => (
              <div className="downloads__card" key={i}>
                <h4>{card.title}</h4>
                <p>{card.description}</p>
                <div className="downloads__card-stats">
                  <p className="caption">{card.size}</p>
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
            <div className="downloads__sample">
              <div className="downloads__sample-info">
                <h2>Human Samples</h2>
                <div className="downloads__sample-stats">
                  <p>100 Samples</p>
                  <p>233 Genes</p>
                </div>
                <Button text="View Samples" />
              </div>
              <Button text="Remove" />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Download);
