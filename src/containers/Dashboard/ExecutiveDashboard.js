import React from 'react';
import classnames from 'classnames';
import Loader from '../../components/Loader';
import { Ajax } from '../../common/helpers';
import './ExecutiveDashboard.scss';

const RunningStatus = {
  NotRunning: 0,
  Running: 1,
  RunningFast: 2
};

function AppStatus({ data }) {
  return (
    <div className="executive-dashboard">
      <AppRunningSpeed data={data} />

      <div>
        Total number of samples processed: <b>{data.samples.total}</b>
      </div>
    </div>
  );
}

class ExecutiveDashboard extends React.Component {
  render() {
    return (
      <div className="">
        <Loader fetch={fetchStats}>
          {({ isLoading, data }) =>
            isLoading ? (
              <div>Loading...</div>
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

function AppRunningSpeed({ data }) {
  const speed = getRunningSpeed(data);

  const title =
    speed === RunningStatus.RunningFast
      ? "We're running fast!!!"
      : speed === RunningStatus.Running
        ? 'We are running.'
        : 'We are not running';

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

  if (speed === RunningStatus.NotRunning) {
    return <div>asd</div>;
  }
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
