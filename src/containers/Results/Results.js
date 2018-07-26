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
import { PAGE_SIZES } from '../../constants/table';
import StartSearchingImage from '../../common/images/start-searching.svg';
import GhostSampleImage from '../../common/images/ghost-sample.svg';
import { Link } from 'react-router-dom';

class Results extends Component {
  componentDidMount() {
    this.handleInit(this.props);
    document.title = 'refine.bio - Results';
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.search !== nextProps.location.search) {
      this.handleInit(nextProps);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.results !== this.props.results) window.scrollTo(0, 0);
  }

  handleInit = props => {
    const { location } = props;

    const queryObject = getQueryParamObject(location.search.substr(1));
    const { q, p, ...filters } = queryObject;

    if (q) {
      const query = decodeURIComponent(q);
      props.fetchResults(query, p, filters);
      props.fetchOrganisms();
    }
  };

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

        {isLoading ? (
          <div className="loader" />
        ) : !results.length ? (
          <EmptyStates searchTerm={searchTerm} />
        ) : (
          <div className="results__container">
            <div className="results__filters">
              <ResultFilters
                organisms={organisms}
                toggledFilter={toggledFilter}
                filters={filters}
                appliedFilters={appliedFilters}
              />
            </div>
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
          </div>
        )}
      </div>
    );
  }
}

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
  ({ search: { pagination: { totalResults, resultsPerPage } } }) => ({
    totalResults,
    resultsPerPage
  }),
  { updateResultsPerPage },
  null,
  { pure: false }
)(NumberOfResults);

const EmptyStates = ({ searchTerm }) => {
  const title = !!searchTerm ? 'No matching results' : 'Try searching for';
  const imageSrc = !!searchTerm ? GhostSampleImage : StartSearchingImage;
  const imageAlt = !!searchTerm ? 'No matching results' : 'Start searching';

  return (
    <div className="results__no-results">
      <h2>{title}</h2>
      {!!searchTerm ? (
        <h3>
          Try another term or{' '}
          <Link className="link" to={`/results?q=${searchTerm}`}>
            Clear Filters
          </Link>
        </h3>
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
