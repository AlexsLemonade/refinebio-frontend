import { SampleBreakdownBlock } from './SampleBreakdownBlock';
import React from 'react';
import classnames from 'classnames';
import Loader from '../../components/Loader';
import { Ajax, formatNumber } from '../../common/helpers';
import './ExecutiveDashboard.scss';
import apiData from '../../apiData';
import Spinner from '../../components/Spinner';
import SamplesProcessedBlock from './SamplesProcessedBlock';

const RunningStatus = {
  NotRunning: 0,
  Running: 1,
  RunningFast: 2
};

class ExecutiveDashboard extends React.Component {
  render() {
    return (
      <div className="exec-dash">
        <Loader fetch={fetchStats}>
          {({ isLoading, data, hasError }) => {
            if (isLoading) return <Spinner />;
            if (hasError)
              return (
                <h2 className="exec-dash__error">
                  Temporarily under heavy traffic load.
                </h2>
              );

            // Executive dashboard
            return (
              <>
                <AppRunningSpeed speed={getRunningSpeed(data)} />

                <div className="exec-dash__grid">
                  <div className="exec-dash__block">
                    <div>Processing Speed</div>
                    <div className="exec-dash__block-number">-</div>
                    <div className="exec-dash__block-small">samples/hr</div>
                  </div>

                  <div className="exec-dash__block">
                    <div>Total Samples</div>
                    <div className="exec-dash__block-number">
                      {formatNumber(data.processed_samples.total, 0)}
                    </div>
                    <div className="exec-dash__block-small">
                      Estimated Value: $20M
                    </div>
                  </div>

                  <SampleBreakdownBlock data={data} />

                  <SamplesProcessedBlock data={data} />
                </div>

                <div className="exec-dash__note">
                  *Dollar values are estimated based on assumption 1 sample =
                  $1000
                </div>
              </>
            );
          }}
        </Loader>
      </div>
    );
  }
}

export default ExecutiveDashboard;

function AppRunningSpeed({ speed }) {
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

async function fetchStats() {
  return {
    survey_jobs: {
      total: 57167,
      pending: 27595,
      completed: 19389,
      successful: 16738,
      open: 0,
      average_time: 797.964116
    },
    downloader_jobs: {
      total: 1339515,
      pending: 736150,
      completed: 518718,
      successful: 373167,
      open: 0,
      average_time: 200.856814
    },
    processor_jobs: {
      total: 956595,
      pending: 190360,
      completed: 475657,
      successful: 308761,
      open: 172,
      average_time: 1179.089652
    },
    samples: {
      total: 458472,

      organism: {
        DANIO_RERIO: 58472,
        MOUSE: 23000,
        HOMO_SAPIENS: 4100
      },

      technology: {
        RNA_SEQ: 23000,
        MICROARRAY: 15000
      }
    },
    experiments: { total: 12860 },
    processed_samples: { total: 133217 },
    processed_experiments: { total: 9882 },
    input_data_size: 4281596985758,
    output_data_size: 0,
    active_volumes: []
  };

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
