import React from 'react';
import classnames from 'classnames';

const RunningStatus = {
  NotRunning: 0,
  Running: 1,
  RunningFast: 2
};

export default function AppRunningSpeed({ data }) {
  const speed = getRunningSpeed(data);

  const title =
    speed === RunningStatus.RunningFast
      ? 'We’re processing data at super sonic speed!'
      : speed === RunningStatus.Running
        ? 'We’re processing data'
        : 'We’re not processing data';
  return (
    <div
      className={classnames('running-status', {
        'running-status--not-running': speed === RunningStatus.NotRunning,
        'running-status--running': speed === RunningStatus.Running,
        'running-status--running-fast': speed === RunningStatus.RunningFast
      })}
    >
      {title}
    </div>
  );
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
