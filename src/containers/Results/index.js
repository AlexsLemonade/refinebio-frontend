import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as resultsActions from '../../state/search/actions';

import Results from './Results';

const mapStateToProps = state => {
  const { search: { results, organisms, filters, pagination } } = state;
  return {
    results,
    organisms,
    filters,
    pagination,
    searchInputForm: state.form.searchInput
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(resultsActions, dispatch);
};

const ResultsContainer = connect(mapStateToProps, mapDispatchToProps)(Results);

export default ResultsContainer;
