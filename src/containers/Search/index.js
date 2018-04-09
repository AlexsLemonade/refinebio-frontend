import React from 'react';
import { connect } from 'react-redux';

const Search = () => {
  return <div>Search bar</div>;
};

const mapStateToProps = state => {
  const { aReducer } = state;
  return {
    aReducer
  };
};

const SearchContainer = connect(mapStateToProps)(Search);

export default SearchContainer;
