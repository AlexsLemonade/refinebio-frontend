import { Ajax } from '../common/helpers';

export async function fetchDashboardData(range = null) {
  if (!range)
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
      active_volumes: [1, 2, 3, 4, 5, 6],
      nomad_running_jobs: 300
    };

  if (range === 'week')
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
            start: '2019-02-21T18:33:45.650875Z',
            end: '2019-02-22T18:33:45.650875Z',
            total: 0,
            completed: 0,
            pending: 0,
            failed: 0,
            open: 0
          },
          {
            start: '2019-02-22T18:33:45.650875Z',
            end: '2019-02-23T18:33:45.650875Z',
            total: 0,
            completed: 0,
            pending: 0,
            failed: 0,
            open: 0
          },
          {
            start: '2019-02-23T18:33:45.650875Z',
            end: '2019-02-24T18:33:45.650875Z',
            total: 0,
            completed: 0,
            pending: 0,
            failed: 0,
            open: 0
          },
          {
            start: '2019-02-24T18:33:45.650875Z',
            end: '2019-02-25T18:33:45.650875Z',
            total: 0,
            completed: 0,
            pending: 0,
            failed: 0,
            open: 0
          },
          {
            start: '2019-02-25T18:33:45.650875Z',
            end: '2019-02-26T18:33:45.650875Z',
            total: 0,
            completed: 0,
            pending: 0,
            failed: 0,
            open: 0
          },
          {
            start: '2019-02-26T18:33:45.650875Z',
            end: '2019-02-27T18:33:45.650875Z',
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
            start: '2019-02-21T18:33:47.875000Z',
            end: '2019-02-22T18:33:47.875000Z',
            total: 0,
            completed: 0,
            pending: 0,
            failed: 0,
            open: 0
          },
          {
            start: '2019-02-22T18:33:47.875000Z',
            end: '2019-02-23T18:33:47.875000Z',
            total: 0,
            completed: 0,
            pending: 0,
            failed: 0,
            open: 0
          },
          {
            start: '2019-02-23T18:33:47.875000Z',
            end: '2019-02-24T18:33:47.875000Z',
            total: 0,
            completed: 0,
            pending: 0,
            failed: 0,
            open: 0
          },
          {
            start: '2019-02-24T18:33:47.875000Z',
            end: '2019-02-25T18:33:47.875000Z',
            total: 0,
            completed: 0,
            pending: 0,
            failed: 0,
            open: 0
          },
          {
            start: '2019-02-25T18:33:47.875000Z',
            end: '2019-02-26T18:33:47.875000Z',
            total: 0,
            completed: 0,
            pending: 0,
            failed: 0,
            open: 0
          },
          {
            start: '2019-02-26T18:33:47.875000Z',
            end: '2019-02-27T18:33:47.875000Z',
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
            start: '2019-02-21T18:33:50.862088Z',
            end: '2019-02-22T18:33:50.862088Z',
            total: 0,
            completed: 0,
            pending: 0,
            failed: 0,
            open: 0
          },
          {
            start: '2019-02-22T18:33:50.862088Z',
            end: '2019-02-23T18:33:50.862088Z',
            total: 0,
            completed: 0,
            pending: 0,
            failed: 0,
            open: 0
          },
          {
            start: '2019-02-23T18:33:50.862088Z',
            end: '2019-02-24T18:33:50.862088Z',
            total: 0,
            completed: 0,
            pending: 0,
            failed: 0,
            open: 0
          },
          {
            start: '2019-02-24T18:33:50.862088Z',
            end: '2019-02-25T18:33:50.862088Z',
            total: 0,
            completed: 0,
            pending: 0,
            failed: 0,
            open: 0
          },
          {
            start: '2019-02-25T18:33:50.862088Z',
            end: '2019-02-26T18:33:50.862088Z',
            total: 0,
            completed: 0,
            pending: 0,
            failed: 0,
            open: 0
          },
          {
            start: '2019-02-26T18:33:50.862088Z',
            end: '2019-02-27T18:33:50.862088Z',
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
            start: '2019-02-21T18:33:53.381804Z',
            end: '2019-02-22T18:33:53.381804Z',
            total: 0
          },
          {
            start: '2019-02-22T18:33:53.381804Z',
            end: '2019-02-23T18:33:53.381804Z',
            total: 0
          },
          {
            start: '2019-02-23T18:33:53.381804Z',
            end: '2019-02-24T18:33:53.381804Z',
            total: 0
          },
          {
            start: '2019-02-24T18:33:53.381804Z',
            end: '2019-02-25T18:33:53.381804Z',
            total: 0
          },
          {
            start: '2019-02-25T18:33:53.381804Z',
            end: '2019-02-26T18:33:53.381804Z',
            total: 0
          },
          {
            start: '2019-02-26T18:33:53.381804Z',
            end: '2019-02-27T18:33:53.381804Z',
            total: 0
          }
        ]
      },
      experiments: {
        total: 12860,
        timeline: [
          {
            start: '2019-02-21T18:33:54.794155Z',
            end: '2019-02-22T18:33:54.794155Z',
            total: 0
          },
          {
            start: '2019-02-22T18:33:54.794155Z',
            end: '2019-02-23T18:33:54.794155Z',
            total: 0
          },
          {
            start: '2019-02-23T18:33:54.794155Z',
            end: '2019-02-24T18:33:54.794155Z',
            total: 0
          },
          {
            start: '2019-02-24T18:33:54.794155Z',
            end: '2019-02-25T18:33:54.794155Z',
            total: 0
          },
          {
            start: '2019-02-25T18:33:54.794155Z',
            end: '2019-02-26T18:33:54.794155Z',
            total: 0
          },
          {
            start: '2019-02-26T18:33:54.794155Z',
            end: '2019-02-27T18:33:54.794155Z',
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

  return range
    ? await Ajax.get('/stats/', { range })
    : await Ajax.get('/stats');
}
