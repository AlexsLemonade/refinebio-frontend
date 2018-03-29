export const fetchDashboardData = () => {
  return async dispatch => {
    try {
      const stats = await (await fetch('/stats/')).json();
      const samples = await (await fetch('/samples/')).json();
      const experiments = await (await fetch('/experiments/')).json();
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
