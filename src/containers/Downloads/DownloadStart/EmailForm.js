import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import classnames from 'classnames';
import Checkbox from '../../../components/Checkbox';
import Button from '../../../components/Button';
import { InvalidTokenError } from '../../../common/errors';

/**
 * This form can be used to edit the email that's associated with a dataset
 */
let EmailForm = ({ onSubmit, isSubmitDisabled, agreedToTerms }) => (
  <Formik
    onSubmit={async (values, { setError, setValues, setSubmitting }) => {
      try {
        await onSubmit(values);
      } catch (e) {
        // expect server errors here
        if (e instanceof InvalidTokenError) {
          setError({
            termsOfService:
              'Please accept our terms of use to process and download data'
          });
          setValues({
            email: values.email,
            termsOfService: false
          });
          setSubmitting(false);
        } else {
          // rethrow the exception
          throw e;
        }
      }
    }}
    initialValues={{
      receiveUpdates: true,
      email: '',
      termsOfService: agreedToTerms
    }}
    validationSchema={Yup.object().shape({
      email: Yup.string()
        .email('Please enter a valid email')
        .required('Please enter your email address'),
      termsOfService: Yup.bool().oneOf(
        [true],
        'Please accept our terms of use to process and download data'
      )
    })}
  >
    {({ values, handleChange, touched, errors }) => (
      <Form>
        <div>
          {touched.email && errors.email ? (
            <p className="color-error">
              <i className="ion-alert-circled" /> {errors.email}
            </p>
          ) : null}
        </div>
        <div className="form-edit-email">
          <div className="input-wrap">
            <Field
              name="email"
              type="email"
              placeholder="jdoe@example.com"
              className={classnames(
                'input-text form-edit-email__input mobile-p',
                { 'input--error': touched.email && errors.email }
              )}
            />
          </div>

          <div className="flex-button-container">
            <Button text="Start Processing" type="submit" />
          </div>
        </div>
        <div className={classnames({ hidden: agreedToTerms })}>
          {errors.termsOfService && (
            <p className="color-error">
              <i className="ion-alert-circled" /> {errors.termsOfService}
            </p>
          )}
          <Checkbox
            name="termsOfService"
            checked={values.termsOfService}
            onChange={handleChange}
          >
            I agree to the{' '}
            <Link
              to="/terms"
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Use
            </Link>
          </Checkbox>
        </div>
        <div>
          <Checkbox
            name="receiveUpdates"
            checked={values.receiveUpdates}
            onChange={handleChange}
          >
            I would like to receive occasional updates from the refine.bio team
          </Checkbox>
        </div>
      </Form>
    )}
  </Formik>
);

export default EmailForm;
