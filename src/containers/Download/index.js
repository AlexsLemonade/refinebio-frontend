import React, { Component } from 'react';
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    dashboard: state.dashboard
  };
}

class Download extends Component {
  render() {
    return (
      <div className="downloads">
        <h1 className="downloads__heading">Download Page</h1>
        <div className="downloads__bar">
          <fieldset>
            <label>Aggregate</label>
            <div className="dropdown">dropdown</div>
          </fieldset>
          <fieldset>
            <label>Transformation</label>
            <div className="dropdown">dropdown</div>
          </fieldset>
          <button>Download</button>
        </div>
        <section className="downloads__section">
          <h2>Download Files Summary</h2>
        </section>
        <section className="downloads__section">
          <h2>Dataset Summary</h2>
        </section>
        <section className="downloads__section">
          <h2>Samples</h2>
          <div className="toggle">Species View | Experiment View</div>
        </section>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Download);
