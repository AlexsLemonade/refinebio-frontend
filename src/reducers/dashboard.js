const initialState = {
  stats: {},
  samples: {},
  samplesOverTime: [],
  experiments: {},
  experimentsOverTime: [],
  jobs: {},
  timeOptions: {
    range: 'day',
    timePoints: []
  }
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'DASHBOARD_REQUEST_SUCCESS': {
      const { stats, samples, experiments } = action.data;
      return {
        ...state,
        stats,
        samples,
        experiments
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

export function getTotalLengthofQueuesByType(state) {
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
    minutes = Math.floor((sec % 3600) / 60);
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
      parseInt(stats[jobType].average_time, 10);
    // we're assuming that average_time is in seconds...
    allEstimatedTimes[jobType] = convertSecToMinHours(estimateSec);
    return allEstimatedTimes;
  }, {});
}

export function getExperimentsCount(state) {
  const { experiments: { count = 0 } } = state.dashboard;

  return count;
}

export function getSamplesCount(state) {
  const { samples: { count = 0 } } = state.dashboard;

  return count;
}

export function getJobsCompletedOverTime(state) {
  const { jobs, timeOptions: { timePoints } } = state.dashboard;

  return timePoints.map((time, i) => {
    const dataPoint = {
      date: time.utc().format()
    };
    Object.keys(jobs).forEach(jobName => {
      if (jobs[jobName].all.length === timePoints.length) {
        dataPoint[jobName] = jobs[jobName].all[i].count;
      }
    });
    return dataPoint;
  });
}

export function getSamplesCreatedOverTime(state) {
  const {
    samplesOverTime,
    experimentsOverTime,
    timeOptions: { timePoints }
  } = state.dashboard;

  return timePoints.map((time, i) => {
    const dataPoint = {
      date: time.utc().format(),
      samples: samplesOverTime[i],
      experiments: experimentsOverTime[i]
    };
    return dataPoint;
  });
}

export function getJobsByStatusOverTime(state, jobName = 'processor') {
  const { jobs, timeOptions: { timePoints } } = state.dashboard;

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
