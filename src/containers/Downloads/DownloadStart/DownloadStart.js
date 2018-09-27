/**
 * When a download is started the user visits the page /download?start=true
 * In this case we show a page with an email form and options to set the email and
 * start the download
 */

import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import TermsOfUse from '../../../components/TermsOfUse';
import Button from '../../../components/Button';
import { Ajax } from '../../../common/helpers';
import ProcessingImage from './download-processing.svg';
import { editEmail } from '../../../state/dataSet/actions';
import { startDownload } from '../../../state/download/actions';
import EmailForm from './EmailForm';

/**
 * This component gets rendereded in the DataSet page, when no email has been assigned
 */
class DownloadStart extends React.PureComponent {
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
              agreedToTerms={this.props.agreedToTerms}
              onSubmit={data => this._submitEmailForm(data)}
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
  }

  async _submitEmailForm({ email, termsOfService, receiveUpdates }) {
    const { dataSetId, dataSet } = this.props;
    await this.props.startDownload({
      email,
      termsOfService,
      receiveUpdates,
      dataSetId,
      dataSet
    });
  }
}
DownloadStart = connect(
  state => ({
    agreedToTerms: !!state.token
  }),
  {
    editEmail,
    startDownload
  }
)(DownloadStart);
export default DownloadStart;
