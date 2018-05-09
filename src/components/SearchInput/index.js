import React from 'react';
import { reduxForm, Field } from 'redux-form';
import Button from '../Button';
import './SearchInput.scss';

const SearchInput = ({ handleSubmit }) => {
  return (
    <form className="search-input" onSubmit={handleSubmit}>
      <Field
        component="input"
        name="search"
        type="text"
        className="search-input__textbox"
      />
      <Button text="Search" buttonStyle="secondary" />
    </form>
  );
};

export default reduxForm({
  form: 'searchInput'
})(SearchInput);
