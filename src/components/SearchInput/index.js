import React, { Component } from 'react';
import { Formik, Field, Form } from 'formik';
import Button from '../Button';
import './SearchInput.scss';

export default class SearchInput extends Component {
  static defaultProps = {
    searchTerm: '',
    buttonStyle: 'secondary'
  };

  formik = React.createRef();

  componentDidUpdate(prevProps) {
    if (prevProps.searchTerm !== this.props.searchTerm && this.formik.current) {
      this.formik.current.resetForm();
    }
  }

  render() {
    return (
      <Formik
        ref={this.formik}
        initialValues={{ search: this.props.searchTerm }}
        onSubmit={({ search }) => this.props.onSubmit(search.trim())}
      >
        {() => (
          <Form className="search-input">
            <Field
              type="text"
              name="search"
              className="input-text input-lg search-input__textbox"
            />
            <div className="flex-button-container">
              <Button
                type="submit"
                text="Search"
                buttonStyle={this.props.buttonStyle}
                className="search-input__button"
              />
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}
