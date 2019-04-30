import React from 'react';
import { useLocalStorage } from '../../common/hooks';
import Button from '../../components/Button';
import PageModal from '../../components/Modal/PageModal';
import RequestDataForm from '../../components/RequestDataForm';
import { IoIosCheckmarkCircle, IoIosInformationCircle } from 'react-icons/io';

export default function RequestExperimentButton({ accessionCode }) {
  const [requestOpen, setRequestOpen] = React.useState(false);
  const [requestedExperiments, setRequestedExperiments] = useLocalStorage(
    'requested-experiments',
    []
  );

  if (!accessionCode) return null;
  return (
    <React.Fragment>
      {requestedExperiments.includes(accessionCode) ? (
        <div className="color-success info">
          <IoIosCheckmarkCircle className="info__icon" />
          Experiment requested
        </div>
      ) : (
        <Button
          text="Request Experiment"
          buttonStyle="secondary"
          onClick={() => setRequestOpen(true)}
        />
      )}

      <PageModal isOpen={requestOpen}>
        <div className="layout__content">
          <RequestDataForm
            onClose={() => setRequestOpen(false)}
            onSubmit={values => {
              // 1. report to slack

              // 2. mark experiment as requested in local storage
              setRequestedExperiments([...requestedExperiments, accessionCode]);

              // 3. close page
              setRequestOpen(false);
            }}
            renderHeader={() => (
              <>
                <h1 className="search-request__title">
                  Request Experiment '{accessionCode}'
                </h1>
                <p className="mb-2">
                  Help us priortize your request by answering these questions.
                </p>
              </>
            )}
          />
        </div>
      </PageModal>
    </React.Fragment>
  );
}
