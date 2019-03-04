import AppRunningSpeed from './AppRunningSpeed';
import SampleBreakdownBlock from './SampleBreakdownBlock';
import React from 'react';
import { useLoader } from '../../components/Loader';
import { numberFormatter } from '../../common/helpers';
import './ExecutiveDashboard.scss';
import Spinner from '../../components/Spinner';
import SamplesProcessedBlock from './SamplesProcessedBlock';
import { fetchDashboardData } from '../../api/dashboad';
import { useInterval } from '../../common/hooks';
import Header from './Header';

export default function ExecutiveDashboard() {
  const { data, hasError, refresh } = useLoader(fetchDashboardData);

  // refresh data every 25 mins
  useInterval(() => {
    if (!!data) refresh();
  }, 25 * 60 * 60 * 1000);

  return (
    <div className="exec-dash">
      <Header />

      {!data ? (
        <Spinner />
      ) : hasError ? (
        <h2 className="exec-dash__error">
          Temporarily under heavy traffic load.
        </h2>
      ) : (
        <>
          <div className="exec-dash__grid">
            <AppRunningSpeed data={data} />

            <div className="exec-dash__block">
              <div>Processing Speed</div>
              <div className="exec-dash__block-number">
                {data.processed_samples.last_hour > 0
                  ? data.processed_samples.last_hour
                  : '-'}
              </div>
              <div className="exec-dash__block-small">samples/hr</div>
            </div>

            <div className="exec-dash__block">
              <div>Total Samples</div>
              <div className="exec-dash__block-number">
                {numberFormatter(data.processed_samples.total)}
              </div>
              <div className="exec-dash__block-small">
                Estimated Value: $
                {numberFormatter(data.processed_samples.total * 1000)}
              </div>
            </div>

            <SampleBreakdownBlock data={data} />

            <SamplesProcessedBlock data={data} />
          </div>

          <div className="exec-dash__note">
            *Dollar values are estimated based on assumption 1 sample = $1000
          </div>
        </>
      )}
    </div>
  );
}
