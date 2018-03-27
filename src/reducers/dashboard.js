const initialState = {
  stats: []
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
    default: {
      return state;
    }
  }
};

export default dashboardReducer;

export function getTotalLengthofQueuesByType(state) {
  const stats = state.dashboard.stats;
  return Object.keys(stats).map((job, i) => {
    return {
      name: job,
      value: stats[job].total
    };
  });
}
