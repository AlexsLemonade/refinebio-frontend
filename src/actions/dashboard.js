export const fetchDashboardData = () => {
  return async dispatch => {
    try {
      const stats = await (await fetch('/stats/')).json();
      const samples = await (await fetch('/samples/')).json();
      const experiments = await (await fetch('/experiments/')).json();
      const survey = await (await fetch('/jobs/survey/')).json();
      // const processor = await (await fetch('/jobs/processor/')).json();
      // const downloader = await (await fetch('/jobs/downloader/')).json();
      dispatch({
        type: 'DASHBOARD_REQUEST_SUCCESS',
        data: {
          stats,
          samples,
          experiments,
          jobs: {
            survey:
              survey.results /*,
            processor,
            downloader*/
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
};
