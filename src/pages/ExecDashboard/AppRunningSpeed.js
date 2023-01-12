import React from 'react';
import classnames from 'classnames';
import { IoIosWarning, IoMdCheckmarkCircle } from 'react-icons/io';
import Image from 'next/image';
import sonic from './sonic.gif';

const RunningStatus = {
  NotRunning: 0,
  RunningSlow: 3,
  Running: 1,
  RunningFast: 2,
};

export default function AppRunningSpeed({ data }) {
  const speed = getRunningSpeed(data);

  const title =
    speed === RunningStatus.RunningFast ? (
      <div className="running-status__stripes">
        <Image src={sonic} alt="sonic" />
        We’re processing data at super sonic speed!
      </div>
    ) : speed === RunningStatus.Running ||
      speed === RunningStatus.RunningSlow ? (
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
        'running-status--running':
          speed === RunningStatus.Running || RunningStatus.RunningSlow,
        'running-status--running-fast': speed === RunningStatus.RunningFast,
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
  const runningJobs = parseInt(stats.running_jobs, 10);

  if (runningJobs >= 100) {
    return RunningStatus.RunningFast;
  }
  if (runningJobs >= 10) {
    return RunningStatus.Running;
  }
  if (runningJobs >= 1) {
    return RunningStatus.RunningSlow;
  }
  return RunningStatus.NotRunning;
}
