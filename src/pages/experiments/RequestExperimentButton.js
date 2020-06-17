import React from 'react';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { useLocalStorage } from '../../common/hooks';
import Button from '../../components/Button';
import PageModal from '../../components/Modal/PageModal';
import RequestDataForm from '../../components/RequestDataForm';
import { submitExperimentDataRequest as slackRequest } from '../../common/slack';
import { submitExperimentDataRequest as githubRequest } from '../../common/github';
import { submitExperimentDataRequest as hubspotRequest } from '../../common/hubspot';

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
              // 1. create GitHub issue for refinebio repo
              const response = await githubRequest(accessionCode);

              // Send to slack instead if GitHub request failed
              if (!response.ok) {
                await slackRequest(accessionCode, values);
              }

              // 2. add contact to HubSpot list
              await hubspotRequest(accessionCode, values);

              // 3. mark experiment as requested in local storage
              setRequestedExperiments([...requestedExperiments, accessionCode]);

              // 4. close page
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
