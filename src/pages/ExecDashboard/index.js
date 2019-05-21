import React from 'react';
import AppRunningSpeed from './AppRunningSpeed';
import SampleBreakdownBlock from './SampleBreakdownBlock';
import { useLoader } from '../../components/Loader';
import { numberFormatter } from '../../common/helpers';
import './ExecutiveDashboard.scss';
import Spinner from '../../components/Spinner';
import SamplesProcessedBlock from './SamplesProcessedBlock';
import { fetchDashboardData } from '../../api/dashboad';
import { useInterval, useHistory } from '../../common/hooks';
import Header from './Header';
import classnames from 'classnames';
import ServerErrorPage from '../ServerError';

export default function ExecutiveDashboard() {
  const { data, hasError, refresh } = useLoader(fetchDashboardData);

  // refresh data every 5 mins
  useInterval(() => {
    if (data) refresh();
  }, 5 * 60 * 1000);

  const { params } = useHistory();
  const isTv = !!params.tv;

  return (
    <div className={classnames({ 'exec-dash': true, 'exec-dash--tv': isTv })}>
      <Header isTv={isTv} />

      {!data ? (
        <Spinner />
      ) : hasError ? (
        <ServerErrorPage />
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
