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

function getTimeUnit(range) {
  switch (range) {
    case 'day': {
      return 'hour';
    }
    case 'year': {
      return 'month';
    }
    default: {
      return 'day';
    }
  }
}

function createTimeQuery(endPoint = '/jobs/survey/', timePoints = []) {
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

export const fetchDashboardData = timePoints => {
  return async dispatch => {
    try {
      const stats = await (await fetch('/stats/')).json();
      const samples = await (await fetch('/samples/')).json();
      const experiments = await (await fetch('/experiments/')).json();
      const survey = await createTimeQuery('/jobs/survey/', timePoints);
      const processor = await createTimeQuery('/jobs/processor/', timePoints);
      const downloader = await createTimeQuery('/jobs/downloader/', timePoints);

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

export const updatedTimeRange = (range = 'week') => {
  return dispatch => {
    const unit = getTimeUnit(range);
    const timePoints = getTimePoints(range, unit);
    dispatch(fetchDashboardData(timePoints));
    dispatch({
      type: 'DASHBOARD_TIME_OPTIONS_UPDATED',
      data: {
        timeOptions: {
          range,
          timePoints
        }
      }
    });
  };
};
