import React from 'react';
import classnames from 'classnames';
import * as Yup from 'yup';
import { Formik, Field, Form } from 'formik';
import { Ajax } from '../../common/helpers';
import Button from '../../components/Button';
import Error from '../../components/Error';

export default function EmailSection() {
  const [email, setEmail] = React.useState(null);
  const portalId = '5187852';
  const formGuid = '2a5f706e-eca8-45c0-a9f4-b1584c8c160a';
  const formUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;
  const getFormData = submitEmail => ({
    fields: [
      {
        name: 'email',
        value: submitEmail,
      },
    ],
    // "context": {
    // "hutk": ":hutk",
    // "pageUri": window.location.host + window.location.pathname,
    // "pageName": document.title,
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      await Ajax.post(formUrl, getFormData(values.email));
      setEmail(values.email);
    } catch (e) {
      setEmail(null);
    }
    setSubmitting(false);
  };

  return (
    <div className="main__container">
      <div className="main__heading-1">
        {email ? 'Thanks' : 'Sign Up for Updates'}
      </div>
      <div className="main__blurp-text">
        {email ? (
          <span>
            {' '}
            Thank you for subscribing. Updates will be sent to{' '}
            <span style={{ color: '#f3e503' }}>{email}</span>
          </span>
        ) : (
          'Be the first to know about new features, compendia releases, and more!'
        )}
      </div>
      {/* Email Subscribe Form */}
      <div id="email-form">
        <Formik
          onSubmit={handleSubmit}
          initialValues={{ email: '' }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email('Please enter a valid email')
              .required('Please enter your email address'),
          })}
        >
          {({ values, isSubmitting, handleChange, touched, errors }) => (
            <Form>
              <div
                id="embed_signup_scroll"
                className="main__email-section-form"
              >
                <Field
                  type="email"
                  name="email"
                  placeholder="email address"
                  className={classnames(
                    'input-text main__email-section-input',
                    { 'input-error': touched.email && errors.email }
                  )}
                />
                <div className="flex-button-container">
                  <Button
                    type="submit"
                    text="Subscribe"
                    isDisabled={isSubmitting}
                    className="button--inverted main__email-section-button"
                  />
                </div>
              </div>
              <div className="main__email-section-error-container">
                {touched.email && errors.email && <Error>{errors.email}</Error>}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
