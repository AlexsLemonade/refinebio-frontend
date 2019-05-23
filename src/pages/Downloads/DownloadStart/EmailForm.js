import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import classnames from 'classnames';
import Checkbox from '../../../components/Checkbox';
import Button from '../../../components/Button';
import { InvalidTokenError } from '../../../common/errors';
import Error from '../../../components/Error';

/**
 * This form can be used to edit the email that's associated with a dataset
 */
const EmailForm = ({ onSubmit, agreedToTerms, emailAddress }) => (
  <Formik
    onSubmit={async (values, { setErrors, setValues, setSubmitting }) => {
      try {
        await onSubmit(values);
      } catch (e) {
        // expect server errors here
        if (e instanceof InvalidTokenError) {
          setErrors({
            termsOfService:
              'Please accept our terms of use to process and download data',
          });
          setValues({
            email: values.email,
            termsOfService: false,
            receiveUpdates: true,
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
      email: emailAddress,
      termsOfService: agreedToTerms,
    }}
    validationSchema={Yup.object().shape({
      email: Yup.string()
        .email('Please enter a valid email')
        .required('Please enter your email address'),
      termsOfService: Yup.bool().oneOf(
        [true],
        'Please accept our terms of use to process and download data'
      ),
    })}
  >
    {({ values, isSubmitting, handleChange, touched, errors }) => (
      <Form>
        <div>
          {touched.email && errors.email ? <Error>{errors.email}</Error> : null}
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
            <Button
              text="Start Processing"
              type="submit"
              isDisabled={isSubmitting}
            />
          </div>
        </div>
        {!agreedToTerms && (
          <div>
            {errors.termsOfService && <Error>{errors.termsOfService}</Error>}
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
        )}
        {(emailAddress === '' || values.email !== emailAddress) && (
          <div>
            <Checkbox
              name="receiveUpdates"
              checked={values.receiveUpdates}
              onChange={handleChange}
            >
              I would like to receive occasional updates from the refine.bio
              team
            </Checkbox>
          </div>
        )}
      </Form>
    )}
  </Formik>
);

export default EmailForm;
