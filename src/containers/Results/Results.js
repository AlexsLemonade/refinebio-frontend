import React, { Component } from 'react';
import Result from './Result';
import ResultFilter from './ResultFilter';
import SearchInput from '../../components/SearchInput';
import './Results.scss';

class Results extends Component {
  componentWillMount() {
    const { location } = this.props;

    const q = location.search.substr(1).replace(/q=/, '');
    this.props.fetchResults(q);
    this.props.fetchOrganisms();
  }

  handleSubmit = values => {
    this.props.fetchResults(values.search);
  };

  render() {
    const { results, organisms } = this.props;
    return (
      <div className="results">
        <div className="results__search">
          <SearchInput onSubmit={this.handleSubmit} />
        </div>
        <div className="results__container">
          <div className="results__filters">
            <ResultFilter organisms={organisms} />
          </div>
          <div className="results__list">
            {results.map((result, i) => <Result key={i} result={result} />)}
          </div>
        </div>
      </div>
    );
  }
}

export default Results;
