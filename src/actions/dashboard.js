import moment from 'moment';

function getTimePoints(timeRange = 'week', timeUnit = 'day') {
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

function createTimeQueries(
  endPoint = '/jobs/survey/',
  timePoints = [],
  queryField = 'start_time'
) {
  const promiseArray = timePoints.map(async (datePoint, i) => {
    const gte = timePoints[0].utc().format();
    const lte = timePoints[i + 1]
      ? timePoints[i + 1].utc().format()
      : moment()
          .utc()
          .format();

    const response = await fetch(
      `${endPoint}?${queryField}__gte=${gte}&${queryField}__lte=${lte}`
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

      // samples and experiments will most likely go in another reducer when time comes
      const allSamples = await (await fetch('/samples/')).json();
      const allExperiments = await (await fetch('/experiments/')).json();
      const survey = await createTimeQueries('/jobs/survey/', timePoints);
      const processor = await createTimeQueries('/jobs/processor/', timePoints);
      const downloader = await createTimeQueries(
        '/jobs/downloader/',
        timePoints
      );

      const samplePoints = await createTimeQueries(
        '/samples/',
        timePoints,
        'created_at'
      );
      const experimentPoints = await createTimeQueries(
        '/experiments/',
        timePoints,
        'created_at'
      );

      dispatch({
        type: 'DASHBOARD_REQUEST_SUCCESS',
        data: {
          stats,
          samples: {
            count: allSamples.count,
            overTime: samplePoints.map(sample => sample.count)
          },
          experiments: {
            count: allExperiments.count,
            overTime: experimentPoints.map(experiment => experiment.count)
          },
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
