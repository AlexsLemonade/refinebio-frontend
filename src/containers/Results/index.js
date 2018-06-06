import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as resultsActions from '../../state/search/actions';
import * as downloadActions from '../../state/download/actions';

import Results from './Results';

const mapStateToProps = state => {
  const {
    search: {
      results,
      organisms,
      filters,
      appliedFilters,
      pagination,
      searchTerm,
      isSearching
    },
    download: { dataSet }
  } = state;
  return {
    results,
    organisms,
    filters,
    appliedFilters,
    pagination,
    searchTerm,
    dataSet,
    isLoading: isSearching,
    searchInputForm: state.form.searchInput
  };
};

const ResultsContainer = connect(mapStateToProps, {
  ...resultsActions,
  ...downloadActions
})(Results);

export default ResultsContainer;
