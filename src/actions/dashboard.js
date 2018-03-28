export const fetchDashboardData = () => {
  return async dispatch => {
    try {
      const stats = await (await fetch('./data/stats.json')).json();
      const samples = await (await fetch('./data/samples.json')).json();
      const experiments = await (await fetch('./data/experiments.json')).json();
      dispatch({
        type: 'DASHBOARD_REQUEST_SUCCESS',
        data: {
          stats,
          samples,
          experiments
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
};
