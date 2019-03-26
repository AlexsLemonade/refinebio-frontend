import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import Button from '../../components/Button';
import Radio, { RadioField } from '../../components/Radio';
import { CheckboxField } from '../../components/Checkbox';
import MissingSampleImage from './light-missing-sample.svg';
import './RequestData.scss';

export default function SearchRequestData({}) {
  return (
    <div>
      <p>
        <Button text="Back" buttonStyle="secondary" />
      </p>

      <div className="search-request">
        <div className="search-request__block">
          <Formik
            initialValues={{
              search: '',
              pediatric_cancer: '',
              approach: '',
              email: ''
            }}
            onSubmit={(values, actions) => {
              setTimeout(() => {
                console.log(JSON.stringify(values, null, 2));
                actions.setSubmitting(false);
              }, 500);
            }}
            validationSchema={Yup.object().shape({
              search: Yup.string().required(
                'Please list the experiment accession codes here'
              ),
              pediatric_cancer: Yup.bool().required(
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
                    for search term ‘<b>mmp3</b>’{' '}
                    <span className="search-request__required">(required)</span>
                  </div>
                  <div className="search-request__note">
                    Only accessions from GEO, SRA, and ArrayExpress are
                    accepted.
                  </div>
                  {touched['search'] &&
                    errors['search'] && (
                      <div className="color-error">{errors['search']}</div>
                    )}
                  <Field type="text" name="search" className="input-text" />
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
                      value={true}
                    />
                    <Field
                      component={RadioField}
                      name="pediatric_cancer"
                      label="No"
                      value={false}
                    />
                  </fieldset>
                </div>

                <div className="search-request__section">
                  <div className="search-request__label">
                    Which of these most closely describes your primary approach?
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
                      value="bench research"
                    />
                    <Field
                      component={RadioField}
                      name="approach"
                      label="Computational Research"
                      value="computational research"
                    />
                    <Field
                      component={RadioField}
                      name="approach"
                      label="Clinical Research"
                      value="clinical research"
                    />
                    <Field
                      component={RadioField}
                      name="approach"
                      label="AI/ML Research"
                      value="ai/ml research"
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

                <Button text="Submit" type="submit" disabled={isSubmitting} />
              </form>
            )}
          </Formik>
        </div>

        <div>
          <img src={MissingSampleImage} />
        </div>
      </div>
    </div>
  );
}
