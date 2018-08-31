import React from 'react';
import moment from 'moment';
import { getAmazonDownloadLinkUrl } from '../../common/helpers';
import Loader from '../../components/Loader';
import NextStepsImage from './download-next-steps.svg';
import DownloadImage from './download-dataset.svg';
import DownloadExpiredImage from './download-expired-dataset.svg';
import './DataSet.scss';
import Button from '../../components/Button';
import { connect } from 'react-redux';
import {
  fetchDataSet,
  regenerateDataSet,
  startDownload
} from '../../state/dataSet/actions';
import ModalManager from '../../components/Modal/ModalManager';

import ProcessingDataset from '@haiku/dvprasad-processingdataset/react';

import ViewDownload from '../Downloads/ViewDownload';
import TermsOfUse from '../../components/TermsOfUse';

/**
 * Dataset page, has 3 states that correspond with the states on the backend
 * - Processing: The download file is being created
 * - Processed: The download file is ready
 * - Expired: Download files expire after some time
 * Related discussion https://github.com/AlexsLemonade/refinebio-frontend/issues/27
 */
let DataSet = ({
  startDownload,
  dataSet,
  fetchDataSet,
  match: {
    params: { id: dataSetId }
  }
}) => {
  return (
    <Loader updateProps={dataSetId} fetch={() => fetchDataSet(dataSetId)}>
      {({ isLoading }) =>
        isLoading ? (
          <div className="loader" />
        ) : (
          <div>
            <div className="dataset__container">
              <div className="dataset__message">
                <DataSetPage
                  dataSetId={dataSetId}
                  startDownload={startDownload}
                  {...dataSet}
                />
              </div>
            </div>
            {dataSetId &&
              (dataSet.is_processed || !!dataSet.email_address) && (
                <ViewDownload
                  dataSetId={dataSetId}
                  isEmbed={true}
                  isImmutable={true}
                />
              )}
          </div>
        )
      }
    </Loader>
  );
};
DataSet = connect(
  ({ dataSet }) => ({ dataSet }),
  {
    fetchDataSet,
    startDownload
  }
)(DataSet);
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
      dataSetId,
      expires_on,
      ...props
    } = this.props;
    // 1. Check if the dataset is already processed, if true show a link to the download file
    if (is_processed) {
      const isExpired = moment(expires_on).isBefore(Date.now());
      if (is_available && !isExpired) {
        return <DataSetReady {...props} />;
      } else {
        return <DataSetExpired />;
      }
    } else {
      // 2. If it's not ready to be downloaded, then allow the user to set an email and receive an alert when its ready
      if (!email_address) {
        // 3. Allow the user to change his/her email if it's already added
        // return (
        //   <DataSetWithEmail
        //     {...props}
        //     email={email_address}
        //     handleSubmit={this.handleEmailChange}
        //   />
        // );
      } else {
        return (
          <DataSetProcessing email={email_address} dataSetId={dataSetId} />
        );
      }
    }
  }
}

/**
 * In this state an email was already assigned to the Data Set
 */
// class DataSetWithEmail extends React.Component {
//   state = {
//     emailUpdated: false
//   };

//   render() {
//     const { id, email, handleSubmit } = this.props;

//     return (
//       <div>
//         <div className="dataset__way-container">
//           <section>
//             <h1>Your dataset is on the way!</h1>

//             {this.state.emailUpdated && (
//               <div className="color-success">
//                 <i className="ion-checkmark-circled" /> Email updated
//               </div>
//             )}

//             <ModalManager
//               modalProps={{ className: 'dataset__email-modal', center: true }}
//               component={showModal => (
//                 <p>
//                   We have sent a confirmation email to {email} (
//                   <Button onClick={() => showModal()} buttonStyle="link">
//                     change
//                   </Button>)
//                 </p>
//               )}
//             >
//               {({ hideModal }) => (
//                 <div>
//                   <h1 className="dataset__email-modal-title">Change Email</h1>
//                   <h4>Enter New Email</h4>
//                   <EmailForm
//                     email={email}
//                     dataSetId={id}
//                     onSubmit={() => {
//                       hideModal();
//                       this._setEmailUpdated();
//                       handleSubmit();
//                     }}
//                   />
//                 </div>
//               )}
//             </ModalManager>

//             <p>If you haven’t received it, please check your spam folders.</p>
//           </section>
//           <div className="dataset__way-image">
//             <img src={NextStepsImage} alt="" />
//           </div>
//         </div>
//         {/*
//           <section className="dataset__way-section">
//             <h2>Next Steps...</h2>
//             <p>What exactly is in my download file and how can I use it?</p>
//             <p>How can I link sample metadata to the Gene Expression file?</p>
//           </section>
//         */}
//       </div>
//     );
//   }

//   _setEmailUpdated() {
//     this.setState({ emailUpdated: true });

//     // show email updated alert for 5 secs
//     setTimeout(() => {
//       this.setState({ emailUpdated: false });
//     }, 5000);
//   }
// }

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

class DataSetReady extends React.Component {
  state = {
    agreedToTerms: false,
    hasToken: false
  };

  componentDidMount() {
    const token = localStorage.getItem('refinebio-token');
    if (!!token) {
      this.setState({ hasToken: true });
    }
  }

  handleAgreedToTerms = () => {
    this.setState({ agreedToTerms: !this.state.agreedToTerms });
  };

  handleSubmit = async () => {
    if (!this.state.hasToken) {
      const token = await (await fetch('/token/')).json();
      localStorage.setItem('refinebio-token', token.id);
    }
    const { s3_bucket, s3_key } = this.props;
    const downloadLink = getAmazonDownloadLinkUrl(s3_bucket, s3_key);
    window.location.href = downloadLink;
  };

  render() {
    return (
      <div className="dataset__way-container">
        <div className="dataset__processed-text">
          <h1>Your dataset is ready for download!</h1>
          <div className="dataset__way-container">
            {!this.state.hasToken && (
              <TermsOfUse
                agreedToTerms={this.state.agreedToTerms}
                handleToggle={this.handleAgreedToTerms}
              />
            )}
            <Button
              onClick={this.handleSubmit}
              isDisabled={!this.state.agreedToTerms && !this.state.hasToken}
            >
              Download Now
            </Button>
          </div>
        </div>

        <div className="dataset__way-image">
          <img src={DownloadImage} alt="" />
        </div>
      </div>
    );
  }
}

let DataSetExpired = ({ regenerateDataSet }) => (
  <div className="dataset__way-container">
    <div className="dataset__processed-text">
      <h1 className="dataset__way-title">Download Expired! </h1>
      <div className="dataset__way-subtitle">
        The download files for this dataset isn’t available anymore
      </div>
      <div className="dataset__way-container">
        <Button onClick={regenerateDataSet}>Regenerate Files</Button>
      </div>
    </div>

    <div className="dataset__way-image">
      <img src={DownloadExpiredImage} alt="" />
    </div>
  </div>
);
DataSetExpired = connect(
  () => ({}),
  {
    regenerateDataSet
  }
)(DataSetExpired);
