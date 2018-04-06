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

const fetchDataOverTime = timePoints => {
  return async dispatch => {
    const survey = await createTimeQueries('/jobs/survey/', timePoints);
    const processor = await createTimeQueries('/jobs/processor/', timePoints);
    const downloader = await createTimeQueries('/jobs/downloader/', timePoints);

    const samples = await createTimeQueries(
      '/samples/',
      timePoints,
      'created_at'
    );
    const experiments = await createTimeQueries(
      '/experiments/',
      timePoints,
      'created_at'
    );

    dispatch({
      type: 'DASHBOARD_TIME_REQUESTS_SUCCESS',
      data: {
        jobs: {
          survey,
          processor,
          downloader
        },
        samplesOverTime: samples.map(sample => sample.count),
        experimentsOverTime: experiments.map(experiments => experiments.count)
      }
    });
  };
};

export const fetchDashboardData = () => {
  return async dispatch => {
    try {
      const stats = await (await fetch('/stats/')).json();

      // samples and experiments will most likely go in another reducer when time comes
      const allSamples = await (await fetch('/samples/')).json();
      const allExperiments = await (await fetch('/experiments/')).json();

      dispatch({
        type: 'DASHBOARD_REQUEST_SUCCESS',
        data: {
          stats,
          samples: {
            count: allSamples.count
          },
          experiments: {
            count: allExperiments.count
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
    dispatch(fetchDataOverTime(timePoints));
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
