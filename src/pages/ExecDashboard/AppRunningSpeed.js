import React from 'react';
import classnames from 'classnames';
import { IoIosWarning, IoMdCheckmarkCircle } from 'react-icons/io';
import sonic from './sonic.gif';

const RunningStatus = {
  NotRunning: 0,
  Running: 1,
  RunningFast: 2
};

export default function AppRunningSpeed({ data }) {
  const speed = getRunningSpeed(data);

  const title =
    speed === RunningStatus.RunningFast ? (
      <div className="running-status__stripes">
        <img src={sonic} alt="sonic" />
        We’re processing data at super sonic speed!
      </div>
    ) : speed === RunningStatus.Running ? (
      <div>
        <IoMdCheckmarkCircle /> We’re processing data
      </div>
    ) : (
      <div>
        <IoIosWarning /> We’re not processing data
      </div>
    );
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
