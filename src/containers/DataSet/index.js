import React from 'react';
import { asyncFetch } from '../../common/helpers';
import Loader from '../../components/Loader';
import { isAbsolute } from 'upath';
import ProcessingImage from './download-processing.svg';
import NextStepsImage from './download-next-steps.svg';
import './DataSet.scss';
import { reduxForm, Field } from 'redux-form';
import Button from '../../components/Button';
import { connect } from 'react-redux';
import { editEmail, fetchDataSet } from '../../state/dataSet/actions';

/**
 * Dataset page, has 3 states that correspond with the states on the backend
 * - Processing: The download file is being created
 * - Processed: The download file is ready
 * - Expired: Download files expire after some time
 * Related discussion https://github.com/AlexsLemonade/refinebio-frontend/issues/27
 */
class DataSet extends React.Component {
  render() {
    const dataSetId = this.props.match.params.id;

    return (
      <Loader fetch={() => this.props.fetchDataSet(dataSetId)}>
        {({ isLoading }) =>
          isLoading ? (
            <div className="loader" />
          ) : (
            <div className="dataset__container">
              <DataSetPage {...this.props.dataSet} />
            </div>
          )
        }
      </Loader>
    );
  }
}
DataSet = connect(({ dataSet }) => ({ dataSet }), {
  fetchDataSet
})(DataSet);
export default DataSet;

/**
 *
 */
function DataSetPage({
  email_address,
  expires_on,
  id,
  is_available,
  is_processed,
  is_processing,
  last_modified,
  s3_bucket,
  s3_key
}) {
  // 1. Check if the dataset is already processed, if true show a link to the download file
  if (is_processed) {
    if (is_available) {
      const downloadLink = getAmazonDownloadLinkUrl(s3_bucket, s3_key);
      return (
        <div>
          <h1>Your dataset is ready</h1>
          Download: <a href={downloadLink}>{downloadLink}</a>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Sorry this download link already expired.</h1>
        </div>
      );
    }
  } else {
    // 2. if it's not ready to be downloaded, then allow the user to set an email and receive an alert when its ready
    if (!email_address) {
      return (
        <div>
          <h1>
            We’re putting your download file together. It usually takes 15- 20
            minutes.
          </h1>
          <h2>
            Enter your email and we will email you when the files are ready for
            download.
          </h2>

          <EmailForm email="pepe@gmail.com" dataSetId={id} />

          <div className="dataset__image">
            <img src={ProcessingImage} />
          </div>
        </div>
      );
    } else {
      // 3. Allow the user to change its email if it's already added
      return (
        <div>
          <h1>Your dataset is on the way!</h1>
          <p>We have sent a confirmation email to {email_address}</p>
          <p>If you haven’t recevied it, please check your spam folders.</p>
        </div>
      );
    }
  }
}

/**
 * This form can be used to edit the email that's associated with a dataset
 */
function EmailForm({ handleSubmit }) {
  return (
    <form className="form-edit-email" onSubmit={handleSubmit}>
      <Field
        component="input"
        name="email"
        type="email"
        placeholder="jdoe@example.com"
        className="input-text form-edit-email__text"
      />
      <Button text="Submit" />
    </form>
  );
}
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
  {
    onSubmit: editEmail
  }
)(EmailForm);

function getAmazonDownloadLinkUrl(s3_bucket, s3_key) {
  return `https://s3.amazonaws.com/${s3_bucket}/${s3_key}`;
}
