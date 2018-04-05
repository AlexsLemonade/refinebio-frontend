import moment from 'moment';

export function getTimePoints(timeRange = 'week', timeUnit = 'day') {
  const gtDate = moment().startOf(timeRange),
    timePoints = [];
  let datePoint = gtDate.clone().startOf(timeUnit);

  while (datePoint.isSameOrBefore(moment())) {
    timePoints.push(datePoint.clone());
    datePoint.add(1, timeUnit);
  }

  return timePoints;
}

function createTimeQuery(endPoint = '/jobs/survey/') {
  const timePoints = getTimePoints();
  const promiseArray = timePoints.map(async (datePoint, i) => {
    const gte = datePoint.utc().format(),
      lte = timePoints[i + 1]
        ? timePoints[i + 1].utc().format()
        : moment()
            .utc()
            .format();
    const response = await fetch(
      `${endPoint}?start_time__gte=${gte}&start_time__lte=${lte}`
    );
    const responseJSON = await response.json();

    return responseJSON;
  });
  return Promise.all(promiseArray);
}

export const fetchDashboardData = () => {
  return async dispatch => {
    try {
      const stats = await (await fetch('/stats/')).json();
      const samples = await (await fetch('/samples/')).json();
      const experiments = await (await fetch('/experiments/')).json();
      const survey = await createTimeQuery();
      const processor = await createTimeQuery('/jobs/processor/');
      const downloader = await createTimeQuery('/jobs/downloader/');

      dispatch({
        type: 'DASHBOARD_REQUEST_SUCCESS',
        data: {
          stats,
          samples,
          experiments,
          jobs: {
            survey,
            processor,
            downloader
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
};
