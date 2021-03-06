import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import classnames from 'classnames';
import Button from '../Button';
import Error from '../Error';

export default function JumpToPageForm({ onPaginate, totalPages }) {
  return (
    <Formik
      initialValues={{ page: '' }}
      onSubmit={({ page }, { resetForm }) => {
        onPaginate(page);
        resetForm();
      }}
      validationSchema={Yup.object().shape({
        page: Yup.number()
          .required('Please enter a valid page number')
          .min(1, 'Page number must be greater than 1')
          .max(totalPages, `Page number must be lower than ${totalPages + 1}`),
      })}
    >
      {({ touched, errors }) => (
        <Form>
          <label htmlFor="page">
            Jump to page
            <div className="input-wrap">
              {touched.page && errors.page ? (
                <Error className="input-wrap__error">{errors.page}</Error>
              ) : null}
              <Field
                name="page"
                className={classnames('pagination__input input', {
                  'input--error': touched.page && errors.page,
                })}
                type="number"
              />
            </div>
          </label>
          <Button
            type="submit"
            buttonStyle="secondary"
            className="pagination__button"
            text="Go"
          />
        </Form>
      )}
    </Formik>
  );
}
