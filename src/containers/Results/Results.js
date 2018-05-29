import React, { Component } from 'react';
import Result, { RemoveFromDatasetButton } from './Result';
import ResultFilter from './ResultFilter';
import SearchInput from '../../components/SearchInput';
import Pagination from '../../components/Pagination';
import Button from '../../components/Button';
import BackToTop from '../../components/BackToTop';
import { getQueryParamObject } from '../../common/helpers';
import './Results.scss';

class Results extends Component {
  componentDidMount() {
    const { location } = this.props;

    const { q, p } = getQueryParamObject(location.search.substr(1));
    this.props.fetchResults(q, p);
    this.props.fetchOrganisms();
  }

  componentDidUpdate(nextProps) {
    if (nextProps.results !== this.props.results) window.scrollTo(0, 0);
  }

  handleSubmit = values => {
    this.props.fetchResults(values.search);
  };

  handlePagination = pageNum => {
    const { getPage } = this.props;
    getPage(pageNum);
  };

  handlePageRemove = () => {
    const { removeExperiment, results } = this.props;
    const accessionCodes = results.map(result => result.accession_code);
    removeExperiment(accessionCodes);
  };

  render() {
    const {
      results,
      organisms,
      toggledFilter,
      addExperiment,
      removeExperiment,
      filters,
      searchTerm,
      dataSet,
      isLoading,
      pagination: { totalPages, totalResults, resultsPerPage, currentPage }
    } = this.props;

    const totalSamplesOnPage = results.reduce(
      (sum, result) => sum + result.samples.length,
      0
    );

    return (
      <div className="results">
        <BackToTop />
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
                  ? `Showing ${
                      resultsPerPage < totalResults
                        ? resultsPerPage
                        : totalResults
                    } of ${totalResults} results`
                  : null}
                {results.filter(result => !dataSet[result.accession_code])
                  .length === 0 ? (
                  <RemoveFromDatasetButton
                    totalAdded={totalSamplesOnPage}
                    handleRemove={this.handlePageRemove}
                  />
                ) : (
                  <Button
                    buttonStyle="secondary"
                    text="Add Page to Dataset"
                    onClick={() => {
                      addExperiment(results);
                    }}
                  />
                )}
              </div>
              {results.map((result, i) => (
                <Result
                  key={i}
                  result={result}
                  addExperiment={addExperiment}
                  removeExperiment={removeExperiment}
                  dataSet={dataSet}
                  isAdded={!!dataSet[result.accession_code]}
                />
              ))}
              <Pagination
                onPaginate={this.handlePagination}
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
