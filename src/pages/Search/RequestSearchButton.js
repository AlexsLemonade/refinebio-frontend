import React from 'react';
import { connect } from 'react-redux';
import { Field } from 'formik';
import { push } from '../../state/routerActions';
import Button from '../../components/Button';
import { submitSearchDataRequest } from '../../common/slack';
import PageModal from '../../components/Modal/PageModal';
import RequestDataForm from '../../components/RequestDataForm';

let RequestSearchButton = ({ query, push }) => {
  const [requestOpen, setRequestOpen] = React.useState(false);

  // consider undefined/null as a blank string
  query = query || '';

  return (
    <>
      <Button
        text="Let us know"
        buttonStyle="link"
        onClick={() => setRequestOpen(true)}
      />

      <PageModal isOpen={requestOpen}>
        <div className="layout__content">
          <RequestDataForm
            onClose={() => setRequestOpen(false)}
            onSubmit={async values => {
              // 1. report to slack
              await submitSearchDataRequest(query, values);

              // 2. redirect to landing page with notification
              push({
                pathname: '/',
                state: {
                  message: 'Request for Experiment Received!'
                }
              });
            }}
            renderHeader={({ errors, touched }) => (
              <>
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
                    validate={value =>
                      !value
                        ? 'Please list the experiment accession codes here'
                        : false
                    }
                  />
                  <div className="search-request__example">
                    Example: GSE3303, E-MEXP-3405, SRP2422
                  </div>
                </div>

                <div className="search-request__subtitle">
                  Help us priortize your request by answering these questions
                </div>
              </>
            )}
          />
        </div>
      </PageModal>
    </>
  );
};
RequestSearchButton = connect(
  null,
  { push }
)(RequestSearchButton);
export default RequestSearchButton;
