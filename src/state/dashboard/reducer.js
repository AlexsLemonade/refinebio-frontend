import moment from 'moment';
import zip from 'lodash/zip';
import { accumulateByKeys } from '../../common/helpers';

// TODO: samples and experiments will most likely be moved into their own reducers in the future
const initialState = {
  stats: {}
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'DASHBOARD_REQUEST_SUCCESS': {
      const { stats } = action.data;
      return {
        stats
      };
    }
    default: {
      return state;
    }
  }
};

export default dashboardReducer;

// chart selectors for creating chart data for individual charts on dashboard
const JOB_NAMES = ['survey_jobs', 'downloader_jobs', 'processor_jobs'];
const JOB_STATUS = ['open', 'pending', 'completed'];

export function getTotalLengthOfQueuesByType(state) {
  const {
    survey_jobs,
    downloader_jobs,
    processor_jobs
  } = state.dashboard.stats;

  return [
    {
      name: 'Survey',
      value: survey_jobs.open + survey_jobs.pending
    },
    {
      name: 'Downloader',
      value: downloader_jobs.open + downloader_jobs.pending
    },
    {
      name: 'Processor',
      value: processor_jobs.open + processor_jobs.pending
    }
  ];
}

export function getJobsByStatus(state) {
  const stats = state.dashboard.stats;
  return JOB_NAMES.reduce((accum, jobType) => {
    accum[jobType] = JOB_STATUS.map(status => ({
      name: status,
      value: stats[jobType][status]
    }));
    return accum;
  }, {});
}

function convertSecToMinHours(sec) {
  const hours = Math.floor(sec / 3600),
    minutes = Math.round((sec % 3600) / 60);
  if (isNaN(hours) || isNaN(minutes)) {
    return `N/A`;
  } else {
    return `${hours} hr ${minutes} min`;
  }
}

export function getAllEstimatedTimeTilCompletion(state) {
  const stats = state.dashboard.stats;

  return JOB_NAMES.reduce((allEstimatedTimes, jobType) => {
    const estimateSec =
      (stats[jobType].open + stats[jobType].pending) *
      parseFloat(stats[jobType].average_time);

    // we're assuming that average_time is in seconds...
    allEstimatedTimes[jobType] = convertSecToMinHours(estimateSec);
    return allEstimatedTimes;
  }, {});
}

export function getExperimentsCount(state) {
  return state.dashboard.stats.experiments.total;
}

export function getSamplesCount(state) {
  return state.dashboard.stats.samples.total;
}

/**
 * Build an array of datapoints with a date property and the total of all jobs
 * run up to that point in time since the beginning of that time range for each
 * job type
 */
export function getJobsCompletedOverTime(state) {
  const stats = state.dashboard.stats;

  const result = zip(
    stats.survey_jobs.timeline,
    stats.downloader_jobs.timeline,
    stats.processor_jobs.timeline
  ).map(([surveyPoint, downloaderPoint, processorPoint], index, array) => ({
    date: moment.utc(surveyPoint.end).format('lll'),
    survey: surveyPoint.completed,
    downloader: downloaderPoint.completed,
    processor: processorPoint.completed
  }));

  return accumulateByKeys(result, ['survey', 'downloader', 'processor']);
}

export function getSamplesAndExperimentsCreatedOverTime(state) {
  const { samples, experiments } = state.dashboard.stats;

  const result = zip(samples.timeline, experiments.timeline).map(
    ([samplePoint, experimentPoint]) => ({
      date: moment.utc(samplePoint.end).format('lll'),
      samples: samplePoint.total,
      experiments: experimentPoint.total
    })
  );

  return accumulateByKeys(result, ['samples', 'experiments']);
}

export function getJobsByStatusOverTime(state, jobName) {
  const { stats } = state.dashboard;

  const result = stats[jobName].timeline.map(dataPoint => ({
    date: moment.utc(dataPoint.end).format('lll'),
    total: dataPoint['total'],
    ...JOB_STATUS.reduce((accum, status) => {
      accum[status] = dataPoint[status];
      return accum;
    }, {})
  }));

  return accumulateByKeys(result, ['total', ...JOB_STATUS]);
}
