import React, { Component } from 'react';
import { connect } from 'react-redux';

import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import fromPairs from 'lodash/fromPairs';
import Result from './Result';
import ResultFilters, { anyFilterApplied } from './ResultFilters';
import SearchInput from '../../components/SearchInput';
import Pagination from '../../components/Pagination';
import BackToTop from '../../components/BackToTop';
import { getQueryParamObject } from '../../common/helpers';
import Dropdown from '../../components/Dropdown';
import { PAGE_SIZES } from '../../common/constants';
import GhostSampleImage from '../../common/images/ghost-sample.svg';
import DistressedTubey from '../../common/images/distressed-tubey.svg';
import DataSetSampleActions from '../../components/DataSetSampleActions';
import Loader from '../../components/Loader';
import Button from '../../components/Button';
import {
  Ordering,
  updateOrdering,
  fetchResults,
  updatePage,
  triggerSearch,
  clearFilters,
  updateResultsPerPage,
  getAccessionCodes,
} from '../../state/search/actions';
import Spinner from '../../components/Spinner';
import InfoBox from '../../components/InfoBox';
import { searchUrl } from '../../routes';
import './SearchResults.scss';
import { ApiOverwhelmed } from '../ServerError';
import { Hightlight } from '../../components/HighlightedText';
import RequestSearchButton from './RequestSearchButton';

class SearchResults extends Component {
  state = {
    query: '',
    filters: {},
  };

  constructor(props) {
    super(props);

    const searchArgs = this.parseUrl();
    this.state = {
      query: searchArgs.query,
      filters: searchArgs.filters,
    };
  }

  /**
   * Reads the search query and other parameters from the url and submits a new request to update the results.
   */
  async updateResults() {
    const searchArgs = this.parseUrl();

    this.setState({
      query: searchArgs.query,
      filters: searchArgs.filters,
    });

    // check if the search term and the filters are the same, in which case we don't need to
    // fetch the results again
    if (this.resultsAreFetched()) {
      return;
    }

    // reset scroll position when the results change
    window.scrollTo(0, 0);
    await this.props.fetchResults(searchArgs);
  }

  resultsAreFetched() {
    const searchArgs = this.parseUrl();

    return (
      this.props.results &&
      this.props.results.length > 0 &&
      searchArgs.query === this.props.searchTerm &&
      isEqual(searchArgs.filters, this.props.appliedFilters) &&
      searchArgs.ordering === this.props.ordering &&
      searchArgs.page === this.props.pagination.currentPage &&
      searchArgs.size === this.props.pagination.resultsPerPage
    );
  }

  parseUrl() {
    /* eslint-disable prefer-const */
    let {
      q: query,
      p: page = 1,
      size = 10,
      ordering = '',
      filter_order = '',
      ...filters
    } = getQueryParamObject(this.props.location.search);
    /* eslint-enable */

    // for consistency, ensure all values in filters are arrays
    // the method `getQueryParamObject` will return a single value for parameters that only
    // appear once in the url
    for (const key of Object.keys(filters)) {
      if (!Array.isArray(filters[key])) {
        filters[key] = [filters[key]];
      }
    }

    // parse parameters from url
    query = query ? decodeURIComponent(query) : undefined;
    page = parseInt(page, 10);
    size = parseInt(size, 10);
    const filterOrder = filter_order ? filter_order.split(',') : [];

    return { query, page, size, ordering, filters, filterOrder };
  }

  render() {
    const {
      results,
      pagination: { totalResults, currentPage, resultsPerPage },
      triggerSearch,
      updatePage,
    } = this.props;
    const totalPages = Math.ceil(totalResults / resultsPerPage);

    return (
      <div>
        <InfoBox />

        <div className="results">
          <Helmet>
            <title>{this.state.query || ''} Results - refine.bio</title>
            <meta
              name="description"
              content="Browse decades of harmonized childhood cancer data and discover how this multi-species repository accelerates the search for cures."
            />
          </Helmet>

          <BackToTop />
          <div className="results__search">
            <SearchInput
              searchTerm={this.state.query}
              onSubmit={query => triggerSearch(query)}
            />
          </div>

          {/* Passing `location.search` to the Loader component ensures that we call `updateResults`
          every time that the url is updated and also when the component is mounted.
          We do several checks to determine what to display, eg: no results, when no search term has 
          been entered, etc */}
          <Loader
            updateProps={this.props.location.search}
            fetch={() => this.updateResults()}
          >
            {({ isLoading, hasError }) => {
              if (isLoading && !this.resultsAreFetched()) {
                return <Spinner />;
              }
              if (hasError) {
                return <ErrorApiUnderHeavyLoad />;
              }
              if (!results.length && !anyFilterApplied(this.state.filters)) {
                return <NoSearchResults query={this.state.query} />;
              }
              if (!results.length) {
                return (
                  <NoSearchResultsTooManyFilters
                    query={this.state.query}
                    appliedFilters={this.state.filters}
                  />
                );
              }

              return (
                <div className="results__container">
                  <div className="results__top-bar">
                    <div className="results__number-results">
                      <NumberOfResults />
                      <OrderingDropdown />
                    </div>
                  </div>
                  <div className="results__add-samples">
                    <AddPageToDataSetButton results={results} />
                  </div>
                  <ResultFilters
                    results={results}
                    appliedFilters={this.state.filters}
                  />
                  <div className="results__list">
                    <Hightlight
                      match={[
                        this.state.query,
                        ...getAccessionCodes(this.state.query),
                      ]}
                    >
                      {results.map((result, index) => (
                        <React.Fragment key={result.accession_code}>
                          <Result result={result} query={this.state.query} />

                          {result._isTopResult &&
                            results[index + 1] &&
                            !results[index + 1]._isTopResult && (
                              <div className="results__related-block">
                                Related Results for '{this.state.query}'
                              </div>
                            )}
                        </React.Fragment>
                      ))}

                      {currentPage === totalPages && (
                        <div className="result result--note">
                          Didn't see a related experiment?{' '}
                          <RequestSearchButton query={this.state.query} />
                        </div>
                      )}
                    </Hightlight>

                    <Pagination
                      onPaginate={updatePage}
                      totalPages={totalPages}
                      currentPage={currentPage}
                    />
                  </div>
                </div>
              );
            }}
          </Loader>
        </div>
      </div>
    );
  }
}
SearchResults = connect(
  ({
    search: { results, pagination, searchTerm, appliedFilters, ordering },
  }) => ({
    results,
    pagination,
    searchTerm,
    appliedFilters,
    ordering,
  }),
  {
    updatePage,
    fetchResults,
    triggerSearch,
  }
)(SearchResults);
export default SearchResults;

