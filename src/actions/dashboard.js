export const fetchDashboardData = () => {
  return async dispatch => {
    try {
      const response = await (await fetch('./data/stats.json')).json();
      dispatch({
        type: 'DASHBOARD_REQUEST_SUCCESS',
        data: {
          stats: response
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
};
