import React, { Component } from 'react';
import Result, { RemoveFromDatasetButton } from './Result';
import ResultFilters from './ResultFilters';
import SearchInput from '../../components/SearchInput';
import Pagination from '../../components/Pagination';
import Button from '../../components/Button';
import BackToTop from '../../components/BackToTop';
import { getQueryParamObject } from '../../common/helpers';
import './Results.scss';
import { connect } from 'react-redux';
import { updateResultsPerPage } from '../../state/search/actions';
import Dropdown from '../../components/Dropdown';

class Results extends Component {
  componentDidMount() {
    const { location } = this.props;

    const queryObject = getQueryParamObject(location.search.substr(1));
    const { q, p, ...filters } = queryObject;

    // Unescape keyword comming from the url
    const query = unescape(q);

    this.props.fetchResults(query, p, filters);
    this.props.fetchOrganisms();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.results !== this.props.results) window.scrollTo(0, 0);
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
      appliedFilters,
      searchTerm,
      dataSet,
      isLoading,
      pagination: { totalPages, currentPage }
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
            <ResultFilters
              organisms={organisms}
              toggledFilter={toggledFilter}
              filters={filters}
              appliedFilters={appliedFilters}
            />
          </div>
          {isLoading ? (
            <div className="loader" />
          ) : (
            <div className="results__list">
              <div className="results__top-bar">
                {results.length ? <NumberOfResults /> : null}
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

const PAGE_SIZES = [10, 20, 50];

let NumberOfResults = ({
  resultsPerPage,
  totalResults,
  updateResultsPerPage
}) =>
  // Only show the dropdown if there're enough elements
  totalResults < PAGE_SIZES[0] ? (
    <div>
      Showing {totalResults} of {totalResults} results
    </div>
  ) : (
    <div>
      Showing
      <Dropdown
        options={PAGE_SIZES}
        selectedOption={resultsPerPage}
        onChange={updateResultsPerPage}
      />{' '}
      of {totalResults} results
    </div>
  );
NumberOfResults = connect(
  ({ search: { pagination: { totalResults, resultsPerPage } } }) => ({
    totalResults,
    resultsPerPage
  }),
  { updateResultsPerPage }
)(NumberOfResults);
