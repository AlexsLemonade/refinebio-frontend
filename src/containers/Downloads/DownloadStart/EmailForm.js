import React from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import Checkbox, { CheckboxField } from '../../../components/Checkbox';
import Button from '../../../components/Button';
import { Link } from 'react-router-dom';

/**
 * This form can be used to edit the email that's associated with a dataset
 */
let EmailForm = ({ handleSubmit, isSubmitDisabled, agreedToTerms }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-edit-email">
        <Field
          component="input"
          name="email"
          type="email"
          placeholder="jdoe@example.com"
          className="input-text form-edit-email__input mobile-p"
        />
        <div className="flex-button-container">
          <Button text="Start Processing" isDisabled={isSubmitDisabled} />
        </div>
      </div>
      {!agreedToTerms && (
        <div>
          <Field component={CheckboxField} name="termsOfService">
            I agree to the{' '}
            <Link
              to="/terms"
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Use
            </Link>
          </Field>
        </div>
      )}
      <div>
        <Field component={CheckboxField} name="receiveUpdates">
          I would like to receive occasional updates from the refine.bio team
        </Field>
      </div>
    </form>
  );
};
const EMAIL_FORM = 'dataSet-email-edit';
EmailForm = reduxForm({
  form: EMAIL_FORM
})(EmailForm);
// selecting values from form https://redux-form.com/7.4.2/examples/selectingformvalues/
const fieldSelector = formValueSelector(EMAIL_FORM);
// Set the initial value of the form components, with the email property
EmailForm = connect((state, ownProps) => ({
  isSubmitDisabled:
    !ownProps.agreedToTerms ||
    (!ownProps.agreedToTerms && !fieldSelector(state, 'termsOfService')),
  initialValues: {
    email: ownProps.email
  }
}))(EmailForm);

export default EmailForm;
