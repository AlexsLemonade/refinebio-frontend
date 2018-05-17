import React, { Component } from 'react';
import Result from './Result';
import ResultFilter from './ResultFilter';
import SearchInput from '../../components/SearchInput';
import Pagination from '../../components/Pagination';
import './Results.scss';

class Results extends Component {
  componentDidMount() {
    const { location } = this.props;

    const q = location.search.substr(1).replace(/q=/, '');
    this.props.fetchResults(q);
    this.props.fetchOrganisms();
  }

  componentWillUpdate = nextProps => {
    if (nextProps.results !== this.props.results) window.scrollTo(0, 0);
  };

  handleSubmit = values => {
    this.props.fetchResults(values.search);
  };

  render() {
    const {
      results,
      organisms,
      toggledFilter,
      addedExperiment,
      removedExperiment,
      getPage,
      filters,
      searchTerm,
      dataSet,
      isLoading,
      pagination: { totalPages, totalResults, resultsPerPage, currentPage }
    } = this.props;

    return (
      <div className="results">
        <div className="results__search">
          <SearchInput onSubmit={this.handleSubmit} searchTerm={searchTerm} />
        </div>
        <div className="results__container">
          <div className="results__filters">
            <ResultFilter
              organisms={organisms}
              toggledFilter={toggledFilter}
              filters={filters}
            />
          </div>
          {isLoading ? (
            <div className="loader" />
          ) : (
            <div className="results__list">
              <div className="results__top-bar">
                {results.length
                  ? `Showing ${resultsPerPage} of ${totalResults} results`
                  : null}
              </div>
              {results.map((result, i) => (
                <Result
                  key={i}
                  result={result}
                  addedExperiment={addedExperiment}
                  removedExperiment={removedExperiment}
                  dataSet={dataSet}
                  isAdded={!!dataSet[result.accession_code]}
                />
              ))}
              <Pagination
                onPaginate={getPage}
                totalPages={totalPages}
                currentPage={currentPage}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Results;
