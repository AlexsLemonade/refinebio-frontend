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
  const stats = state.dashboard.stats;
  return Object.keys(stats).map(jobType => {
    return {
      name: jobType.split('_')[0],
      value: stats[jobType].open + stats[jobType].pending
    };
  });
}

export function getJobsByStatus(state) {
  const stats = state.dashboard.stats;
  return Object.keys(stats).reduce((accum, jobType) => {
    accum[jobType] = Object.keys(stats[jobType]).reduce(
      (allStatuses, status) => {
        if (status !== 'total' && status !== 'average_time') {
          allStatuses.push({
            name: status,
            value: stats[jobType][status]
          });
        }
        return allStatuses;
      },
      []
    );
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

export function getAllEstimatedTimeTilCompletion(state, jobType) {
  const stats = state.dashboard.stats;

  if (!Object.keys(stats).length) return {};

  return Object.keys(stats).reduce((allEstimatedTimes, jobType) => {
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
      date: moment.utc(surveyPoint.start).format('lll'),
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
        date: moment.utc(samplePoint.start).format('lll'),
        samples: samplePoint.total + previousSamplePoint.total,
        experiments: experimentPoint.total + previousExperimentPoint.total
      };
    }
  );
}

export function getJobsByStatusOverTime(state, jobName = 'processor') {
  const {
    jobs,
    timeOptions: { timePoints }
  } = state.dashboard;

  const jobType = jobs[jobName] || [];

  return timePoints.map((time, i) => {
    const dataPoint = {
      date: time.utc().format()
    };

    Object.keys(jobType).forEach(status => {
      if (status === 'all') return;
      dataPoint[status] = jobType[status][i];
    });

    return dataPoint;
  });
}
