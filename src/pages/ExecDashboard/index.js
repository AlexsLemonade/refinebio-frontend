import AppRunningSpeed from './AppRunningSpeed';
import SampleBreakdownBlock from './SampleBreakdownBlock';
import React from 'react';
import classnames from 'classnames';
import Loader, { useLoader } from '../../components/Loader';
import { Ajax, formatNumber } from '../../common/helpers';
import './ExecutiveDashboard.scss';
import apiData from '../../apiData';
import Spinner from '../../components/Spinner';
import SamplesProcessedBlock from './SamplesProcessedBlock';

export default function ExecutiveDashboard() {
  const { isLoading, data, hasError } = useLoader(fetchStats);

  return (
    <div className="exec-dash">
      {isLoading ? (
        <Spinner />
      ) : hasError ? (
        <h2 className="exec-dash__error">
          Temporarily under heavy traffic load.
        </h2>
      ) : (
        <>
          <AppRunningSpeed data={data} />

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
            *Dollar values are estimated based on assumption 1 sample = $1000
          </div>
        </>
      )}
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

  return {
    survey_jobs: {
      total: 57167,
      pending: 27595,
      completed: 19389,
      successful: 16738,
      open: 0,
      average_time: 797.964116,
      timeline: [
        {
          start: '2019-02-21T15:46:21.179497Z',
          end: '2019-02-22T15:46:21.179497Z',
          total: 0,
          completed: 0,
          pending: 0,
          failed: 0,
          open: 0
        },
        {
          start: '2019-02-22T15:46:21.179497Z',
          end: '2019-02-23T15:46:21.179497Z',
          total: 0,
          completed: 0,
          pending: 0,
          failed: 0,
          open: 0
        },
        {
          start: '2019-02-23T15:46:21.179497Z',
          end: '2019-02-24T15:46:21.179497Z',
          total: 0,
          completed: 0,
          pending: 0,
          failed: 0,
          open: 0
        },
        {
          start: '2019-02-24T15:46:21.179497Z',
          end: '2019-02-25T15:46:21.179497Z',
          total: 0,
          completed: 0,
          pending: 0,
          failed: 0,
          open: 0
        },
        {
          start: '2019-02-25T15:46:21.179497Z',
          end: '2019-02-26T15:46:21.179497Z',
          total: 0,
          completed: 0,
          pending: 0,
          failed: 0,
          open: 0
        },
        {
          start: '2019-02-26T15:46:21.179497Z',
          end: '2019-02-27T15:46:21.179497Z',
          total: 0,
          completed: 0,
          pending: 0,
          failed: 0,
          open: 0
        }
      ]
    },
    downloader_jobs: {
      total: 1339515,
      pending: 736150,
      completed: 518718,
      successful: 373167,
      open: 0,
      average_time: 200.856814,
      timeline: [
        {
          start: '2019-02-21T15:46:23.882064Z',
          end: '2019-02-22T15:46:23.882064Z',
          total: 0,
          completed: 0,
          pending: 0,
          failed: 0,
          open: 0
        },
        {
          start: '2019-02-22T15:46:23.882064Z',
          end: '2019-02-23T15:46:23.882064Z',
          total: 0,
          completed: 0,
          pending: 0,
          failed: 0,
          open: 0
        },
        {
          start: '2019-02-23T15:46:23.882064Z',
          end: '2019-02-24T15:46:23.882064Z',
          total: 0,
          completed: 0,
          pending: 0,
          failed: 0,
          open: 0
        },
        {
          start: '2019-02-24T15:46:23.882064Z',
          end: '2019-02-25T15:46:23.882064Z',
          total: 0,
          completed: 0,
          pending: 0,
          failed: 0,
          open: 0
        },
        {
          start: '2019-02-25T15:46:23.882064Z',
          end: '2019-02-26T15:46:23.882064Z',
          total: 0,
          completed: 0,
          pending: 0,
          failed: 0,
          open: 0
        },
        {
          start: '2019-02-26T15:46:23.882064Z',
          end: '2019-02-27T15:46:23.882064Z',
          total: 0,
          completed: 0,
          pending: 0,
          failed: 0,
          open: 0
        }
      ]
    },
    processor_jobs: {
      total: 956595,
      pending: 190360,
      completed: 475657,
      successful: 308761,
      open: 172,
      average_time: 1179.089652,
      timeline: [
        {
          start: '2019-02-21T15:46:27.039939Z',
          end: '2019-02-22T15:46:27.039939Z',
          total: 0,
          completed: 0,
          pending: 0,
          failed: 0,
          open: 0
        },
        {
          start: '2019-02-22T15:46:27.039939Z',
          end: '2019-02-23T15:46:27.039939Z',
          total: 0,
          completed: 0,
          pending: 0,
          failed: 0,
          open: 0
        },
        {
          start: '2019-02-23T15:46:27.039939Z',
          end: '2019-02-24T15:46:27.039939Z',
          total: 0,
          completed: 0,
          pending: 0,
          failed: 0,
          open: 0
        },
        {
          start: '2019-02-24T15:46:27.039939Z',
          end: '2019-02-25T15:46:27.039939Z',
          total: 0,
          completed: 0,
          pending: 0,
          failed: 0,
          open: 0
        },
        {
          start: '2019-02-25T15:46:27.039939Z',
          end: '2019-02-26T15:46:27.039939Z',
          total: 0,
          completed: 0,
          pending: 0,
          failed: 0,
          open: 0
        },
        {
          start: '2019-02-26T15:46:27.039939Z',
          end: '2019-02-27T15:46:27.039939Z',
          total: 0,
          completed: 0,
          pending: 0,
          failed: 0,
          open: 0
        }
      ]
    },
    samples: {
      total: 458472,
      timeline: [
        {
          start: '2019-02-21T15:46:30.745523Z',
          end: '2019-02-22T15:46:30.745523Z',
          total: 0
        },
        {
          start: '2019-02-22T15:46:30.745523Z',
          end: '2019-02-23T15:46:30.745523Z',
          total: 0
        },
        {
          start: '2019-02-23T15:46:30.745523Z',
          end: '2019-02-24T15:46:30.745523Z',
          total: 0
        },
        {
          start: '2019-02-24T15:46:30.745523Z',
          end: '2019-02-25T15:46:30.745523Z',
          total: 0
        },
        {
          start: '2019-02-25T15:46:30.745523Z',
          end: '2019-02-26T15:46:30.745523Z',
          total: 0
        },
        {
          start: '2019-02-26T15:46:30.745523Z',
          end: '2019-02-27T15:46:30.745523Z',
          total: 0
        }
      ]
    },
    experiments: {
      total: 12860,
      timeline: [
        {
          start: '2019-02-21T15:46:32.144683Z',
          end: '2019-02-22T15:46:32.144683Z',
          total: 0
        },
        {
          start: '2019-02-22T15:46:32.144683Z',
          end: '2019-02-23T15:46:32.144683Z',
          total: 0
        },
        {
          start: '2019-02-23T15:46:32.144683Z',
          end: '2019-02-24T15:46:32.144683Z',
          total: 0
        },
        {
          start: '2019-02-24T15:46:32.144683Z',
          end: '2019-02-25T15:46:32.144683Z',
          total: 0
        },
        {
          start: '2019-02-25T15:46:32.144683Z',
          end: '2019-02-26T15:46:32.144683Z',
          total: 0
        },
        {
          start: '2019-02-26T15:46:32.144683Z',
          end: '2019-02-27T15:46:32.144683Z',
          total: 0
        }
      ]
    },
    processed_samples: { total: 133217 },
    processed_experiments: { total: 9882 },
    input_data_size: 4281596985758,
    output_data_size: 0,
    active_volumes: []
  };

  return await Ajax.get('/stats');
}
