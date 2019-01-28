import React, { Component } from 'react';
import { getRange } from '../../common/helpers';
import './Pagination.scss';
import Button from '../Button';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import classnames from 'classnames';

class Pagination extends Component {
  getPaginationRange(currentPage, totalPages) {
    if (currentPage <= 2) {
      return [2, 3];
    } else if (currentPage >= totalPages - 1) {
      return [totalPages - 2, totalPages - 1];
    } else {
      return [currentPage - 1, currentPage, currentPage + 1];
    }
  }

  renderPages() {
    const { totalPages, onPaginate, currentPage } = this.props;

    const pageArray =
      totalPages < 5
        ? getRange(totalPages)
        : this.getPaginationRange(currentPage, totalPages);

    return (
      <span>
        {totalPages < 5 ? null : (
          <span>
            <button
              onClick={() => onPaginate(1)}
              className={`pagination__page ${
                currentPage === 1 ? 'pagination__page--active' : ''
              }`}
            >
              1
            </button>
            {currentPage > 3 && (
              <span className="pagination__ellipsis">...</span>
            )}
          </span>
        )}
        {pageArray.map((page, i) => {
          return (
            <button
              key={i}
              onClick={() => onPaginate(page)}
              className={`pagination__page ${
                currentPage === page ? 'pagination__page--active' : ''
              }`}
            >
              {page}
            </button>
          );
        })}
        {totalPages < 5 ? null : (
          <span>
            {currentPage < totalPages - 2 && (
              <span className="pagination__ellipsis">...</span>
            )}
            <button
              onClick={() => onPaginate(totalPages)}
              className={`pagination__page ${
                currentPage === totalPages ? 'pagination__page--active' : ''
              }`}
            >
              {totalPages}
            </button>
          </span>
        )}
      </span>
    );
  }

  render() {
    const { onPaginate, totalPages, currentPage } = this.props;

    if (totalPages <= 1) return null;
    return (
      <div className="pagination">
        <div className="mobile-p">
          <button
            onClick={() => onPaginate(currentPage - 1)}
            disabled={currentPage <= 1}
            className="pagination__ends"
          >
            &lt; Previous
          </button>
          {this.renderPages()}
          <button
            onClick={() => onPaginate(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="pagination__ends"
          >
            Next &gt;
          </button>
        </div>
        <div className="pagination__jumper">
          <JumpToPageForm onPaginate={onPaginate} totalPages={totalPages} />
        </div>
      </div>
    );
  }
}

export default Pagination;

function JumpToPageForm({ onPaginate, totalPages }) {
  return (
    <Formik
      initialValues={{ page: '' }}
      onSubmit={({ page }) => onPaginate(page)}
      validationSchema={Yup.object().shape({
        page: Yup.number()
          .required('Please enter a valid page number')
          .min(1, 'Page number must be greater than 1')
          .max(totalPages, 'Page number must be lower than ' + totalPages)
      })}
    >
      {({ isSubmitting, touched, errors, values }) => (
        <Form>
          <label>
            Jump to page
            <div className="input-wrap">
              {touched.page && errors.page ? (
                <div className="input-wrap__error">
                  <i className="ion-alert-circled" /> {errors.page}
                </div>
              ) : null}
              <Field
                name="page"
                className={classnames('pagination__input input', {
                  'input--error': touched.page && errors.page
                })}
                type="number"
              />
            </div>
          </label>
          <Button
            type="submit"
            isDisabled={isSubmitting}
            buttonStyle="secondary"
            className="pagination__button"
            text="Go"
          />
        </Form>
      )}
    </Formik>
  );
}
