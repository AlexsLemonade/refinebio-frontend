const initialState = {
  stats: {},
  samples: {},
  experiments: {}
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
      name: jobType,
      value: stats[jobType].total
    };
  });
}

export function getAllEstimatedTimeTilCompletion(state, jobType) {
  const stats = state.dashboard.stats;

  if (!Object.keys(stats).length) return {};

  return Object.keys(stats).reduce((allEstimatedTimes, jobType) => {
    allEstimatedTimes[jobType] =
      stats[jobType].total * parseInt(stats[jobType].average_time, 10);
    return allEstimatedTimes;
  }, {});
}
