import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';

import Head from 'next/head';
import Link from 'next/link';
import isEqual from 'lodash/isEqual';
import fromPairs from 'lodash/fromPairs';
import Result from './Result';
import ResultFilters, { anyFilterApplied } from './ResultFilters';
import SearchInput from '../../components/SearchInput';
import Pagination from '../../components/Pagination';
import BackToTop from '../../components/BackToTop';
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
  toggleFilter,
  clearFilters,
  updateResultsPerPage,
  getAccessionCodes,
  parseUrl,
} from '../../state/search/actions';
import Spinner from '../../components/Spinner';
import InfoBox from '../../components/InfoBox';
import { searchUrl } from '../../routes';
import { ApiOverwhelmed } from '../ServerError';
import { Hightlight } from '../../components/HighlightedText';
import RequestSearchButton from './RequestSearchButton';
import { SingleValueFilter } from './ResultFilters/FilterCategory';

class SearchResults extends Component {
  state = {
    hasError: this.props.hasError,
    // isLoading: false,
  };

  static async getInitialProps(ctx) {
    const searchArgs = parseUrl(ctx.query);

    let hasError = false;
    // initial fetch of results
    try {
      await ctx.reduxStore.dispatch(fetchResults(searchArgs));
    } catch {
      hasError = true;
    }

    return {
      query: searchArgs.query,
      filters: searchArgs.filters,
      hasError,
    };
  }

  resultsAreFetched() {
    const searchArgs = parseUrl(this.props.router.query);

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

  render() {
    const {
      results,
      pagination: { totalResults, currentPage, resultsPerPage },
      triggerSearch,
      updatePage,
    } = this.props;
    const totalPages = Math.ceil(totalResults / resultsPerPage);

    return (
      <div className="layout__content">
        <InfoBox />

        <div className="results">
          <Head>
            <title>{this.props.query || ''} Results - refine.bio</title>
            <meta
              name="description"
              content="Browse decades of harmonized childhood cancer data and discover how this multi-species repository accelerates the search for cures."
            />
          </Head>

          <BackToTop />
          <div className="results__search">
            <SearchInput
              searchTerm={this.props.query}
              onSubmit={query => triggerSearch(query)}
            />
          </div>

          {/* Passing `location.search` to the Loader component ensures that we call `updateResults`
          every time that the url is updated and also when the component is mounted.
          We do several checks to determine what to display, eg: no results, when no search term has
          been entered, etc */}
          {(() => {
            if (this.state.hasError) {
              return <ErrorApiUnderHeavyLoad />;
            }
            if (
              !results.length &&
              !anyFilterApplied(this.props.appliedFilters)
            ) {
              return <NoSearchResults query={this.props.query} />;
            }
            if (!results.length) {
              return (
                <NoSearchResultsTooManyFilters
                  query={this.props.query}
                  appliedFilters={this.props.appliedFilters}
                />
              );
            }

            return (
              <div className="results__container">
                <ResultsTopBar />
                <div className="results__add-samples">
                  <AddPageToDataSetButton results={results} />
                </div>
                <ResultFilters appliedFilters={this.props.appliedFilters} />
                <div className="results__list">
                  <Hightlight
                    match={[
                      this.props.query,
                      ...getAccessionCodes(this.props.query),
                    ]}
                  >
                    {results.map((result, index) => (
                      <React.Fragment key={result.accession_code}>
                        <Result result={result} query={this.props.query} />

                        {result._isTopResult &&
                          results[index + 1] &&
                          !results[index + 1]._isTopResult && (
                            <div className="results__related-block">
                              Related Results for '{this.props.query}'
                            </div>
                          )}
                      </React.Fragment>
                    ))}

                    {currentPage === totalPages && (
                      <div className="result result--note">
                        Didn't see a related experiment?{' '}
                        <RequestSearchButton query={this.props.query} />
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
          })()}
        </div>
      </div>
    );
  }
}
SearchResults = withRouter(SearchResults);
SearchResults = connect(
  ({
    search: { results, pagination, searchTerm, appliedFilters, ordering },
  }) => ({
    results,
    pagination,
    query: searchTerm,
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
      { all: true, total: result.num_downloadable_samples },
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
        <Link href="/search" as={searchUrl({ q })} key={q}>
          <a className="link results__suggestion">{q}</a>
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

function ResultsTopBar({ appliedFilters, onToggleFilter }) {
  return (
    <div className="results__top-bar">
      <div className="results__number-results">
        <NumberOfResults />
        <OrderingDropdown />

        <SingleValueFilter
          className="results__top-bar__filter"
          queryField="empty"
          filterLabel="Hide non-downloadable experiments"
          filterValue="true"
          filterActive={
            !appliedFilters['empty'] ||
            !appliedFilters['empty'].includes('true')
          }
          onToggleFilter={onToggleFilter}
        />
      </div>
    </div>
  );
}
ResultsTopBar = connect(
  ({ search: { appliedFilters } }) => ({
    appliedFilters,
  }),
  {
    onToggleFilter: toggleFilter,
  }
)(ResultsTopBar);
