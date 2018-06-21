import React from 'react';
import { getAmazonDownloadLinkUrl } from '../../common/helpers';
import Loader from '../../components/Loader';
import ProcessingImage from './download-processing.svg';
import NextStepsImage from './download-next-steps.svg';
import './DataSet.scss';
import { reduxForm, Field } from 'redux-form';
import Button from '../../components/Button';
import { connect } from 'react-redux';
import { editEmail, fetchDataSet } from '../../state/dataSet/actions';
import ModalManager from '../../components/Modal/ModalManager';

import ProcessingDataset from '@haiku/dvprasad-processingdataset/react';

import ViewDownload from '../Downloads/ViewDownload';

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
            <div>
              <div className="dataset__container">
                <div className="dataset__message">
                  <DataSetPage dataSetId={dataSetId} {...this.props.dataSet} />
                </div>
              </div>
              {dataSetId &&
                !this.props.dataSet.is_processed &&
                !!this.props.dataSet.email_address && (
                  <ViewDownload dataSetId={dataSetId} isEmbed={true} />
                )}
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
class DataSetPage extends React.Component {
  state = {
    changedEmail: false
  };

  handleEmailChange = () => {
    this.setState({
      changedEmail: true
    });
  };

  render() {
    const {
      is_processed,
      is_available,
      email_address,
      s3_bucket,
      s3_key,
      dataSetId,
      ...props
    } = this.props;
    // 1. Check if the dataset is already processed, if true show a link to the download file
    if (is_processed) {
      if (is_available) {
        return <DataSetReady {...props} />;
      } else {
        return <DataSetExpired />;
      }
    } else {
      // 2. if it's not ready to be downloaded, then allow the user to set an email and receive an alert when its ready
      if (!email_address) {
        if (!this.state.changedEmail) {
          return <DatasetNoEmail {...props} />;
        } else {
          // 3. Allow the user to change its email if it's already added
          return (
            <DataSetWithEmail
              {...props}
              email={email_address}
              handleSubmit={this.handleEmailChange}
            />
          );
        }
      } else {
        return (
          <DataSetProcessing email={email_address} dataSetId={dataSetId} />
        );
      }
    }
  }
}

/**
 * This component gets rendereded in the DataSet page, when no email has been assigned
 */
function DatasetNoEmail({ id }) {
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

      <EmailForm dataSetId={id} />

      <div className="dataset__image">
        <img src={ProcessingImage} alt="We're processing your download file" />
      </div>
    </div>
  );
}

/**
 * In this state an email was already assigned to the Data Set
 */
class DataSetWithEmail extends React.Component {
  state = {
    emailUpdated: false
  };

  render() {
    const { id, email, handleSubmit } = this.props;

    return (
      <div>
        <div className="dataset__way-container">
          <section>
            <h1>Your dataset is on the way!</h1>

            {this.state.emailUpdated && (
              <div className="color-success">
                <i className="ion-checkmark-circled" /> Email updated
              </div>
            )}

            <ModalManager
              modalProps={{ className: 'dataset__email-modal', center: true }}
              component={showModal => (
                <p>
                  We have sent a confirmation email to {email} (
                  <Button onClick={() => showModal()} buttonStyle="link">
                    change
                  </Button>)
                </p>
              )}
            >
              {({ hideModal }) => (
                <div>
                  <h1 className="dataset__email-modal-title">Change Email</h1>
                  <h4>Enter New Email</h4>
                  <EmailForm
                    email={email}
                    dataSetId={id}
                    onSubmit={() => {
                      hideModal();
                      this._setEmailUpdated();
                      handleSubmit();
                    }}
                  />
                </div>
              )}
            </ModalManager>

            <p>If you haven’t received it, please check your spam folders.</p>
          </section>
          <div className="dataset__way-image">
            <img src={NextStepsImage} alt="" />
          </div>
        </div>
        {/*
          <section className="dataset__way-section">
            <h2>Next Steps...</h2>
            <p>What exactly is in my download file and how can I use it?</p>
            <p>How can I link sample metadata to the Gene Expression file?</p>
          </section>
        */}
      </div>
    );
  }

  _setEmailUpdated() {
    this.setState({ emailUpdated: true });

    // show email updated alert for 5 secs
    setTimeout(() => {
      this.setState({ emailUpdated: false });
    }, 5000);
  }
}

function DataSetProcessing({ email, dataSetId }) {
  return (
    <div className="dataset__way-container">
      <div className="dataset__processed-text">
        <h1>Your dataset is being processed.</h1>
        <p>
          An email with a download link will be sent to <strong>{email}</strong>{' '}
          when the dataset is ready or you can come back to this page later.
        </p>
      </div>
      <ProcessingDataset loop={true} />
    </div>
  );
}

function DataSetReady({ s3_bucket, s3_key }) {
  const downloadLink = getAmazonDownloadLinkUrl(s3_bucket, s3_key);
  return (
    <div className="dataset__way-container">
      <div>
        <h1>Your dataset is ready</h1>
        <a href={downloadLink} className="button">
          Download
        </a>
      </div>

      <div className="dataset__way-image">
        <img src={NextStepsImage} alt="" />
      </div>
    </div>
  );
}

function DataSetExpired() {
  return (
    <div>
      <h1>Sorry this data set expired.</h1>
    </div>
  );
}

/**
 * This form can be used to edit the email that's associated with a dataset
 */
let EmailForm = ({ handleSubmit }) => {
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
