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
    pagination,
    searchTerm,
    dataSet,
    isLoading: isSearching,
    searchInputForm: state.form.searchInput
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { ...resultsActions, ...downloadActions },
    dispatch
  );
};

const ResultsContainer = connect(mapStateToProps, mapDispatchToProps)(Results);

export default ResultsContainer;
