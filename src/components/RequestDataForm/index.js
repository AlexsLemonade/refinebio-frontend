import React from 'react';
import Image from 'next/image';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import Button from '../Button';
import { RadioField } from '../Radio';
import { CheckboxField } from '../Checkbox';
import MissingSampleImage from './light-missing-sample.svg';
import ResearcherLookingImage from './illustration-forms.svg';

const RequestDataForm = ({
  renderHeader,
  onSubmit,
  onClose,
  useMissingDataImage = true,
}) => {
  return (
    <div>
      <p>
        <Button text="Back" buttonStyle="secondary" onClick={onClose} />
      </p>

      <div className="search-request">
        <div className="search-request__block">
          <Formik
            initialValues={{
              accession_codes: '',
              pediatric_cancer: '',
              approach: '',
              email: '',
            }}
            onSubmit={values => onSubmit(values)}
            validationSchema={Yup.object().shape({
              pediatric_cancer: Yup.string().required(
                'Are you using this for pediatric cancer research?'
              ),
              approach: Yup.string().required(
                'Which of these most closely describes your primary approach?'
              ),
              email: Yup.string()
                .email('Please enter a valid email address')
                .required('Please enter your email address'),
            })}
          >
            {({ handleSubmit, touched, errors, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                {renderHeader && renderHeader({ touched, errors })}

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
                  {touched['approach'] && errors['approach'] && (
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
                  {touched['email'] && errors['email'] && (
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
                    onClick={onClose}
                  />
                  <Button text="Submit" type="submit" disabled={isSubmitting} />
                </div>
              </form>
            )}
          </Formik>
        </div>

        <div className="hidden-xs">
          {useMissingDataImage ? (
            <Image src={MissingSampleImage} alt="Missing sample" />
          ) : (
            <Image src={ResearcherLookingImage} alt="Missing sample" />
          )}
        </div>
      </div>
    </div>
  );
};
export default RequestDataForm;
