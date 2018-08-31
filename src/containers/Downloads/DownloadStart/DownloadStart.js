/**
 * When a download is started the user visits the page /download?start=true
 * In this case we show a page with an email form and options to set the email and
 * start the download
 */

import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import TermsOfUse from '../../../components/TermsOfUse';
import { reduxForm, Field } from 'redux-form';
import Button from '../../../components/Button';
import { Ajax } from '../../../common/helpers';
import ProcessingImage from './download-processing.svg';
import { editEmail } from '../../../state/dataSet/actions';

/**
 * This component gets rendereded in the DataSet page, when no email has been assigned
 */
class DownloadStart extends React.Component {
  state = {
    agreedToTerms: false,
    token: null
  };

  componentDidMount() {
    const token = localStorage.getItem('refinebio-token');
    if (!!token) {
      this.setState({ token });
    }
  }

  handleAgreedToTerms = () => {
    this.setState({ agreedToTerms: !this.state.agreedToTerms });
  };

  render() {
    const { dataSetId } = this.props;
    return (
      <div className="dataset__container">
        <div className="dataset__message">
          <div>
            <Helmet>
              <title>refine.bio - Download</title>
            </Helmet>
            <h1>
              We're almost ready to start putting your download files together!
            </h1>
            <h2>
              Enter your email and we will send you the download link when your
              files are ready. It usually takes about 15-20 minutes.
            </h2>

            <EmailForm
              dataSetId={dataSetId}
              isSubmitDisabled={!this.state.agreedToTerms && !this.state.token}
              onSubmit={() => this._submitEmailForm()}
            />
            {!this.state.token && (
              <TermsOfUse
                agreedToTerms={this.state.agreedToTerms}
                handleToggle={this.handleAgreedToTerms}
              />
            )}
            <div className="dataset__image">
              <img
                src={ProcessingImage}
                alt="We're processing your download file"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  async _submitEmailForm() {
    const token = await Ajax.get('/token/');
    await Ajax.post(`/token/`, { id: token.id, is_activated: true });

    localStorage.setItem('refinebio-token', token.id);
    this.props.startDownload(token.id);
  }
}

export default DownloadStart;

/**
 * This form can be used to edit the email that's associated with a dataset
 */
let EmailForm = ({ handleSubmit, isSubmitDisabled }) => {
  return (
    <form className="form-edit-email" onSubmit={handleSubmit}>
      <Field
        component="input"
        name="email"
        type="email"
        placeholder="jdoe@example.com"
        className="input-text form-edit-email__text"
      />
      <Button text="Start Processing" isDisabled={isSubmitDisabled} />
    </form>
  );
};
EmailForm = reduxForm({
  form: 'dataSet-email-edit'
})(EmailForm);
// Set the initial value of the form components, with the email property
EmailForm = connect(
  (state, ownProps) => ({
    initialValues: {
      email: ownProps.email,
      dataSetId: ownProps.dataSetId
    }
  }),
  (dispatch, ownProps) => ({
    onSubmit: async data => {
      await dispatch(editEmail(data));
      // if there's an onSubmit callback passed execute it here.
      // This is used on instances where some component wants to be notified that the form was submitted
      ownProps.onSubmit && ownProps.onSubmit(data);
    }
  })
)(EmailForm);
