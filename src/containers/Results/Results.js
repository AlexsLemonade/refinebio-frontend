import React, { Component } from 'react';
import Result from './Result';

class Results extends Component {
  componentWillMount() {
    const { location } = this.props;

    const q = location.search.substr(1).replace(/q=/, '');
    this.props.fetchResults(q);
  }

  render() {
    const { results } = this.props;
    console.log(results);
    return (
      <div>
        <div>Search bar</div>
        <div>
          <div>
            <h2>Filters</h2>
          </div>
          <div>
            {results.map((result, i) => <Result key={i} result={result} />)}
          </div>
        </div>
      </div>
    );
  }
}

export default Results;
