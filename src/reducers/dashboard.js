const initialState = {
  stats: {},
  samples: {},
  experiments: {},
  jobs: {}
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'DASHBOARD_REQUEST_SUCCESS': {
      const { stats, samples, experiments, jobs } = action.data;
      return {
        ...state,
        stats,
        samples,
        experiments,
        jobs
      };
    }
    default: {
      return state;
    }
  }
};

export default dashboardReducer;

export function getTotalLengthofQueuesByType(state) {
  const stats = state.dashboard.stats;
  return Object.keys(stats).map(jobType => {
    return {
      name: jobType.split('_')[0],
      value: stats[jobType].open + stats[jobType].pending
    };
  });
}

export function getJobsByStatusStatus(state) {
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

function convertMinToHours(sec) {
  const hours = Math.floor(sec / 3600),
    minutes = Math.floor((sec % 3600) / 60);
  return `${hours} hr ${minutes} min`;
}

export function getAllEstimatedTimeTilCompletion(state, jobType) {
  const stats = state.dashboard.stats;

  if (!Object.keys(stats).length) return {};

  return Object.keys(stats).reduce((allEstimatedTimes, jobType) => {
    const estimateSec =
      (stats[jobType].open + stats[jobType].pending) *
      parseInt(stats[jobType].average_time, 10);
    allEstimatedTimes[jobType] = convertMinToHours(estimateSec);
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

export function getSizeOfQueuesOverTime(state) {
  const { jobs } = state.dashboard;
  return jobs;
}
