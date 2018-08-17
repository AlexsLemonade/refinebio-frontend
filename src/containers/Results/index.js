import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as resultsActions from '../../state/search/actions';
import * as downloadActions from '../../state/download/actions';
import Helmet from 'react-helmet';
import Result, { RemoveFromDatasetButton, AddToDatasetButton } from './Result';
import ResultFilters from './ResultFilters';
import SearchInput from '../../components/SearchInput';
import Pagination from '../../components/Pagination';
import Button from '../../components/Button';
import BackToTop from '../../components/BackToTop';
import { getQueryParamObject } from '../../common/helpers';
import './Results.scss';
import { updateResultsPerPage, triggerSearch } from '../../state/search/actions';
import Dropdown from '../../components/Dropdown';
import { PAGE_SIZES } from '../../constants/table';
import StartSearchingImage from '../../common/images/start-searching.svg';
import GhostSampleImage from '../../common/images/ghost-sample.svg';
import { Link } from 'react-router-dom';

class Results extends Component {
  state = {isLoading: true, query: '', page: 1, filters: {}};

  componentDidMount() {
    this.handleInit();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.handleInit();
    }

    // reset scroll position when the results change
    if (prevProps.results !== this.props.results) {
      window.scrollTo(0, 0);
    }
  }

  async handleInit() {
    const { location } = this.props;
    const queryObject = getQueryParamObject(location.search.substr(1));
    let { q: query, p: page, size, ...filters } = queryObject;

    // for consistency, ensure all values in filters are arrays
    // the method getQueryParamObject will return a single value for parameters that only
    // appear once in the url
    for (let key of Object.keys(filters)) {
      if (!Array.isArray(filters[key])) {
        filters[key] = [filters[key]];
      }
    }

    // parse parameters from url
    query = decodeURIComponent(query);
    page = parseInt(page || 1, 10);
    size = parseInt(size || 10, 10);

    this.setState({query, page, filters, isLoading: true});    

    await this.props.fetchResults({query, page, size, filters});
    const organisms = await this.props.fetchOrganisms();

    this.setState({organisms, isLoading: false});
  };

  handleSubmit = values => {
    // When a new search is made, return to the first page and clear the filters
    this.props.triggerSearch(values.search);
  };

  handlePagination = page => {
    this.props.updatePage(page);
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
      toggledFilter,
      addExperiment,
      removeExperiment,
      filters: filtersData,
      dataSet,
      isLoading,
      pagination: { totalPages, currentPage }
    } = this.props;

    const totalSamplesOnPage = results.reduce(
      (sum, result) => sum + result.samples.length,
      0
    );

    const samplesAdded = results.reduce(
      (sum, result) =>
        dataSet[result.accession_code]
          ? sum + dataSet[result.accession_code].length
          : sum,
      0
    );

    return (
      <div className="results">
        <Helmet>
          <title>refine.bio - Results</title>
        </Helmet>

        <BackToTop />
        <div className="results__search">
          <SearchInput onSubmit={this.handleSubmit} searchTerm={searchTerm} />
        </div>

        {isLoading || this.state.isLoading ? (
          <div className="loader" />
        ) : !results.length ? (
          <EmptyStates searchTerm={searchTerm} />
        ) : (
          <div className="results__container">
            <div className="results__filters">
              <ResultFilters
                organisms={this.state.organisms}
                toggledFilter={toggledFilter}
                filters={filtersData}
                appliedFilters={this.state.filters}
              />
            </div>
            <div className="results__list">
              <div className="results__top-bar">
                {results.length ? <NumberOfResults /> : null}
                {totalSamplesOnPage - samplesAdded === 0 ? (
                  <RemoveFromDatasetButton
                    totalAdded={totalSamplesOnPage}
                    handleRemove={this.handlePageRemove}
                  />
                ) : (
                  <AddToDatasetButton
                    addMessage="Add Page to Dataset"
                    handleAdd={() => {
                      addExperiment(results);
                    }}
                    samplesInDataset={samplesAdded}
                    buttonStyle="secondary"
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
          </div>
        )}
      </div>
    );
  }
}
Results = connect(
  ({
    search: {
      results,
      filters,
      pagination,
      searchTerm,
      isSearching
    },
    download: { dataSet }
  }) => ({
    results,
    filters,
    pagination,
    searchTerm,
    dataSet,
    isLoading: isSearching,
  }), {
  ...resultsActions,
  ...downloadActions
})(Results);

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
  ({
    search: {
      pagination: { totalResults, resultsPerPage }
    }
  }) => ({
    totalResults,
    resultsPerPage
  }),
  { updateResultsPerPage },
)(NumberOfResults);

const EmptyStates = ({ searchTerm, appliedFilters }) => {
  const title = !!searchTerm ? 'No matching results' : 'Try searching for';
  const imageSrc = !!searchTerm ? GhostSampleImage : StartSearchingImage;
  const imageAlt = !!searchTerm ? 'No matching results' : 'Start searching';

  return (
    <div className="results__no-results">
      <h2>{title}</h2>
      {!!searchTerm ? (
        !!appliedFilters ? (
          <h3>
            Try another term or{' '}
            <Link className="link" to={`/results?q=${searchTerm}`}>
              Clear Filters
            </Link>
          </h3>
        ) : (
          <h3>Try another term</h3>
        )
      ) : (
        <div className="results__suggestions">
          <Link className="link results__suggestion" to="/results?q=Notch">
            Notch
          </Link>
          <Link
            className="link results__suggestion"
            to="/results?q=medulloblastoma"
          >
            Medulloblastoma
          </Link>
          <Link className="link results__suggestion" to="/results?q=GSE16476">
            GSE16476
          </Link>
        </div>
      )}
      <img
        src={imageSrc}
        alt={imageAlt}
        className="results__no-results-image"
      />
    </div>
  );
};



