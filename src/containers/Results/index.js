import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as resultsActions from '../../state/search/actions';
import * as downloadActions from '../../state/download/actions';
import Helmet from 'react-helmet';
import Result from './Result';
import ResultFilters, { anyFilterApplied } from './ResultFilters';
import SearchInput from '../../components/SearchInput';
import Pagination from '../../components/Pagination';
import BackToTop from '../../components/BackToTop';
import { getQueryParamObject } from '../../common/helpers';
import './Results.scss';
import { updateResultsPerPage } from '../../state/search/actions';
import Dropdown from '../../components/Dropdown';
import { PAGE_SIZES } from '../../constants/table';
import StartSearchingImage from '../../common/images/start-searching.svg';
import GhostSampleImage from '../../common/images/ghost-sample.svg';
import { Link } from 'react-router-dom';
import DataSetSampleActions from '../Experiment/DataSetSampleActions';
import isEqual from 'lodash/isEqual';
import Loader from '../../components/Loader';
import Button from '../../components/Button';
import { clearFilters } from '../../state/search/actions';

class Results extends Component {
  state = {
    query: '',
    filters: {}
  };

  /**
   * Reads the search query and other parameters from the url and submits a new request to update the results.
   */
  async updateResults() {
    const searchArgs = this._parseUrl();

    this.setState({
      query: searchArgs.query,
      filters: searchArgs.filters
    });

    // check if the search term and the filters are the same, in which case we don't need to
    // fetch the results again
    if (
      this.props.results &&
      this.props.results.length > 0 &&
      searchArgs.query === this.props.searchTerm &&
      isEqual(searchArgs.filters, this.props.appliedFilters)
    ) {
      return;
    }

    // reset scroll position when the results change
    window.scrollTo(0, 0);
    await this.props.fetchResults(searchArgs);
  }

  handleSubmit = values => {
    // When a new search is made, return to the first page and clear the filters
    this.props.triggerSearch(values.search);
  };

  handlePageRemove = () => {
    const { removeExperiment, results } = this.props;
    const accessionCodes = results.map(result => result.accession_code);
    removeExperiment(accessionCodes);
  };

  render() {
    const searchTerm = this.state.query;
    const {
      results,
      addExperiment,
      removeExperiment,
      pagination: { totalPages, currentPage }
    } = this.props;

    return (
      <div className="results">
        <Helmet>
          <title>refine.bio - Results</title>
        </Helmet>

        <BackToTop />
        <div className="results__search">
          <SearchInput onSubmit={this.handleSubmit} searchTerm={searchTerm} />
        </div>

        <Loader
          updateProps={this.props.location.search}
          fetch={() => this.updateResults()}
        >
          {({ isLoading }) =>
            !searchTerm ? (
              <NoSearchTerm />
            ) : isLoading ? (
              <div className="loader" />
            ) : !results.length && !anyFilterApplied(this.state.filters) ? (
              <NoSearchResults />
            ) : !results.length ? (
              <NoSearchResultsTooManyFilters
                appliedFilters={this.state.filters}
              />
            ) : (
              <div className="results__container">
                <div className="results__top-bar">
                  <div className="results__number-results">
                    <NumberOfResults />
                  </div>

                  <DataSetSampleActions
                    data={this._getSamplesAsDataSet()}
                    enableAddRemaining={false}
                    meta={{
                      buttonStyle: 'secondary',
                      addText: 'Add Page to Dataset'
                    }}
                  />
                </div>
                <div className="results__filters">
                  <ResultFilters appliedFilters={this.state.filters} />
                </div>
                <div className="results__list">
                  {results.map(result => (
                    <Result
                      key={result.accession_code}
                      result={result}
                      addExperiment={addExperiment}
                      removeExperiment={removeExperiment}
                    />
                  ))}
                  <Pagination
                    onPaginate={this.props.updatePage}
                    totalPages={totalPages}
                    currentPage={currentPage}
                  />
                </div>
              </div>
            )
          }
        </Loader>
      </div>
    );
  }

  _parseUrl() {
    let { q: query, p: page, size, ...filters } = getQueryParamObject(
      this.props.location.search
    );

    // for consistency, ensure all values in filters are arrays
    // the method `getQueryParamObject` will return a single value for parameters that only
    // appear once in the url
    for (let key of Object.keys(filters)) {
      if (!Array.isArray(filters[key])) {
        filters[key] = [filters[key]];
      }
    }

    // parse parameters from url
    query = query ? decodeURIComponent(query) : undefined;
    page = parseInt(page || 1, 10);
    size = parseInt(size || 10, 10);

    return { query, page, size, filters };
  }

  _getSamplesAsDataSet() {
    return this.props.results.reduce((data, result) => {
      data[result.accession_code] = result.processed_samples.map(
        accession_code => ({
          accession_code,
          is_processed: true
        })
      );
      return data;
    }, {});
  }
}
Results = connect(
  ({
    search: {
      results,
      filters,
      pagination,
      searchTerm,
      isSearching,
      appliedFilters
    },
    download: { dataSet }
  }) => ({
    results,
    pagination,
    searchTerm,
    dataSet,
    isLoading: isSearching,
    appliedFilters
  }),
  {
    ...resultsActions,
    ...downloadActions
  }
)(Results);

export default Results;

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
      Showing{' '}
      <Dropdown
        options={PAGE_SIZES}
        selectedOption={resultsPerPage}
        onChange={updateResultsPerPage}
      />{' '}
      of {totalResults} results
    </div>
  );
NumberOfResults = connect(
  ({
    search: {
      pagination: { totalResults, resultsPerPage }
    }
  }) => ({
    totalResults,
    resultsPerPage
  }),
  { updateResultsPerPage }
)(NumberOfResults);

/**
 * Displayed when the user tries to search for an empty term
 */
const NoSearchTerm = () => {
  return (
    <div className="results__no-results">
      <h2>Try searching for</h2>
      <div className="results__suggestions">
        {['Notch', 'Medulloblastoma', 'GSE16476', 'Versteeg'].map(q => (
          <Link
            className="link results__suggestion"
            to={`/results?q=${q}`}
            key={q}
          >
            {q}
          </Link>
        ))}
      </div>
      <img
        src={StartSearchingImage}
        alt="Start searching"
        className="results__no-results-image img-responsive"
      />
    </div>
  );
};

const NoSearchResults = () => (
  <div className="results__no-results">
    <h2>No matching results</h2>
    <h2>Try another term</h2>
    <div className="results__suggestions">
      {['Notch', 'Medulloblastoma', 'GSE16476', 'Versteeg'].map(q => (
        <Link
          className="link results__suggestion"
          to={`/results?q=${q}`}
          key={q}
        >
          {q}
        </Link>
      ))}
    </div>
    <img
      src={GhostSampleImage}
      alt="Start searching"
      className="results__no-results-image img-responsive"
    />
  </div>
);

let NoSearchResultsTooManyFilters = ({ appliedFilters, clearFilters }) => (
  <div className="results__container results__container--empty">
    <div className="results__filters">
      <ResultFilters appliedFilters={appliedFilters} />
    </div>
    <div className="results__list">
      <div className="results__no-results">
        <h2>No matching results</h2>
        <div>
          Try another term or{' '}
          <Button onClick={clearFilters} buttonStyle="link">
            Clear Filters
          </Button>
        </div>
        <img
          src={GhostSampleImage}
          alt="Start searching"
          className="results__no-results-image img-responsive"
        />
      </div>
    </div>
  </div>
);
NoSearchResultsTooManyFilters = connect(
  () => ({}),
  {
    clearFilters
  }
)(NoSearchResultsTooManyFilters);
