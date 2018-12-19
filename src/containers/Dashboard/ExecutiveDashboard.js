import React from 'react';
import classnames from 'classnames';
import Loader from '../../components/Loader';
import { Ajax, formatNumber } from '../../common/helpers';
import './ExecutiveDashboard.scss';
import apiData from '../../apiData';
import Spinner from '../../components/Spinner';

const RunningStatus = {
  NotRunning: 0,
  Running: 1,
  RunningFast: 2
};

function AppStatus({ data }) {
  const speed = getRunningSpeed(data);

  return (
    <div>
      <AppRunningSpeed speed={speed} />

      {data.processed_samples && (
        <div>
          Total number of samples processed:{' '}
          <b>{formatNumber(data.processed_samples.total, 0)}</b>
        </div>
      )}
    </div>
  );
}

class ExecutiveDashboard extends React.Component {
  render() {
    return (
      <div className="executive-dashboard">
        <Loader fetch={fetchStats}>
          {({ isLoading, data, hasError }) =>
            isLoading ? (
              <Spinner />
            ) : hasError ? (
              <div>
                <h2 className="executive-dashboard__error">
                  Temporarily under heavy traffic load.
                </h2>

                {apiData.stats &&
                  apiData.stats.processed_samples &&
                  apiData.stats.processed_samples.total && (
                    <div>
                      We have processed more than{' '}
                      <b>
                        {formatNumber(apiData.stats.processed_samples.total, 0)}
                      </b>{' '}
                      samples
                    </div>
                  )}
              </div>
            ) : (
              <div>
                <AppStatus data={data} />
              </div>
            )
          }
        </Loader>
      </div>
    );
  }
}

export default ExecutiveDashboard;

function AppRunningSpeed({ speed }) {
  const title =
    speed === RunningStatus.RunningFast
      ? 'We are running fast!'
      : speed === RunningStatus.Running
        ? 'We are running.'
        : 'We are not running.';

  return (
    <div>
      <div
        className={classnames('running-status', {
          'running-status--not-running': speed === RunningStatus.NotRunning,
          'running-status--running': speed === RunningStatus.Running,
          'running-status--running-fast': speed === RunningStatus.RunningFast
        })}
      />

      <h1>{title}</h1>
    </div>
  );
}

async function fetchStats() {
  return await Ajax.get('/stats');
}

/**
 * Returns how fast the system is running
 * ref https://github.com/AlexsLemonade/refinebio-frontend/issues/453#issuecomment-445031974
 * @param {*} stats stats object as returned by `/stats`
 */
function getRunningSpeed(stats) {
  const activeVolumes = stats.active_volumes.length;
  const runningNomadJobs = parseInt(stats.nomad_running_jobs, 10);

  if (activeVolumes > 5 && runningNomadJobs > 200) {
    return RunningStatus.RunningFast;
  } else if (activeVolumes > 5 && runningNomadJobs > 50) {
    return RunningStatus.Running;
  } else {
    return RunningStatus.NotRunning;
  }
}
