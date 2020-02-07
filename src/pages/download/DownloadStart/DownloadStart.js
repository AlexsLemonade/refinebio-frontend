/**
 * When a download is started the user visits the page /download?start=true
 * In this case we show a page with an email form and options to set the email and
 * start the download
 */

import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import ProcessingImage from './download-processing.svg';
import { startDownload } from '../../../state/download/actions';
import EmailForm from './EmailForm';
import { useLocalStorage } from '../../../common/hooks';

/**
 * This component gets rendereded in the DataSet page, when no email has been assigned
 */
let DownloadStart = ({ dataSetId, dataSet, agreedToTerms, startDownload }) => {
  const [emailAddress, setEmailAddress] = useLocalStorage('email-address', '');
  const submitEmailForm = async ({ email, termsOfService, receiveUpdates }) => {
    setEmailAddress(email);
    return startDownload({
      email,
      termsOfService,
      receiveUpdates,
      dataSetId,
      dataSet,
    });
  };

  return (
    <div className="dataset__container">
      <div className="dataset__message">
        <div>
          <Helmet>
            <title>Download - refine.bio</title>
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
            emailAddress={emailAddress}
            agreedToTerms={agreedToTerms}
            onSubmit={data => submitEmailForm(data)}
          />
          <div className="dataset__image">
            <img
              src={ProcessingImage}
              alt="We're processing your download file"
              className="img-responsive"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
DownloadStart = connect(
  state => ({
    agreedToTerms: !!state.token,
  }),
  {
    startDownload,
  }
)(DownloadStart);
export default DownloadStart;
