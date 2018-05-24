import React, { Component } from 'react';
import Result from './Result';
import ResultFilter from './ResultFilter';
import SearchInput from '../../components/SearchInput';
import Pagination from '../../components/Pagination';
import Button from '../../components/Button';
import { getQueryParamObject } from '../../common/helpers';
import './Results.scss';

class BackToTop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeClass: false
    };
  }
  componentDidMount() {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset >= window.innerHeight / 2) {
        this.setState({
          activeClass: true
        });
      } else {
        this.setState({
          activeClass: false
        });
      }
    });
  }
  render() {
    return (
      <Button
        buttonStyle="plain"
        className={`back-to-top ${
          this.state.activeClass ? 'back-to-top--active' : ''
        }`}
        onClick={() => window.scrollTo(0, 0)}
      >
        <i className="back-to-top__icon" />Back to Top
      </Button>
    );
  }
}

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

  render() {
    const {
      results,
      organisms,
      toggledFilter,
      addedExperiment,
      removedExperiment,
      filters,
      searchTerm,
      dataSet,
      isLoading,
      pagination: { totalPages, totalResults, resultsPerPage, currentPage }
    } = this.props;

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
