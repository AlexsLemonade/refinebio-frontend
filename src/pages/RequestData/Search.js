import React from 'react';
import { Redirect } from 'react-router-dom';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import Button from '../../components/Button';
import { RadioField } from '../../components/Radio';
import { CheckboxField } from '../../components/Checkbox';
import MissingSampleImage from './light-missing-sample.svg';
import './RequestData.scss';
import { postToSlack } from '../../common/helpers';
import { push, goBack } from '../../state/routerActions';

let SearchRequestData = ({ push, goBack, location: { search, state } }) => {
  const query = (state && state.query) || '';

  return (
    <div>
      <p>
        <Button text="Back" buttonStyle="secondary" onClick={goBack} />
      </p>

      <div className="search-request">
        <div className="search-request__block">
          <Formik
            initialValues={{
              accession_codes: '',
              pediatric_cancer: '',
              approach: '',
              email: ''
            }}
            onSubmit={async (values, actions) => {
              await submitDataRequest(query, values);
              push({
                pathname: state.continueTo || '/',
                state: {
                  message: 'Request for Experiment Received!'
                }
              });
            }}
            validationSchema={Yup.object().shape({
              accession_codes: Yup.string().required(
                'Please list the experiment accession codes here'
              ),
              pediatric_cancer: Yup.string().required(
                'Are you using this for pediatric cancer research?'
              ),
              approach: Yup.string().required(
                'Which of these most closely describes your primary approach?'
              ),
              email: Yup.string()
                .email('Please enter a valid email address')
                .required('Please enter your email address')
            })}
          >
            {({ handleSubmit, touched, errors, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <h1 className="search-request__title">
                  Tell us what’s missing
                </h1>

                <div className="search-request__section">
                  <div className="search-request__label">
                    List experiment accessions (separated by commas) you expect
                    for search term ‘<b>{query}</b>’{' '}
                    <span className="search-request__required">(required)</span>
                  </div>
                  <div className="search-request__note">
                    Only accessions from GEO, SRA, and ArrayExpress are
                    accepted.
                  </div>
                  {touched['accession_codes'] &&
                    errors['accession_codes'] && (
                      <div className="color-error">
                        {errors['accession_codes']}
                      </div>
                    )}
                  <Field
                    type="text"
                    name="accession_codes"
                    className="input-text"
                  />
                  <div className="search-request__example">
                    Example: GSE3303, E-MEXP-3405, SRP2422
                  </div>
                </div>

                <div className="search-request__subtitle">
                  Help us priortize your request by answering these questions
                </div>

                <div className="search-request__section">
                  <div className="search-request__label">
                    Are you using this for pediatric cancer research?{' '}
                    <span className="search-request__required">(required)</span>
                  </div>

                  {touched['pediatric_cancer'] &&
                    errors['pediatric_cancer'] && (
                      <div className="color-error">
                        {errors['pediatric_cancer']}
                      </div>
                    )}
                  <fieldset>
                    <Field
                      component={RadioField}
                      name="pediatric_cancer"
                      label="Yes"
                      value="Yes"
                    />
                    <Field
                      component={RadioField}
                      name="pediatric_cancer"
                      label="No"
                      value="No"
                    />
                  </fieldset>
                </div>

                <div className="search-request__section">
                  <div className="search-request__label">
                    Which of these most closely describes your primary approach?{' '}
                    <span className="search-request__required">(required)</span>
                  </div>
                  {touched['approach'] &&
                    errors['approach'] && (
                      <div className="color-error">{errors['approach']}</div>
                    )}
                  <fieldset>
                    <Field
                      component={RadioField}
                      name="approach"
                      label="Bench Research"
                      value="Bench Research"
                    />
                    <Field
                      component={RadioField}
                      name="approach"
                      label="Computational Research"
                      value="Computational Research"
                    />
                    <Field
                      component={RadioField}
                      name="approach"
                      label="Clinical Research"
                      value="Clinical Research"
                    />
                    <Field
                      component={RadioField}
                      name="approach"
                      label="AI/ML Research"
                      value="AI/ML Research"
                    />
                  </fieldset>
                </div>

                <div className="search-request__section">
                  <div className="search-request__label">
                    Is there anything else you would like to add?
                  </div>
                  <Field component="textarea" name="comments" />
                </div>

                <div className="search-request__section">
                  <div className="search-request__label">
                    Email{' '}
                    <span className="search-request__required">(required)</span>
                  </div>
                  <div className="search-request__note">
                    Be notified when your requested experiment(s) become
                    available
                  </div>
                  {touched['email'] &&
                    errors['email'] && (
                      <div className="color-error">{errors['email']}</div>
                    )}
                  <Field type="text" name="email" className="input-text" />
                  <Field
                    component={CheckboxField}
                    name="email_updates"
                    value={false}
                    label="I would like to receive occasional updates from the refine.bio team"
                  />
                </div>

                <div className="search-request__actions">
                  <Button
                    text="Cancel"
                    buttonStyle="secondary"
                    onClick={goBack}
                  />
                  <Button text="Submit" type="submit" disabled={isSubmitting} />
                </div>
              </form>
            )}
          </Formik>
        </div>

        <div className="hidden-xs">
          <img src={MissingSampleImage} alt="Missing sample" />
        </div>
      </div>
    </div>
  );
};
SearchRequestData = connect(
  null,
  { push, goBack }
)(SearchRequestData);
export default SearchRequestData;

async function submitDataRequest(query, values) {
  let { ip } = await (await fetch('https://api.ipify.org?format=json')).json();

  await postToSlack({
    attachments: [
      {
        fallback: `Missing data for search term '${query}'`,
        color: '#2eb886',
        title: `Missing data for search term '${query}'`,
        title_link: `https://www.refine.bio/search?q=${query}`,
        fields: [
          {
            title: 'Accession Codes',
            value: values.accession_codes,
            short: true
          },
          {
            title: 'Pediatric Cancer Research',
            value: values.pediatric_cancer,
            short: true
          },
          {
            title: 'Primary Approach',
            value: values.approach,
            short: true
          },
          {
            title: 'Email',
            value: `${values.email}${
              values.email_updates ? ' _(wants updates)_' : ''
            }`,
            short: false
          },
          ...(values.comments
            ? [
                {
                  title: 'Additional Notes',
                  value: values.comments,
                  short: false
                }
              ]
            : [])
        ],
        footer: `Refine.bio | ${ip} | ${navigator.userAgent}`,
        footer_icon: 'https://s3.amazonaws.com/refinebio-email/logo-2x.png',
        ts: Date.now() / 1000 // unix time
      }
    ]
  });
}
