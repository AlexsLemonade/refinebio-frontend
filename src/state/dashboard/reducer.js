import moment from 'moment';
import zip from 'lodash/zip';

// TODO: samples and experiments will most likely be moved into their own reducers in the future
const initialState = {
  stats: {
    samples: {
      timeline: []
    },
    experiments: {
      timeline: []
    }
  },

  samplesOverTime: [],
  experimentsOverTime: [],
  jobs: {},
  timeOptions: {
    timePoints: []
  }
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'DASHBOARD_REQUEST_SUCCESS': {
      const { stats } = action.data;
      return {
        ...state,
        stats
      };
    }
    case 'DASHBOARD_TIME_REQUESTS_SUCCESS': {
      const { samplesOverTime, experimentsOverTime, jobs } = action.data;
      return {
        ...state,
        samplesOverTime,
        experimentsOverTime,
        jobs
      };
    }
    case 'DASHBOARD_TIME_OPTIONS_UPDATED': {
      const { timeOptions } = action.data;
      return {
        ...state,
        timeOptions
      };
    }
    default: {
      return state;
    }
  }
};

export default dashboardReducer;

// chart selectors for creating chart data for individual charts on dashboard

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

const JOB_STATUS = ['open', 'pending', 'completed'];

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

const JOB_NAMES = ['survey_jobs', 'downloader_jobs', 'processor_jobs'];

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

  return zip(
    stats.survey_jobs.timeline,
    stats.downloader_jobs.timeline,
    stats.processor_jobs.timeline
  ).map(([surveyPoint, downloaderPoint, processorPoint], index, array) => {
    const [
      previousSurveyPoint,
      previousDownloaderPoint,
      previousProcessorPoint
    ] =
      index > 0
        ? array[index - 1]
        : [{ completed: 0 }, { completed: 0 }, { completed: 0 }];

    return {
      date: moment.utc(surveyPoint.end).format('lll'),
      survey: surveyPoint.completed + previousSurveyPoint.completed,
      downloader: downloaderPoint.completed + previousDownloaderPoint.completed,
      processor: processorPoint.completed + previousProcessorPoint.completed
    };
  });
}

export function getSamplesAndExperimentsCreatedOverTime(state) {
  const { samples, experiments } = state.dashboard.stats;

  return zip(samples.timeline, experiments.timeline).map(
    ([samplePoint, experimentPoint], index, array) => {
      const [previousSamplePoint, previousExperimentPoint] =
        index > 0 ? array[index - 1] : [{ total: 0 }, { total: 0 }];

      return {
        date: moment.utc(samplePoint.end).format('lll'),
        samples: samplePoint.total + previousSamplePoint.total,
        experiments: experimentPoint.total + previousExperimentPoint.total
      };
    }
  );
}

export function getJobsByStatusOverTime(state, jobName) {
  const { stats } = state.dashboard;

  return stats[jobName].timeline
    .map(dataPoint => ({
      date: moment.utc(dataPoint.end).format('lll'),
      total: dataPoint['total'],
      ...JOB_STATUS.reduce((accum, status) => {
        accum[status] = dataPoint[status];
        return accum;
      }, {})
    }))
    .map((dataPoint, index, array) => {
      if (index === 0) return dataPoint;

      const { total, open, pending, completed } = array[index - 1];
      return {
        ...dataPoint,
        total: dataPoint.total + total,
        open: dataPoint.open + open,
        pending: dataPoint.pending + pending,
        completed: dataPoint.completed + completed
      };
    });
}