/**
 * Renders the button that can add/remove all samples in a page of the search results.
 */
function AddPageToDataSetButton({ results }) {
  // create a dataset slice with the results, use the accession codes in `processed_samples`
  const resultsDataSetSlice = fromPairs(
    results.map(result => [
      result.accession_code,
      { all: true, total: result.num_processed_samples },
    ])
  );

  return (
    <DataSetSampleActions
      dataSetSlice={resultsDataSetSlice}
      enableAddRemaining={false}
      meta={{
        buttonStyle: 'secondary',
        addText: 'Add Page to Dataset',
      }}
    />
  );
}

let NumberOfResults = ({
  resultsPerPage,
  totalResults,
  updateResultsPerPage,
}) => (
  <React.Fragment>
    {// Only show the dropdown if there're enough elements
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
    )}
  </React.Fragment>
);
NumberOfResults = connect(
  ({
    search: {
      searchTerm,
      pagination: { totalResults, resultsPerPage },
    },
  }) => ({
    searchTerm,
    totalResults,
    resultsPerPage,
  }),
  { updateResultsPerPage }
)(NumberOfResults);

const ErrorApiUnderHeavyLoad = () => (
  <div className="results__no-results">
    <ApiOverwhelmed />

    <img
      src={DistressedTubey}
      alt="Start searching"
      className="results__no-results-image img-responsive"
    />
  </div>
);

const NoSearchResults = ({ query }) => (
  <div className="results__no-results">
    <h2>No matching results</h2>
    <h2>Try another term</h2>
    <div className="results__suggestion-list">
      {['Notch', 'Medulloblastoma', 'GSE24528'].map(q => (
        <Link
          className="link results__suggestion"
          to={searchUrl({ q })}
          key={q}
        >
          {q}
        </Link>
      ))}
    </div>
    <p>
      Expecting a specific experiment? <RequestSearchButton query={query} />
    </p>

    <img
      src={GhostSampleImage}
      alt="Start searching"
      className="results__no-results-image img-responsive"
    />
  </div>
);

let NoSearchResultsTooManyFilters = ({
  query,
  appliedFilters,
  clearFilters,
}) => (
  <div className="results__container results__container--empty">
    <div className="results__filters">
      <ResultFilters appliedFilters={appliedFilters} />
    </div>
    <div className="results__list">
      <div className="results__no-results">
        <h2>No matching results</h2>
        <p>
          Expecting a specific experiment? <RequestSearchButton query={query} />
        </p>
        <p>Or</p>
        <p>
          Try another term or{' '}
          <Button onClick={clearFilters} buttonStyle="link">
            Clear Filters
          </Button>
        </p>
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
  null,
  {
    clearFilters,
  }
)(NoSearchResultsTooManyFilters);

let OrderingDropdown = ({ ordering, updateOrdering }) => {
  const options = [
    { label: 'Best Match', value: '' },
    { label: 'Most No. of samples', value: Ordering.MostSamples },
    { label: 'Least No. of samples', value: Ordering.LeastSamples },
    { label: 'Newest Experiment First', value: Ordering.Newest },
    { label: 'Oldest Experiment First', value: Ordering.Oldest },
  ];

  const selectedOption = options.find(x => x.value === ordering) || options[0];

  return (
    <div className="">
      Sort by{' '}
      <Dropdown
        options={options}
        selectedOption={selectedOption}
        label={x => x.label}
        onChange={x => updateOrdering(x.value)}
      />
    </div>
  );
};
OrderingDropdown = connect(
  ({ search: { ordering } }) => ({
    ordering,
  }),
  {
    updateOrdering,
  }
)(OrderingDropdown);
