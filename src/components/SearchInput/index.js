import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import Button from '../Button';
import './SearchInput.scss';
import { InputField } from '../Input';

class SearchInput extends Component {
  componentWillUpdate = nextProps => {
    if (nextProps.searchTerm !== this.props.searchTerm)
      this.handleInitialize(nextProps.searchTerm);
  };

  handleInitialize(searchTerm) {
    const initData = {
      search: searchTerm
    };

    this.props.initialize(initData);
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <form className="search-input" onSubmit={handleSubmit}>
        <Field
          component={InputField}
          name="search"
          className="search-input__textbox"
        />
        <Button text="Search" buttonStyle="secondary" />
      </form>
    );
  }
}

export default reduxForm({
  form: 'searchInput'
})(SearchInput);
