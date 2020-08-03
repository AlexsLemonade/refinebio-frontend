import React from 'react';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { useLocalStorage } from '../../common/hooks';
import Button from '../../components/Button';
import PageModal from '../../components/Modal/PageModal';
import RequestDataForm from '../../components/RequestDataForm';
import { dataRequest } from '../../api/requests';

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
            useMissingDataImage={false}
            onClose={() => setRequestOpen(false)}
            onSubmit={async values => {
              // 1. send experiment request
              const requestValues = values;
              requestValues.accession_codes = accessionCode;
              requestValues.request_type = 'experiment';
              dataRequest({ requestValues });

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
                  Help us prioritize your request by answering these questions.
                </p>
              </>
            )}
          />
        </div>
      </PageModal>
    </React.Fragment>
  );
}
